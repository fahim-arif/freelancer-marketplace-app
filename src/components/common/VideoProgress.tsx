import icon from 'assets/images/icons/video-processing.png';
import { Tooltip } from '@mui/material';

export default function VideoProgress(props: React.ImgHTMLAttributes<any>): JSX.Element {
  return (
    <Tooltip enterTouchDelay={0} title="Video currently being processed. This will take approximately 5 mins">
      <img {...props} src={icon}></img>
    </Tooltip>
  );
}
