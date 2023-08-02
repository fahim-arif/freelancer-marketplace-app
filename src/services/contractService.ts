import {
  IContractPaymentSecret,
  ICreateContractForm,
  IContract,
  IContractDisplay,
  ContractDeliverableStatus,
  ContractPaymentStatus,
  IReviewedDeliverable,
  ContractStatus,
  IDeliverableForApproval,
  ContractPayoutStatus,
  IContractFilters,
  IContractFeedback,
} from 'global/interfaces/contract';
import { authorizedPost, authorizedGet } from './baseApiService';
import { getQueryParams } from 'utils/url';

const coreResource = 'core/Contract';

interface ICreateContractRequest extends ICreateContractForm {
  chatThreadId?: string;
}

export function updateContract(contract: IContractDisplay): void {
  contract.numDeliverables = contract.deliverables.length;
  const completedDeliverables = contract.deliverables.filter(p => p.status === ContractDeliverableStatus.Approved);
  contract.numCompletedDeliverables = completedDeliverables.length;

  if (contract.status === ContractStatus.Complete && contract.buyerAdditionalDetails) {
    contract.paymentStatusText = 'Paid';
  } else if (contract.status === ContractStatus.Complete && contract.sellerAdditionalDetails) {
    if (contract.sellerAdditionalDetails?.payoutStatus === ContractPayoutStatus.Success) {
      contract.paymentStatusText =
        'Paid Out: ' +
        contract.sellerAdditionalDetails.payoutCurrency +
        ' ' +
        contract.sellerAdditionalDetails.payoutAmount;
    } else {
      const payoutDateString = contract.sellerAdditionalDetails?.availableForPayoutDate;
      const date = payoutDateString != undefined ? new Intl.DateTimeFormat().format(new Date(payoutDateString)) : '';
      contract.paymentStatusText = 'On: ' + date;
    }
  } else if (contract.paymentStatus === ContractPaymentStatus.Success) {
    contract.paymentStatusText = 'In escrow';
  } else if (contract.paymentStatus === ContractPaymentStatus.Refunded) {
    contract.paymentStatusText = 'Refunded';
  } else if (contract.status === ContractStatus.Cancelled) {
    contract.paymentStatusText = 'Cancelled';
  } else {
    contract.paymentStatusText = 'Awaiting';
  }
}

export async function createContract(
  createContractForm: ICreateContractRequest,
  chatThreadId: string | undefined,
): Promise<boolean> {
  createContractForm.chatThreadId = chatThreadId;
  return await authorizedPost(`${coreResource}/create-contract`, createContractForm);
}

export async function getContractPaymentSecret(contractId: string): Promise<IContractPaymentSecret> {
  return await authorizedGet<IContractPaymentSecret>(`${coreResource}/get-payment-secret?contractId=${contractId}`);
}

export async function getContract(contractId: string): Promise<IContract> {
  return await authorizedGet<IContract>(`${coreResource}/get-contract?contractId=${contractId}`);
}

export async function getOpenContracts(chatThreadId: string): Promise<IContract[]> {
  return await authorizedGet<IContract[]>(`${coreResource}/get-open-contracts?chatThreadId=${chatThreadId}`);
}

export async function getContracts(filters: IContractFilters | null): Promise<IContract[]> {
  return await authorizedGet<IContract[]>(`${coreResource}/get-contracts?${getQueryParams(filters)}`);
}

export async function reviewDeliverables(
  reviewedDeliverables: IReviewedDeliverable[],
  messageId: string,
): Promise<boolean> {
  return await authorizedPost(`${coreResource}/review-deliverables`, { reviewedDeliverables, messageId });
}

export async function sendDeliverablesForApproval(
  chatThreadId: string,
  deliverablesForApproval: IDeliverableForApproval[],
): Promise<boolean> {
  return await authorizedPost<boolean>(`${coreResource}/send-deliverables-for-approval`, {
    chatThreadId,
    deliverablesForApproval,
  });
}

export async function giveFeedback(feedback: IContractFeedback): Promise<boolean> {
  return await authorizedPost<boolean>(`${coreResource}/contract-feedback`, feedback);
}

export async function cancelContract(contractId: string): Promise<boolean> {
  return await authorizedPost<boolean>(`${coreResource}/cancel-contract?contractId=${contractId}`, {});
}

export async function raiseDispute(contractId: string): Promise<boolean> {
  return await authorizedPost<boolean>(`${coreResource}/raise-dispute/${contractId}`, {});
}

export async function getDisputes(): Promise<IContract[]> {
  return await authorizedGet<IContract[]>(`${coreResource}/get-disputes`);
}
