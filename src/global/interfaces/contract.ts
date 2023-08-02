import { ContractFeedbackType } from 'global/enums/contractEnums';
import { IPagingFilter } from './ordering';

export enum ContractType {
  Hourly = 'Hourly',
  FixedPackage = 'FixedPackage',
}

export interface ICreateContractForm {
  name: string;
  contractType: ContractType | string;
  deliverables: string[];
  fixedPackageIndex?: number | null;
  hours?: number | null;
  revisions?: number | null;
  delivery?: number | null;
  license?: string | null;
  custom?: string | null;
  otherUserId?: string | null;
}

export enum ContractPaymentSecretType {
  AlreadyPaid = 'AlreadyPaid',
  Cancelled = 'Cancelled',
  Url = 'Url',
}

export interface IContractPaymentSecret {
  type: ContractPaymentSecretType;
  value: string;
}

export enum ContractStatus {
  Created = 'Created',
  InProgress = 'InProgress',
  Complete = 'Complete',
  Cancelled = 'Cancelled',
  Disputed = 'Disputed',
}

export enum ContractDeliverableStatus {
  InProgress = 'InProgress',
  WaitingApproval = 'WaitingApproval',
  Approved = 'Approved',
  RevisionRequired = 'RevisionRequired',
  Disputed = 'Disputed',
}

export enum ContractPaymentStatus {
  Awaiting = 'Awaiting',
  Success = 'Success',
  Failed = 'Failed',
  Refunded = 'Refunded',
}

export enum ContractPayoutStatus {
  NotReady = 'NotReady',
  AwaitingFunds = 'AwaitingFunds',
  AwaitingPayout = 'AwaitingPayout',
  Success = 'Success',
  Failed = 'Failed',
}

export enum ContractViewType {
  Buy = 0,
  Sell = 1,
}

export interface IDeliverable {
  name: string;
  status: ContractDeliverableStatus;
  revisionsRequested: number;
}

export interface IDeliverableForApproval extends IDeliverable {
  contractId?: string;
  contractName?: string;
  first?: boolean;
}

export interface IReviewMultipleDeliverablesForm {
  deliverables: IReviewedDeliverable[];
}

export interface IReviewedDeliverable {
  contractId: string;
  contractName: string;
  name: string;
  currentStatus?: ContractDeliverableStatus;
  newStatus: ContractDeliverableStatus | string;
}

export interface IReviewedDeliverableDisplay extends IReviewedDeliverable {
  numDeliverablesRemaining?: number;
  isLastDeliverable?: boolean;
  hasRevisionsRemaining?: boolean;
}

export interface IContract {
  contractId: string;
  contractType: ContractType;
  viewType: ContractViewType;
  name: string;
  displayAmount: number;
  createdDate: string;
  status: ContractStatus;
  completedDate: string;
  delivery: number;
  revisions: number;
  license: string;
  licenseText: string;
  deadlineDate: string;
  paymentStatus: ContractPaymentStatus;
  paymentDate: string;
  chatThreadId: string;
  deliverables: IDeliverable[];
  //todo: consider if these are the proper fields to check if user is seller/buyer
  buyerAdditionalDetails?: IBuyerAdditionalDetails;
  sellerAdditionalDetails?: ISellerAdditionalDetails;
  contractDispute?: ContractDispute;
}

export interface IContractDisplay extends IContract {
  numDeliverables?: number;
  numCompletedDeliverables?: number;
  paymentStatusText?: string;
}

export interface IBuyerAdditionalDetails {
  sellerId: string;
  sellerDisplayName: string;
  totalBuyerAmount: number;
  buyerFee: number;
  profilePicture: string;
  paymentCardBrand: string;
  paymentCardLast4: string;
}

export interface ISellerAdditionalDetails {
  buyerId: string;
  buyerDisplayName: string;
  sellerFee: number;
  totalSellerEarnings: number;
  payoutAmount: number;
  payoutCurrency: number;
  paidOutDate: string;
  payoutArrivalDate: string;
  availableForPayoutDate: string;
  payoutStatus: ContractPayoutStatus;
}

export interface IContractFilters extends IPagingFilter {
  userId?: string;
  search?: string;
}

export const StatusColourDictionary: {
  [key: string]: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
} = {
  [ContractStatus.Created]: 'default',
  [ContractStatus.Complete]: 'success',
  [ContractStatus.Disputed]: 'warning',
  [ContractStatus.Cancelled]: 'error',
  [ContractStatus.InProgress]: 'primary',
};

export interface IContractFeedback {
  contractId: string;
  messageId: string;
  buyerFeedbackType: ContractFeedbackType;
}

interface ContractDispute {
  raisedByUserId: string;
  DateRaised: string;
  dateResolved: string;
  resolvedByUserId: string;
}
