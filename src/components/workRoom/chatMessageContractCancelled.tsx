import { IChatMessageDisplay } from 'global/interfaces/chatMessage';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, styled } from '@mui/material';

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

export default function ChatMessageContractCancelled(props: IChatMessageDisplay): JSX.Element {
  return (
    <React.Fragment>
      <Box>
        <StyledTypography variant="body2">Contract {props.contract?.name} has been cancelled.</StyledTypography>
      </Box>
    </React.Fragment>
  );
}
