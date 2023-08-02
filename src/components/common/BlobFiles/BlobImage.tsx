import { profileContainer } from 'global/constants';

interface BlobImageProps extends React.ImgHTMLAttributes<unknown> {
  extension: string;
  id: string;
  directory: string;
}

export default function BlobImage(props: BlobImageProps): JSX.Element {
  const { extension, id, directory, ...imgProps } = props;
  const imageUrl = `${process.env.REACT_APP_BLOB_URL ?? ''}/${profileContainer}/${directory}/${id}${extension}`;
  return <img src={imageUrl} {...imgProps} />;
}
