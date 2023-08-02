import { IStripeConnect } from 'global/interfaces/payout';
import { authorizedGet, authorizedPost } from './baseApiService';

const resource = 'Payout';

export async function getPayout(): Promise<IStripeConnect> {
  return await authorizedGet<IStripeConnect>(`${resource}`);
}

export async function createOnBoardingUrl(): Promise<string> {
  return await authorizedPost<string>(`${resource}/create-onboarding-url`, {});
}
