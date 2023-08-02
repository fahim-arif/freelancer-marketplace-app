import { IChatMessageDisplay } from 'global/interfaces/chatMessage';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

interface IChatMessageConnectionAcceptedProps extends IChatMessageDisplay {
  currentUserId?: string;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

export default function ChatMessageConnectionAccepted(props: IChatMessageConnectionAcceptedProps): JSX.Element {
  return (
    <React.Fragment>
      {props.connection?.actionUserId !== props.currentUserId && (
        <>
          <StyledTypography variant="body2">
            {props.connection?.actionUserDisplayName} has removed you as a connection.
          </StyledTypography>
        </>
      )}
      {props.connection?.actionUserId === props.currentUserId && (
        <>
          <StyledTypography variant="body2">
            You removed your connection with {props.connection?.otherUserDisplayName}.
          </StyledTypography>
        </>
      )}
    </React.Fragment>
  );
}
