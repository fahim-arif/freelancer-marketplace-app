import { AxiosError } from 'axios';

export function showUIError(message: string): void {
  alert(message);
}

export function handleApiError(err: AxiosError): void {
  console.log(err);
}

export function handleSignalRError(err: string): void {
  console.log(err);
}
