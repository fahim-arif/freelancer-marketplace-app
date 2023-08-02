import { ImageListItemBar, Paper, Typography } from '@mui/material';
import VideoProgress from 'components/common/VideoProgress';
import React from 'react';
import PortfolioDeleteIcon from './PortfolioDeleteIcon';

interface IVideoProgressProps extends React.ImgHTMLAttributes<any> {
  fileName: string;
  onDelete?: (path: string) => void;
  id: string;
}

export default function PortfolioVideoProgress(props: IVideoProgressProps): JSX.Element {
  const { onDelete, ...imgProps } = props;
  return (
    <React.Fragment>
      <Paper
        square
        variant="outlined"
        className="portfolio-item"
        sx={{
          height: '100%',
          display: 'flex',
          minHeight: '150px',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <VideoProgress {...imgProps} width={'40%'}></VideoProgress>
      </Paper>

      <PortfolioDeleteIcon id={props.id} onDelete={onDelete} />

      <ImageListItemBar
        sx={{ color: 'black', textAlign: 'center' }}
        position="bottom"
        className="image-list-header-bar"
        title={
          <Typography color={'grey.500'} sx={{ fontSize: '0.8rem' }}>
            {props.fileName}
          </Typography>
        }
      />
    </React.Fragment>
  );
}
