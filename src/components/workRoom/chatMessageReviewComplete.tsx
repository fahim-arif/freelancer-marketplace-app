import { IChatDeliverable, IChatMessageDisplay } from 'global/interfaces/chatMessage';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, styled } from '@mui/material';
import { ContractDeliverableStatus } from 'global/interfaces/contract';

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

export default function ChatMessageReviewComplete(props: IChatMessageDisplay): JSX.Element {
  const numDeliverables: number = props.deliverables !== undefined ? props.deliverables.length : 0;
  const approvedDeliverables: IChatDeliverable[] =
    props.deliverables !== undefined
      ? props.deliverables.filter(p => p.status === ContractDeliverableStatus.Approved)
      : [];
  const requestedRevisionDeliverables: IChatDeliverable[] =
    props.deliverables !== undefined
      ? props.deliverables.filter(p => p.status === ContractDeliverableStatus.RevisionRequired)
      : [];
  const disputedDeliverables: IChatDeliverable[] =
    props.deliverables !== undefined
      ? props.deliverables.filter(p => p.status === ContractDeliverableStatus.Disputed)
      : [];

  return (
    <React.Fragment>
      <Box>
        {numDeliverables === 1 &&
          props.deliverables !== undefined &&
          props.deliverables[0].status === ContractDeliverableStatus.RevisionRequired && (
            <StyledTypography variant="body2">
              A revision has been requested for deliverable {props.deliverables[0].contractName}:&nbsp;
              {props.deliverables[0].name}.
            </StyledTypography>
          )}
        {numDeliverables === 1 &&
          props.deliverables !== undefined &&
          props.deliverables[0].status === ContractDeliverableStatus.Approved && (
            <StyledTypography variant="body2">
              Deliverable {props.deliverables[0].contractName}:&nbsp;{props.deliverables[0].name} has been approved.
            </StyledTypography>
          )}
        {numDeliverables === 1 &&
          props.deliverables !== undefined &&
          props.deliverables[0].status === ContractDeliverableStatus.Disputed && (
            <StyledTypography variant="body2">
              Deliverable {props.deliverables[0].contractName}:&nbsp;{props.deliverables[0].name} has been disputed.
            </StyledTypography>
          )}
        {numDeliverables > 1 && approvedDeliverables.length > 0 && (
          <Box sx={{ mb: '6px' }}>
            <StyledTypography variant="body2">The following deliverables have been approved:</StyledTypography>
            {approvedDeliverables.map((item: IChatDeliverable, i: number) => (
              <StyledTypography variant="body2" key={i}>
                {item.contractName}:&nbsp;{item.name}
              </StyledTypography>
            ))}
          </Box>
        )}
        {numDeliverables > 1 && requestedRevisionDeliverables.length > 0 && (
          <Box sx={{ mb: '6px' }}>
            <StyledTypography variant="body2">The following deliverables need a revision:</StyledTypography>
            {requestedRevisionDeliverables.map((item: IChatDeliverable, i: number) => (
              <StyledTypography variant="body2" key={i}>
                {item.contractName}:&nbsp;{item.name}
              </StyledTypography>
            ))}
          </Box>
        )}
        {numDeliverables > 1 && disputedDeliverables.length > 0 && (
          <Box sx={{ mb: '6px' }}>
            <StyledTypography variant="body2">The following deliverables have been disputed:</StyledTypography>
            {disputedDeliverables.map((item: IChatDeliverable, i: number) => (
              <StyledTypography variant="body2" key={i}>
                {item.contractName}:&nbsp;{item.name}
              </StyledTypography>
            ))}
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
}
