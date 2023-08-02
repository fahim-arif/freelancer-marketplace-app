import React from 'react';
import Dialog from '@mui/material/Dialog';
import Carousel from 'react-material-ui-carousel';
import BlobImage from './BlobFiles/BlobImage';
import { FileType } from 'global/enums/fileTypes';
import BlobVideo from 'components/common/BlobFiles/BlobVideo';
import BlobPDF from 'components/common/BlobFiles/BlobPDF';
import { Box, Typography } from '@mui/material';
import VideoProgress from './VideoProgress';
import { IFileMetadata } from 'global/interfaces/file';

interface IFileViewerDialogProps {
  files: IFileMetadata[];
  isOpen: boolean;
  activeIndex: number;
  onClose: React.MouseEventHandler;
}

export default function FileViewerDialog(props: IFileViewerDialogProps): JSX.Element {
  return (
    <React.Fragment>
      <Dialog maxWidth="md" open={props.isOpen} onClose={props.onClose} fullWidth>
        <Carousel
          navButtonsProps={{
            style: {
              opacity: '0.3',
            },
          }}
          navButtonsAlwaysVisible={true}
          fullHeightHover={false}
          autoPlay={false}
          sx={{
            textAlign: 'center',
            height: {
              xs: '40vh',
              md: '50vh',
              lg: '60vh',
            },
          }}
          height={'100%'}
          index={props.activeIndex}
          IndicatorIcon={false}
        >
          {props.files.map((item, i) => (
            <Slide key={i} {...item} />
          ))}
        </Carousel>
      </Dialog>
    </React.Fragment>
  );
}

// Generate slide with styles
function Slide(props: IFileMetadata): JSX.Element {
  const style: React.CSSProperties = {
    maxHeight: '100%',
    maxWidth: '100%',
    width: 'auto',
    height: 'auto',
  };

  return (
    <Box
      sx={{
        height: '100%',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {
        // Image
        props.type === FileType.Image ? (
          <BlobImage style={style} id={props.id} directory={props.directory} extension={props.extension}></BlobImage>
        ) : // Video
        props.type === FileType.Video ? (
          props.isProcessed ? (
            <BlobVideo
              controls
              autoPlay
              style={style}
              id={props.id}
              directory={props.directory}
              extension={props.extension}
            ></BlobVideo>
          ) : (
            IconSlide(<VideoProgress />, props.name)
          )
        ) : (
          // File
          IconSlide(
            <BlobPDF
              id={props.id}
              directory={props.directory}
              extension={props.extension}
              style={{ ...style, height: '50%', width: '50%' }}
            />,
            props.name,
          )
        )
      }
    </Box>
  );
}

// Generate Icon slide for PDF and upload progress videos
function IconSlide(children: JSX.Element, title: string): JSX.Element {
  return (
    <React.Fragment>
      {children}
      <Box
        sx={{
          textAlign: 'center',
          pt: 3,
        }}
      >
        <Typography color={'grey.500'} sx={{ fontSize: '0.8rem' }}>
          {title}
        </Typography>
      </Box>
    </React.Fragment>
  );
}
