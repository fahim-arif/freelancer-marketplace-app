import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import './MultiFileUpload.sass';
import NoFilesIcon from 'components/common/StyledIcons/NoFilesIcon';
import { FileType } from 'global/enums/fileTypes';
import { FormHelperText, ImageList, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import { IPortfolioFile, IUploadQueue } from 'global/interfaces/user';
import React, { useRef, useState } from 'react';
import FileViewerDialog from '../FileViewerDialog';
import { getPreUploadFormFile } from 'utils/file';
import PortfolioTiles from './PortfolioTiles';
import UploadProgress from './UploadProgress';
import { IFileMetadata } from 'global/interfaces/file';

interface IMultiFileUploadProps {
  onAddFile: (file: IFileMetadata) => void;
  onDelete: (path: string) => void;
  onNameChange: (path: string, fileName: string) => void;
  onUploadStatusChange: (status: boolean) => void;
  onFeaturedSelected: (id: string) => void;
  files: IPortfolioFile[];
  error?: string;
}

export default function MultiFileUpload(props: IMultiFileUploadProps): JSX.Element {
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [viewerActiveIndex, setViewerActiveIndex] = useState<number>(0);
  const [uploadQueue, setUploadQueue] = useState<IUploadQueue[]>([]);
  const currentQueue = useRef<IUploadQueue[]>([]);
  const cancelledQueue = useRef<string[]>([]);
  const theme = useTheme();
  const matchesSm = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true });
  const matchesMd = useMediaQuery(theme.breakpoints.up('md'), { noSsr: true });
  const handleViewerClose: React.MouseEventHandler = () => {
    setIsViewerOpen(false);
    setViewerActiveIndex(0);
  };

  const onClickFile = (e: React.MouseEvent, index: number, fileType: FileType): void => {
    // Don't open dialog for PDF as open function from component will be called
    if (fileType !== FileType.Pdf) {
      setIsViewerOpen(true);
      setViewerActiveIndex(index);
    }
  };

  const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files: FileList | null = e.target.files;
    if (files !== null && files.length > 0) {
      const uploadFiles: IUploadQueue[] = [];
      for (let i = 0; i < files.length; i++) {
        // Add to form with processing false
        const file: File = files[i];
        const formFile: IUploadQueue = getPreUploadFormFile(file);
        uploadFiles.push(formFile);
      }
      currentQueue.current = uploadFiles;
      setUploadQueue(currentQueue.current);
      props.onUploadStatusChange(true);
    }
  };

  const onUploadComplete = (tempId: string, response: IFileMetadata): void => {
    // Update UI elements by removing the loader
    currentQueue.current = currentQueue.current.filter(x => x.tempId !== tempId);
    setUploadQueue(currentQueue.current);

    // Add to UI elements only if not already cancelled
    if (!cancelledQueue.current.includes(tempId)) {
      props.onAddFile(response);
    }
    if (currentQueue.current.length === 0) {
      props.onUploadStatusChange(false);
    }
  };

  const onUploadCancel = (tempId: string): void => {
    // Update currently rendered UI elements
    currentQueue.current = currentQueue.current.filter(x => x.tempId !== tempId);
    setUploadQueue(currentQueue.current);

    // Keep record of cancelled items to be used for cancelled uploads
    cancelledQueue.current.push(tempId);
    cancelledQueue.current = [...cancelledQueue.current];
    if (currentQueue.current.length === 0) {
      props.onUploadStatusChange(false);
    }
  };

  return (
    <React.Fragment>
      <Grid item xs={12} sm={12} md={12}>
        <Button variant="outlined" component="label">
          Upload Images, Videos, PDFs
          <input onChange={onSelectFiles} hidden accept="image/*, video/*, application/pdf" multiple type="file" />
        </Button>
      </Grid>
      {props.error && (
        <Grid sx={{ p: 1 }} item xs={12}>
          <FormHelperText error>{props.error}</FormHelperText>
        </Grid>
      )}
      <Grid item xs={12} sm={12} md={12}>
        <ImageList cols={matchesSm ? (matchesMd ? 5 : 4) : 2} sx={{ mb: 0.5 }}>
          <PortfolioTiles
            files={props.files}
            isEditView={true}
            onClickFile={onClickFile}
            onDelete={props.onDelete}
            onNameChange={props.onNameChange}
            onFeaturedSelected={props.onFeaturedSelected}
          />
          {uploadQueue.map((item: IUploadQueue, i: number) => (
            <ImageListItem key={i}>
              <UploadProgress onUploadComplete={onUploadComplete} onUploadCancel={onUploadCancel} upload={item} />
            </ImageListItem>
          ))}
        </ImageList>
        {props.files?.length === 0 && uploadQueue.length === 0 && <NoFilesIcon />}
        <FileViewerDialog
          activeIndex={viewerActiveIndex}
          files={props.files}
          isOpen={isViewerOpen}
          onClose={handleViewerClose}
        />
      </Grid>
    </React.Fragment>
  );
}
