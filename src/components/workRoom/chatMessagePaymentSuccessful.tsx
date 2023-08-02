import { IChatMessageDisplay } from 'global/interfaces/chatMessage';

import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

interface IChatMessagePaymentProps extends IChatMessageDisplay {
  currentUserId?: string;
}
const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

export default function ChatMessagePaymentSuccessful(props: IChatMessagePaymentProps): JSX.Element {
  return (
    <StyledTypography variant="body2">
      Payment has been received for the contract &quot;{props.contract?.name}&quot;. The contract is now in progress.
    </StyledTypography>
  );
}
