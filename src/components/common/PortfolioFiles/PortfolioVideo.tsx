import { IconButton, ImageListItemBar } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import React from 'react';
import PortfolioDeleteIcon from './PortfolioDeleteIcon';
import { getThumbnailId } from 'utils/file';
import BlobImage from 'components/common/BlobFiles/BlobImage';
import { VideoThumbnailExtension } from 'global/constants';

interface IPortfolioVideoProps {
  extension: string;
  id: string;
  directory: string;
  fileName: string;
  onDelete?: (path: string) => void;
}

export default function PortfolioVideo(props: IPortfolioVideoProps): JSX.Element {
  return (
    <React.Fragment>
      <BlobImage
        className="portfolio-item"
        alt={props.fileName}
        loading="lazy"
        id={getThumbnailId(props.id)}
        directory={props.directory}
        // Video thumbnail extension is known
        extension={VideoThumbnailExtension}
      ></BlobImage>

      <PortfolioDeleteIcon onDelete={props.onDelete} id={props.id} />

      <ImageListItemBar
        position="bottom"
        className="image-list-header-bar"
        actionIcon={
          <IconButton sx={{ color: 'rgba(180, 180, 180, 1)' }}>
            <PlayCircleOutlineIcon />
          </IconButton>
        }
      />
    </React.Fragment>
  );
}
