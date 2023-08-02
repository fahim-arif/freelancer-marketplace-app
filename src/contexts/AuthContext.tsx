import { createContext } from 'react';
import { HubConnection } from '@microsoft/signalr';
import { UserRole } from 'global/enums/userRole';
import { VettingStatus } from 'global/enums/vettingStatus';

export interface UserAuth {
  id: string;
  firstName: string;
  lastName: string;
  country: string;
  roles: UserRole[];
  vettingStatus: VettingStatus;
}

export interface AuthType {
  loading: boolean;
  loggedIn: boolean;
  user: UserAuth | null;
  hubConnection: HubConnection | null;
  refresh: () => void;
}

const defaultAuthContext: AuthType = {
  loading: true,
  loggedIn: false,
  user: null,
  hubConnection: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refresh(): void {},
};

export const AuthContext = createContext<AuthType | null>(defaultAuthContext);
