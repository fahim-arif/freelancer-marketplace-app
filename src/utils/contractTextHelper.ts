import { ContractPayoutStatus, ContractStatus, IContract } from 'global/interfaces/contract';

const successfulPayment = new URLSearchParams(window.location.search).get('successfulPayment') as string;

export const getContractStatusText = (contract: IContract): string => {
  let status: string = ContractStatus[contract.status];
  if (contract?.status === ContractStatus.InProgress || successfulPayment === 'true') {
    status = 'In Progress';
  } else if (contract?.status === ContractStatus.Created) {
    status = 'Awaiting Payment';
  } else if (contract?.status === ContractStatus.Complete) {
    status = 'Complete';
  } else if (contract?.status === ContractStatus.Disputed) {
    status = 'Disputed';
  }
  return status;
};

export const getPayoutStatusText = (contract: IContract): string => {
  let status = '';
  if (contract.sellerAdditionalDetails === undefined || contract.status !== ContractStatus.Complete) {
    status = 'Work Not Completed';
  } else if (contract?.sellerAdditionalDetails?.payoutStatus === ContractPayoutStatus.AwaitingFunds) {
    status = 'Awaiting Buyer Funds';
  } else if (contract?.sellerAdditionalDetails?.payoutStatus === ContractPayoutStatus.AwaitingPayout) {
    status = 'Awaiting Payout';
  } else if (contract?.sellerAdditionalDetails?.payoutStatus === ContractPayoutStatus.Success) {
    status = 'Paid out';
  }

  return status;
};
