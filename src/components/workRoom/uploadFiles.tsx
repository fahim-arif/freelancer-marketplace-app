import {
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Tooltip,
  Typography,
  FormHelperText,
  Drawer,
  Grid,
  useTheme,
  IconButton,
  styled,
} from '@mui/material';
import IApiError from 'global/interfaces/api';
import { IChatFile } from 'global/interfaces/chatMessage';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { IDeliverableForApproval } from 'global/interfaces/contract';
import * as React from 'react';
import { saveChatFile } from 'services/storageService';
import { showUIError } from 'utils/errorHandler';
import { getFileType } from 'utils/file';
import ChatMessageUploadImage from 'components/workRoom/chatMessageUploadImage';
import { UserAuth } from 'contexts/AuthContext';
import { newFileMessage } from 'services/chatMessageService';
import useProgressBar from 'global/hooks/useProgressBar';
import DeliverablesForApprovalSelect from './deliverablesForApprovalSelect';
import { StyledDrawerGrid } from 'components/common/StyledDrawerGrid';
import CloseIcon from '@mui/icons-material/Close';

interface IChatFileUpload extends IChatFile {
  sending?: boolean;
}

interface IUploadFilesProps {
  user: UserAuth | null;
  selectedThread?: IChatUserThread;
  selectedFiles: FileList | null;
  handleUploadFilesClose: () => void;
  hasActiveSellingContract: boolean;
}

const StyledGrid = styled(Grid)({
  marginTop: '24px',
});

export default function UploadFiles(props: IUploadFilesProps): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [selectedDeliverables, setSelectedDeliverables] = React.useState<IDeliverableForApproval[]>([]);
  const [uploadedChatFiles, setUploadedChatFiles] = React.useState<IChatFileUpload[]>([]);
  const [uploadingComplete, setUploadingComplete] = React.useState<boolean>(false);
  const [sendClicked, setSendClicked] = React.useState<boolean>(false);
  const [progress, showProgress] = useProgressBar();
  const numCols = 3;
  const gap = 10;
  const theme = useTheme();

  const handleSelectedDeliverblesChange = (deliverables: IDeliverableForApproval[]): void => {
    setSelectedDeliverables(deliverables);
  };

  const handleClose = (): void => {
    setOpen(false);
    props.handleUploadFilesClose();
  };

  const handleSend = (): void => {
    setSendClicked(true);
    if (uploadingComplete) {
      setOpen(false);
      showProgress(true);
      newFileMessage(props.selectedThread?.chatThreadId ?? '', uploadedChatFiles, selectedDeliverables)
        .then(() => {
          // Add message to UI
          showProgress(false);
          props.handleUploadFilesClose();
        })
        .catch((err: IApiError) => {
          showUIError('Could not send message. Please refresh the page: ' + err.message);
        });
    }
  };

  const createTemporaryChatFiles = (files: FileList, chatThreadId: string): IChatFileUpload[] => {
    const chatFiles: IChatFileUpload[] = [];
    /* eslint-disable no-unmodified-loop-condition */
    for (let i = 0; files !== null && i < files?.length; i++) {
      const nameParts: string[] = files[i].name.split('.');
      const extension = `.${nameParts.pop() ?? ''}`;
      const fileName = files[i].name.replace(extension, '');
      const chatFile: IChatFileUpload = {
        chatThreadId,
        fileName,
        extension,
        fileType: getFileType(files[i].type),
        sending: true,
      };
      chatFiles.push(chatFile);
    }

    return chatFiles;
  };

  const uploadFilesToServer = (): void => {
    if (props.selectedFiles !== null && props.selectedThread?.chatThreadId !== undefined) {
      const initialFiles = createTemporaryChatFiles(props.selectedFiles, props.selectedThread.chatThreadId);
      setUploadedChatFiles(initialFiles);

      const tempUploadedChatFiles: IChatFile[] = [];
      for (let i = 0; i < props.selectedFiles.length; i++) {
        const file = props.selectedFiles[i];
        let controller: AbortController | null = new AbortController();
        saveChatFile(file, props.selectedThread?.chatThreadId, controller)
          .then((fileResponse: IChatFileUpload) => {
            controller = null;
            tempUploadedChatFiles.push(fileResponse);
            setUploadedChatFiles(current => current.map((item, index) => (index === i ? fileResponse : item)));

            if (props.selectedFiles !== null && tempUploadedChatFiles.length === props.selectedFiles.length) {
              setUploadingComplete(true);
            }
          })
          .catch((err: IApiError) => {
            showUIError(err.message);
          });
      }
    }
  };

  React.useEffect(() => {
    setSelectedDeliverables([]);
    setUploadingComplete(false);
    setSendClicked(false);
    const chatThreadId: string = props.selectedThread?.chatThreadId ?? '';
    if (chatThreadId != '' && props.selectedFiles !== null && props.selectedFiles.length > 0) {
      setOpen(true);
      uploadFilesToServer();
    }
  }, [props.selectedThread, props.selectedFiles, props.user]);

  return (
    <React.Fragment>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        aria-labelledby="upload-files-dialog-title"
        aria-describedby="upload-files-description"
      >
        <StyledDrawerGrid container>
          <Grid item xs={10}>
            <Typography variant="h6" color={theme.palette.grey[900]}>
              Send Deliverables For Approval
            </Typography>
          </Grid>
          <Grid item xs={2} container justifyContent="flex-end">
            <IconButton onClick={() => handleClose()}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Files</Typography>
          </Grid>
          <Grid item xs={12}>
            <ImageList cols={numCols} gap={gap}>
              {uploadedChatFiles.map(item => (
                <ImageListItem key={item.fileName + item.extension}>
                  <ChatMessageUploadImage {...item} gap={gap} numCols={numCols} />
                  <ImageListItemBar
                    title={
                      <Tooltip title={item.fileName + item.extension}>
                        <Typography
                          sx={{
                            display: 'block',
                            paddingRight: 1,
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            width: '125px',
                            overflow: 'hidden',
                          }}
                          component="span"
                          variant="body1"
                          color="text.primary"
                        >
                          {item.fileName + item.extension}
                        </Typography>
                      </Tooltip>
                    }
                    position="below"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          <Grid item xs={12}>
            {sendClicked && !uploadingComplete && (
              <FormHelperText error sx={{ mb: 1 }}>
                Files are still uploading
              </FormHelperText>
            )}
          </Grid>
          {props.hasActiveSellingContract && (
            <>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Deliverables</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                  Optional. Send one or more deliverables for approval.
                </Typography>
                <DeliverablesForApprovalSelect
                  handleSelectedDeliverblesChange={handleSelectedDeliverblesChange}
                  user={props.user}
                  selectedThread={props.selectedThread}
                />
              </Grid>
            </>
          )}
          <StyledGrid container item>
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </StyledGrid>
        </StyledDrawerGrid>
      </Drawer>
      {progress}
    </React.Fragment>
  );
}
