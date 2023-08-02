import { authorizedGet } from './baseApiService';

const resource = 'CheckOut';

export async function getCheckOutSecret(): Promise<string> {
  return await authorizedGet<string>(`${resource}`);
}
