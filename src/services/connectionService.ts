import {
  IConnection,
  IConnectionSearchRequest,
  IConnectionCreateRequest,
  IInvitationCount,
  IInvitationCreateRequest,
  IInvitationSearchRequest,
} from 'global/interfaces/connection';
import { authorizedDelete, authorizedGet, authorizedPost } from './baseApiService';
import { getQueryParams } from 'utils/url';
import { ConnectionDirection } from 'global/enums/connectionDirection';
import { ConnectionStatus } from 'global/enums/connectionStatus';

const baseUrl = 'network';
const connectionsUrl = 'connections';
const invitationsUrl = 'invitations';

export async function getActiveConnections(): Promise<IConnection[]> {
  const req: IConnectionSearchRequest = {
    status: ConnectionStatus.Active,
  };
  return getConnections(req);
}

export async function getConnections(req: IConnectionSearchRequest): Promise<IConnection[]> {
  return await authorizedGet(`${baseUrl}/${connectionsUrl}?${getQueryParams(req)}`);
}

export async function removeConnection(connectionId: string): Promise<boolean> {
  return await authorizedDelete(`${baseUrl}/${connectionsUrl}/${connectionId}`);
}

export async function acceptConnectionRequest(connectionId: string): Promise<IConnection> {
  const createReq: IConnectionCreateRequest = {
    connectionId,
    accept: true,
  };
  return await createConnection(createReq);
}

export async function rejectConnectionRequest(connectionId: string, reason?: string): Promise<IConnection> {
  const createReq: IConnectionCreateRequest = {
    connectionId,
    reason,
    accept: false,
  };
  return await createConnection(createReq);
}

async function createConnection(createReq: IConnectionCreateRequest): Promise<IConnection> {
  return await authorizedPost(`${baseUrl}/${connectionsUrl}`, createReq);
}

export async function createInvitation(createReq: IInvitationCreateRequest): Promise<IConnection> {
  return await authorizedPost(`${baseUrl}/${invitationsUrl}`, createReq);
}

export async function getInvitations(): Promise<IConnection[]> {
  return await authorizedGet(`${baseUrl}/${invitationsUrl}`);
}

export async function getConnectionToUser(userId: string): Promise<IConnection | null> {
  const req: IConnectionSearchRequest = {
    otherUserId: userId,
  };
  const connections = await getConnections(req);
  if (connections && connections.length > 0) {
    return connections[0];
  }
  return null;
}

export async function getReceivedInvitationCount(): Promise<IInvitationCount> {
  const req: IInvitationSearchRequest = {
    direction: ConnectionDirection.Receive,
  };
  return await authorizedGet<IInvitationCount>(`${baseUrl}/invitationCounts?${getQueryParams(req)}`);
}

export async function getNumberConnections(): Promise<number> {
  return await authorizedGet<number>(`${baseUrl}/get-number-connections`);
}
