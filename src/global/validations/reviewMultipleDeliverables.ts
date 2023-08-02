import {
  ContractDeliverableStatus,
  IReviewedDeliverable,
  IReviewMultipleDeliverablesForm,
} from 'global/interfaces/contract';
import { object, string, SchemaOf, array, mixed } from 'yup';

export const reviewedDeliverableValidation: SchemaOf<IReviewedDeliverable> = object({
  contractId: string().required(),
  contractName: string().required(),
  name: string().required(),
  currentStatus: mixed<ContractDeliverableStatus>().notRequired(),
  newStatus: mixed<ContractDeliverableStatus>().required('You must review this deliverable'),
});

export const reviewMultipleDeliverablesValidation: SchemaOf<IReviewMultipleDeliverablesForm> = object({
  deliverables: array(reviewedDeliverableValidation),
});
