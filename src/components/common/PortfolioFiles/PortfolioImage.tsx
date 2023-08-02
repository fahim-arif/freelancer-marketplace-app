import BlobImage from 'components/common/BlobFiles/BlobImage';
import React from 'react';
import { getThumbnailId } from 'utils/file';
import PortfolioDeleteIcon from './PortfolioDeleteIcon';

interface IPortfolioImageProps {
  fileName: string;
  extension: string;
  id: string;
  directory: string;
  onDelete?: (path: string) => void;
}

export default function PortfolioImage(props: IPortfolioImageProps): JSX.Element {
  return (
    <React.Fragment>
      <BlobImage
        className="portfolio-item"
        alt={props.fileName}
        loading="lazy"
        id={getThumbnailId(props.id)}
        directory={props.directory}
        extension={props.extension}
      ></BlobImage>

      <PortfolioDeleteIcon id={props.id} onDelete={props.onDelete} />
    </React.Fragment>
  );
}
