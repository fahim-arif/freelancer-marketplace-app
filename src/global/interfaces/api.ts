export default interface IApiError {
  message: string;
  status: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isApiError = (obj: any): obj is IApiError => 'message' in obj && 'status' in obj;
