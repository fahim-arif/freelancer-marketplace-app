import { IChatFile, IChatMessageDisplay } from 'global/interfaces/chatMessage';
import Typography from '@mui/material/Typography';
import { ImageList, ImageListItem, ImageListItemBar, styled, useMediaQuery, useTheme } from '@mui/material';
import { createChatFileUrl } from 'services/storageService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { saveAs } from 'file-saver';
import ChatMessageUploadImage from 'components/workRoom/chatMessageUploadImage';
import Tooltip from '@mui/material/Tooltip';

const EllipsisWrapperDiv = styled('div')`
  display: table;
  table-layout: fixed;
  width: 100%;
  white-space: nowrap;
`;

const EllipsisTypography = styled(Typography)(({ theme }) => ({
  display: 'table-cell',
  color: theme.palette.grey[700],
}));

EllipsisTypography.defaultProps = {
  noWrap: true,
};

const StyledImageListItemBar = styled(ImageListItemBar)(() => ({
  '.MuiImageListItemBar-titleWrap': {
    paddingBottom: '0px',
  },
}));

export default function ChatMessageUpload(props: IChatMessageDisplay): JSX.Element {
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
  const matchesLg = useMediaQuery(theme.breakpoints.up('lg'), { noSsr: true });
  const numCols = matchesSm ? (matchesLg ? 4 : 3) : 2;
  const gap = 10;

  const onDownloadClick = (file: IChatFile): void => {
    if (props.sending === undefined || !props.sending) {
      createChatFileUrl(file)
        .then((url: string) => {
          // Replace temporary message with one retrieved from the server
          const fileName = file.fileName + file.extension;
          saveAs(url, fileName);
        })
        .catch((err: IApiError) => {
          showUIError('Could not download the file. Please contact support. Error: ' + err.message);
        });
    }
  };
  return (
    <ImageList cols={numCols} gap={gap}>
      {props.files?.map(item => (
        <ImageListItem
          key={item.fileName + item.extension}
          onClick={() => onDownloadClick(item)}
          sx={{ cursor: 'pointer', marginTop: '6px' }}
        >
          <ChatMessageUploadImage {...item} numCols={numCols} gap={gap} sending={props.sending} />
          <StyledImageListItemBar
            title={
              <Tooltip title={item.fileName + item.extension}>
                <EllipsisWrapperDiv>
                  <EllipsisTypography variant="subtitle2">{item.fileName + item.extension}</EllipsisTypography>
                </EllipsisWrapperDiv>
              </Tooltip>
            }
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
