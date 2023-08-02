import { IChatMessageDisplay } from 'global/interfaces/chatMessage';
import Sanitize from 'components/common/Sanitize';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

export default function ChatMessageText(props: IChatMessageDisplay): JSX.Element {
  const theme = useTheme();
  return (
    <Typography variant="body2" component="div" color={theme.palette.grey[900]} marginTop="4px">
      <Sanitize html={props.content} />
    </Typography>
  );
}
