import { PackageType } from 'global/enums/packageType';
import { ContractStatus } from './contract';
import { ConnectionStatus } from 'global/enums/connectionStatus';
import { ConnectionDirection } from 'global/enums/connectionDirection';
import { ConnectionFirstContact } from 'global/enums/connectionFirstContact';

export interface IConnectionPartcipant {
  displayName?: string;
  mainCategory?: string;
  userId?: string;
}

export interface IConnectionContract {
  totalAmount?: number;
  lastContractCreatedOn?: string;
  lastContractStatus?: ContractStatus;
}

export interface IConnection {
  connectionId?: string;
  direction?: ConnectionDirection;
  firstContact?: ConnectionFirstContact;
  chatThreadId?: string;
  otherUser?: IConnectionPartcipant;
  contract?: IConnectionContract;
  status?: ConnectionStatus;
}

export interface IInvitation extends IConnection {
  package?: PackageType;
  description?: string;
}

export interface IInvitationCreateRequest {
  userId?: string;
  firstContact?: ConnectionFirstContact;
  package?: PackageType;
  description?: string;
}

export interface IInvitationCount {
  count: number;
}

export interface IInvitationSearchRequest {
  direction?: ConnectionDirection;
  otherUserId?: string;
}

export interface IConnectionSearchRequest extends IInvitationSearchRequest {
  status?: ConnectionStatus;
}

export interface IConnectionCreateRequest {
  connectionId: string;
  reason?: string;
  accept: boolean;
}
