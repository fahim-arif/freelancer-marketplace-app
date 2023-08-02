import { ITeamMember } from 'global/interfaces/teamMember';
import { authorizedDelete, authorizedGet, authorizedPost } from './baseApiService';
import { IChatUserThread } from 'global/interfaces/chatThread';

const resource = 'ChatThread';

export async function getThreads(chatThreadId?: string, recipientUserId?: string): Promise<IChatUserThread[]> {
  let url = `${resource}/get-threads`;
  if (chatThreadId && recipientUserId) {
    url += `?chatThreadId=${chatThreadId}&recipientUserId=${recipientUserId}`;
  }

  return await authorizedGet<IChatUserThread[]>(url);
}

export async function getThread(chatThreadId: string, asUserId?: string): Promise<IChatUserThread> {
  return await authorizedGet<IChatUserThread>(
    `${resource}/get-thread?chatThreadId=${chatThreadId}${asUserId !== undefined ? `&asUserId=${asUserId}` : ''}`,
  );
}

export async function addRecipient(teamMember: ITeamMember): Promise<void> {
  return await authorizedPost<void>(`${resource}/add-recipient`, teamMember);
}

export async function removeRecipient(teamMember: ITeamMember): Promise<void> {
  return await authorizedPost<void>(`${resource}/remove-recipient`, teamMember);
}

export async function createGroupThread(name: string): Promise<IChatUserThread> {
  return await authorizedPost<IChatUserThread>(`${resource}/new-group-thread`, { name });
}

export async function newOneToOneThread(recipientUserId: string): Promise<IChatUserThread> {
  return await authorizedPost<IChatUserThread>(`${resource}/new-one-to-one-thread`, { recipientUserId });
}

export async function deleteThread(chatThreadId: string): Promise<boolean> {
  return await authorizedDelete(`${resource}/remove-thread?chatThreadId=${chatThreadId}`);
}
