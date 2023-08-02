import { IChatMessageDisplay } from 'global/interfaces/chatMessage';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import { Box, Button, styled } from '@mui/material';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { ContractFeedbackType } from 'global/enums/contractEnums';
import { AuthContext } from 'contexts/AuthContext';
import { giveFeedback } from 'services/contractService';
import { IContractFeedback } from 'global/interfaces/contract';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[700],
}));

const StyledButtonBox = styled(Box)(() => ({
  marginTop: '8px',
}));

const StyledButton = styled(Button)(() => ({
  marginLeft: '8px',
}));

export default function ChatMessageContractComplete(props: IChatMessageDisplay): JSX.Element {
  const [fill, setFill] = React.useState<ContractFeedbackType>();

  const handleFeedback = (contractId: string, messageId: string, option: ContractFeedbackType) => {
    const feedback: IContractFeedback = {
      contractId: contractId,
      messageId: messageId,
      buyerFeedbackType: option,
    };
    setFill(option);
    giveFeedback(feedback);
  };

  const authContext = React.useContext(AuthContext);
  const isBuyer = authContext?.user?.id === props.contract?.buyerUserId;

  const canLeaveFeedback: boolean = props.contract?.completedOn
    ? new Date(props.contract?.completedOn).getDate() < new Date().getDate() + 31
    : true;

  const feebackText = `Contract ${props.contract?.name} is complete.`;

  return (
    <React.Fragment>
      <Box>
        <StyledTypography variant="body2">
          {feebackText}{' '}
          {props.contract?.buyerFeedback === null
            ? isBuyer
              ? 'Please leave feedback.'
              : 'Feedback has been requested from the buyer.'
            : ''}
        </StyledTypography>
      </Box>
      <StyledButtonBox>
        {renderFeedbackButtons({
          contractId: props.contract!.contractId,
          id: props.id,
          isBuyer,
          canLeaveFeedback,
          feedbackType: props.contract?.buyerFeedback,
          fill,
          buyerFeedback: props.contract?.buyerFeedback,
          handleFeedback: (contractId: string, messageId: string, option: ContractFeedbackType) =>
            handleFeedback(contractId, messageId, option),
        })}
      </StyledButtonBox>
    </React.Fragment>
  );
}

interface IButtonProps {
  contractId: string;
  id: string;
  isBuyer: boolean;
  canLeaveFeedback: boolean;
  feedbackType: ContractFeedbackType | undefined;
  fill: ContractFeedbackType | undefined;
  buyerFeedback: ContractFeedbackType | undefined;
  handleFeedback: (contractId: string, messageId: string, option: ContractFeedbackType) => void;
}

const renderFeedbackButtons = (props: IButtonProps) => {
  const LoveButtonElem = LoveButton(props);
  const LikeButtonElem = LikeButton(props);
  const DislikeButtonElem = DislikeButton(props);

  let element: JSX.Element = (
    <>
      {LoveButtonElem}
      {LikeButtonElem}
      {DislikeButtonElem}
    </>
  );

  if (!props.isBuyer) {
    switch (props.feedbackType) {
      case ContractFeedbackType.Love:
        element = LoveButtonElem;
        break;
      case ContractFeedbackType.Like:
        element = LikeButtonElem;
        break;
      case ContractFeedbackType.Dislike:
        element = DislikeButtonElem;
        break;
      default:
        break;
    }
  }

  return element;
};

const LoveButton = ({
  contractId,
  id,
  isBuyer,
  canLeaveFeedback,
  fill,
  buyerFeedback,
  handleFeedback,
}: IButtonProps) => (
  <StyledButton
    disabled={!canLeaveFeedback}
    disableRipple={!isBuyer}
    variant="outlined"
    type="button"
    onClick={isBuyer ? () => handleFeedback(contractId, id, ContractFeedbackType.Love) : undefined}
  >
    {fill === ContractFeedbackType.Love ? (
      <FavoriteIcon />
    ) : fill === undefined && buyerFeedback === ContractFeedbackType.Love ? (
      <FavoriteIcon />
    ) : (
      <FavoriteBorderIcon />
    )}
  </StyledButton>
);

const LikeButton = ({
  contractId,
  id,
  isBuyer,
  canLeaveFeedback,
  fill,
  buyerFeedback,
  handleFeedback,
}: IButtonProps) => (
  <StyledButton
    disabled={!canLeaveFeedback}
    disableRipple={!isBuyer}
    variant="outlined"
    type="button"
    onClick={isBuyer ? () => handleFeedback(contractId, id, ContractFeedbackType.Like) : undefined}
  >
    {fill === ContractFeedbackType.Like ? (
      <ThumbUpIcon />
    ) : fill === undefined && buyerFeedback === ContractFeedbackType.Like ? (
      <ThumbUpIcon />
    ) : (
      <ThumbUpOutlinedIcon />
    )}
  </StyledButton>
);

const DislikeButton = ({
  contractId,
  id,
  isBuyer,
  canLeaveFeedback,
  fill,
  buyerFeedback,
  handleFeedback,
}: IButtonProps) => (
  <StyledButton
    disabled={!canLeaveFeedback}
    disableRipple={!isBuyer}
    variant="outlined"
    type="button"
    onClick={isBuyer ? () => handleFeedback(contractId, id, ContractFeedbackType.Dislike) : undefined}
  >
    {fill === ContractFeedbackType.Dislike ? (
      <ThumbDownIcon />
    ) : fill === undefined && buyerFeedback === ContractFeedbackType.Dislike ? (
      <ThumbDownIcon />
    ) : (
      <ThumbDownOutlinedIcon />
    )}
  </StyledButton>
);
