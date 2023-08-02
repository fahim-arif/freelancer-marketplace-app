import { IChatDeliverable, IChatMessageDisplay } from 'global/interfaces/chatMessage';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, styled } from '@mui/material';
import { UserAuth } from 'contexts/AuthContext';

import ReviewSingle from 'components/workRoom/reviewSingle';
import ReviewMultiple from './reviewMultiple';

interface IChatMessagReviewProps extends IChatMessageDisplay {
  user: UserAuth | null;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

export default function ChatMessagReview(props: IChatMessagReviewProps): JSX.Element {
  const numDeliverables: number = props.deliverables !== undefined ? props.deliverables.length : 0;
  // If the person didn't post the review they must be the buyer.
  const isBuyer = props.user?.id !== props.userId;
  // Seller is the person that posts deliverables for review
  const isSeller = props.user?.id === props.userId;

  return (
    <React.Fragment>
      <Box>
        {isSeller && (
          <StyledTypography variant="body2">
            You requested the buyer&apos;s approval for the following deliverables:
          </StyledTypography>
        )}
        {isBuyer && (
          <StyledTypography variant="body2">
            Seller {props.userDisplayName} has requested your approval for the following deliverables:
          </StyledTypography>
        )}
        {props.deliverables?.map((item: IChatDeliverable, i: number) => (
          <StyledTypography variant="body2" key={i}>
            {item.contractName}:&nbsp;{item.name}
          </StyledTypography>
        ))}
        {isBuyer && props.deliverables !== undefined && !props.actioned && numDeliverables === 1 && (
          <Box sx={{ mt: 1 }}>
            <ReviewSingle deliverable={props.deliverables[0]} messageId={props.id} />
          </Box>
        )}
        {isBuyer && props.deliverables !== undefined && !props.actioned && numDeliverables > 1 && (
          <Box sx={{ mt: 1 }}>
            <ReviewMultiple deliverables={props.deliverables} chatThreadId={props.chatThreadId} messageId={props.id} />
          </Box>
        )}
        {isBuyer && props.deliverables !== undefined && props.actioned && numDeliverables === 1 && (
          <Box sx={{ mt: 1 }}>
            <p>
              <i>You have already reviewed this deliverable.</i>
            </p>
          </Box>
        )}
        {isBuyer && props.deliverables !== undefined && props.actioned && numDeliverables > 1 && (
          <Box sx={{ mt: 1 }}>
            <p>
              <i>You have already reviewed these deliverables.</i>
            </p>
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
}
