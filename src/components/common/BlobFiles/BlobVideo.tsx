import { profileContainer } from 'global/constants';

interface BlobImageProps extends React.VideoHTMLAttributes<any> {
  extension: string;
  id: string;
  directory: string;
}

export default function BlobVideo(props: BlobImageProps): JSX.Element {
  const { extension, id, directory, ...imgProps } = props;
  const videoUrl = `${process.env.REACT_APP_BLOB_URL ?? ''}/${profileContainer}/${directory}/${id}${extension}`;

  return <video src={videoUrl} {...imgProps} />;
}
