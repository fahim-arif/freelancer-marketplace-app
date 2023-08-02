import { timeStringFromDate, dateStringFromDate } from 'utils/dateFormat';
import { MakePaymentIcon } from 'components/icon/MakePaymentIcon';
import { ChatMessageType, IChatMessageDisplay } from 'global/interfaces/chatMessage';
import { AuthType } from 'contexts/AuthContext';
import { IChatUserThread } from 'global/interfaces/chatThread';
import { ReviewContentIcon } from 'components/icon/ReviewContentIcon';
import { LikeIcon } from 'components/icon/LikeIcon';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';

export function updateMessage(
  m: IChatMessageDisplay,
  lastDate: string,
  authContext: AuthType,
  thread: IChatUserThread | undefined,
): string {
  m.time = timeStringFromDate(m.createdDateTime);
  m.date = dateStringFromDate(m.createdDateTime);
  m.firstDate = m.date !== lastDate;
  lastDate = m.date;
  m.isSystemMessage = false;
  m.messageTitle = m.userDisplayName;
  const isBuyer = authContext.user?.id == m.contract?.buyerUserId;

  if (authContext.user?.id === m.userId) {
    m.messageTitle = 'You';
  }

  if (m.messageType === ChatMessageType.Payment) {
    m.messageTitle = isBuyer ? 'Make Payment' : 'Payment Requested';
    m.systemIcon = <MakePaymentIcon />;
    m.isSystemMessage = true;
  } else if (m.messageType === ChatMessageType.PaymentSuccessful) {
    m.messageTitle = 'Payment Successful';
    m.systemIcon = <MakePaymentIcon />;
    m.isSystemMessage = true;
  } else if (m.messageType === ChatMessageType.Review) {
    m.messageTitle = 'Review Content';
    m.systemIcon = <ReviewContentIcon />;
    m.isSystemMessage = true;
  } else if (m.messageType === ChatMessageType.ReviewComplete) {
    m.messageTitle = 'Review Complete';
    m.systemIcon = <ReviewContentIcon />;
    m.isSystemMessage = true;
  } else if (m.messageType === ChatMessageType.ContractComplete) {
    m.messageTitle = isBuyer ? 'Leave Feedback' : 'Feedback Requested';
    m.systemIcon = <LikeIcon style={{ fill: 'none', fontSize: '24px', strokeWidth: 1.5 }} />;
    m.isSystemMessage = true;
  } else if (m.messageType === ChatMessageType.ContractCancelled) {
    m.messageTitle = 'Contract Cancelled';
    m.systemIcon = <CloseOutlinedIcon />;
    m.isSystemMessage = true;
  } else if (m.messageType === ChatMessageType.ConnectionAccepted) {
    m.messageTitle = 'Connection Request Accepted';
    m.systemIcon = <PeopleOutlineIcon style={{ strokeWidth: 1.0 }} />;
    m.isSystemMessage = true;
  } else if (m.messageType === ChatMessageType.ConnectionRemoved) {
    m.messageTitle = 'Connection Removed';
    m.systemIcon = <PeopleOutlineIcon style={{ strokeWidth: 1.0 }} />;
    m.isSystemMessage = true;
  }

  if (m.visibleToUserId !== undefined && m.visibleToUserId !== null) {
    if (!isBuyer) {
      const buyer = thread?.recipients.find(p => p.userId === m.contract?.buyerUserId);
      m.visibleMessage = `Only visible to you and ${buyer?.displayName}`;
    } else if (isBuyer) {
      const seller = thread?.recipients.find(p => p.userId === m.visibleToUserId);
      m.visibleMessage = `Only visible to you and ${seller?.displayName}`;
    }
  }
  return lastDate;
}
