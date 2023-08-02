import { IChatFile } from 'global/interfaces/chatMessage';
import * as React from 'react';
import { Paper, CircularProgress } from '@mui/material';
import { FileType } from 'global/enums/fileTypes';
import fileIcon from 'assets/images/icons/file.png';

interface IChatFileDisplay extends IChatFile {
  numCols: number;
  gap: number;
  sending?: boolean;
}

export default function ChatMessageUploadImage(props: IChatFileDisplay): JSX.Element {
  const imageRef = React.useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = React.useState<boolean>(false);

  // These next two bits of code are to ensure the image has the right height before loading
  // Without this the scroll to bottom in the message section doesn't work as the images pop in afterwards.
  // We blank out the manually set height afterwards so if the screen gets resized then the images resize automatically
  // without us having to worry about it.
  const onImageLoad = (): void => {
    setLoaded(true);
    if (imageRef.current != null) {
      const element = imageRef.current;
      element.style.height = '';
    }
  };

  React.useEffect(() => {
    if (!loaded && imageRef.current !== null) {
      const element = imageRef.current;
      const listContainer = element.parentElement?.parentElement;
      const gapWidth = (props.numCols - 1) * props.gap;
      const computedWidth = (listContainer?.clientWidth ?? 500 - gapWidth) / props.numCols;
      element.style.height = `${computedWidth}px`;
    }
  }, [props.numCols, props.gap, imageRef.current]);

  return (
    <React.Fragment>
      {(props.sending === undefined || !props.sending) && props.fileType === FileType.Image && (
        <img
          src={props.thumbnailUrl}
          alt={props.fileName + props.extension}
          ref={imageRef}
          onLoad={onImageLoad}
          className="MuiImageListItem-img"
        />
      )}
      {(props.sending === undefined || !props.sending) && props.fileType !== FileType.Image && (
        <img
          src={fileIcon}
          alt={props.fileName + props.extension}
          ref={imageRef}
          onLoad={onImageLoad}
          className="MuiImageListItem-img"
        />
      )}
      {props.sending !== undefined && props.sending && (
        <Paper
          variant="outlined"
          ref={imageRef}
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CircularProgress />
        </Paper>
      )}
    </React.Fragment>
  );
}
