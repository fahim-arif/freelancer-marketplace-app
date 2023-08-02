import { Paper, CircularProgress, ImageListItemBar, IconButton, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IUploadQueue } from 'global/interfaces/user';
import { savePortfolioFiles as savePortfolioFile } from 'services/storageService';
import IApiError from 'global/interfaces/api';
import { showUIError } from 'utils/errorHandler';
import { IFileMetadata } from 'global/interfaces/file';

interface IUploadProgressProps {
  upload: IUploadQueue;
  onUploadCancel: (tempId: string) => void;
  onUploadComplete: (tempId: string, response: IFileMetadata) => void;
}

export default function UploadProgress(props: IUploadProgressProps): JSX.Element {
  const uploadCancel = (): void => {
    props.onUploadCancel(props.upload.tempId);
  };

  useEffect(() => {
    let controller: AbortController | null = new AbortController();
    savePortfolioFile(props.upload.file, controller)
      .then((fileResponse: IFileMetadata) => {
        controller = null;
        props.onUploadComplete(props.upload.tempId, fileResponse);
      })
      .catch((err: IApiError) => {
        if (err.message === 'canceled') {
          props.onUploadCancel(props.upload.tempId);
        } else {
          showUIError(err.message);
        }
      });
  }, []);

  return (
    <React.Fragment>
      <Paper
        variant="outlined"
        className="portfolio-item"
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '150px',
        }}
      >
        <CircularProgress />
      </Paper>
      <ImageListItemBar
        position="top"
        className="image-list-header-bar"
        actionIcon={
          <IconButton onClick={uploadCancel} sx={{ color: 'rgba(180, 180, 180, 1)' }}>
            <HighlightOffIcon />
          </IconButton>
        }
      />
      <ImageListItemBar
        sx={{ color: 'black', textAlign: 'center' }}
        position="bottom"
        className="image-list-header-bar"
        title={
          <Typography color={'grey.500'} sx={{ fontSize: '0.8rem' }}>
            {props.upload.file?.name}
          </Typography>
        }
      />
    </React.Fragment>
  );
}
