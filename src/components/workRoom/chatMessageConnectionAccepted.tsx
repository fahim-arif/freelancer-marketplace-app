import { IChatMessageDisplay } from 'global/interfaces/chatMessage';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';
import { ConnectionFirstContact } from 'global/enums/connectionFirstContact';

interface IChatMessageConnectionAcceptedProps extends IChatMessageDisplay {
  currentUserId?: string;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

export default function ChatMessageConnectionAccepted(props: IChatMessageConnectionAcceptedProps): JSX.Element {
  return (
    <React.Fragment>
      {props.connection?.actionUserId !== props.currentUserId &&
        props.connection?.firstContact === ConnectionFirstContact.Message && (
          <>
            <StyledTypography variant="body2">
              {props.connection?.actionUserDisplayName} has accepted your connection request. You included the message:
              &quot;{props.connection?.description}&quot;
            </StyledTypography>
          </>
        )}
      {props.connection?.actionUserId !== props.currentUserId &&
        props.connection?.firstContact === ConnectionFirstContact.Quote && (
          <>
            <StyledTypography variant="body2">
              {props.connection?.actionUserDisplayName} has accepted your request for a quote. You included the
              following brief: &quot;{props.connection?.description}&quot;
            </StyledTypography>
          </>
        )}
      {props.connection?.actionUserId !== props.currentUserId &&
        props.connection?.firstContact === ConnectionFirstContact.Package && (
          <>
            <StyledTypography variant="body2">
              {props.connection?.actionUserDisplayName} has accepted your request to enquire about the &quot;
              {props.connection?.packageName}&quot; package. You included the following brief: &quot;
              {props.connection?.description}&quot;
            </StyledTypography>
          </>
        )}

      {props.connection?.actionUserId === props.currentUserId &&
        props.connection?.firstContact === ConnectionFirstContact.Message && (
          <>
            <StyledTypography variant="body2">
              You accepted the connection request from {props.connection?.otherUserDisplayName}. They included the
              message: &quot;{props.connection?.description}&quot;
            </StyledTypography>
          </>
        )}
      {props.connection?.actionUserId === props.currentUserId &&
        props.connection?.firstContact === ConnectionFirstContact.Quote && (
          <>
            <StyledTypography variant="body2">
              You accepted the request for a quote from {props.connection?.otherUserDisplayName}. They included the
              following brief: &quot;{props.connection?.description}&quot;
            </StyledTypography>
          </>
        )}
      {props.connection?.actionUserId === props.currentUserId &&
        props.connection?.firstContact === ConnectionFirstContact.Package && (
          <>
            <StyledTypography variant="body2">
              You accepted the request to enquire about the {props.connection?.packageName} package from{' '}
              {props.connection?.otherUserDisplayName}. They included the following brief: &quot;
              {props.connection?.description}&quot;
            </StyledTypography>
          </>
        )}
    </React.Fragment>
  );
}
