import { FileType } from 'global/enums/fileTypes';
import { ContractDeliverableStatus } from './contract';
import { ContractFeedbackType } from 'global/enums/contractEnums';
import { ConnectionFirstContact } from 'global/enums/connectionFirstContact';

export interface IChatUnread {
  numberUnread: number;
}

export enum ChatMessageType {
  Text = 0,
  Link = 1,
  Upload = 2,
  Payment = 3,
  PaymentSuccessful = 4,
  Review = 5,
  ReviewComplete = 6,
  ContractComplete = 7,
  ContractCancelled = 8,
  ConnectionAccepted = 9,
  ConnectionRemoved = 10,
}

export interface IChatMessage {
  id: string;
  userId: string;
  chatThreadId: string;
  userDisplayName: string;
  createdDateTime: string;
  content: string;
  messageType: ChatMessageType;
  files: IChatFile[];
  deliverables?: IChatDeliverable[];
  contract?: IChatContract;
  connection?: IChatConnection;
  actioned: boolean;
  visibleToUserId?: string;
}

export interface IChatMessageDisplay extends IChatMessage {
  messageTitle?: string;
  date?: string;
  time?: string;
  firstDate?: boolean;
  sending?: boolean;
  visibleMessage?: string;
  isSystemMessage?: boolean;
  systemIcon?: React.ReactNode;
}

export interface IChatFile {
  chatThreadId: string;
  fileName: string;
  extension: string;
  fileType: FileType;
  thumbnailUrl?: string;
}

export interface IChatDeliverable {
  chatThreadId: string;
  contractId: string;
  contractName: string;
  name: string;
  status: ContractDeliverableStatus;
}

export interface IChatContract {
  contractId: string;
  name: string;
  deliverables: string[];
  amount: number;
  buyerUserId: string;
  buyerFeedback: ContractFeedbackType;
  sellerUserId: string;
  completedOn: string;
}

export interface IChatConnection {
  connectionId: string;
  actionUserId: string;
  actionUserDisplayName: string;
  otherUserId: string;
  otherUserDisplayName: string;
  firstContact: ConnectionFirstContact;
  packageName: string;
  description: string;
}

export interface IChatTyping {
  id: string;
  typingDisplayName: string;
  typingUserId: string;
}
