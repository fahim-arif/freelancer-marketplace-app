import { authorizedGet, authorizedPost } from './baseApiService';
import { IChatMessage, IChatFile, IChatUnread } from 'global/interfaces/chatMessage';
import { IDeliverableForApproval } from 'global/interfaces/contract';

const resource = 'ChatMessage';

export async function getNumberUnread(): Promise<IChatUnread> {
  return await authorizedGet<IChatUnread>(`${resource}/get-number-unread`);
}

export async function getMessages(chatThreadId: string, skip: number, take: number): Promise<IChatMessage[]> {
  return await authorizedGet<IChatMessage[]>(
    `${resource}/get-recent-messages?chatThreadId=${chatThreadId}&skip=${skip}&take=${take}`,
  );
}

export async function newTextMessage(chatThreadId: string, content: string): Promise<IChatMessage> {
  return await authorizedPost<IChatMessage>(`${resource}/new-message-text`, { chatThreadId, content });
}

export async function newFileMessage(
  chatThreadId: string,
  files: IChatFile[],
  deliverablesForApproval: IDeliverableForApproval[],
): Promise<boolean> {
  return await authorizedPost<boolean>(`${resource}/new-message-files`, {
    chatThreadId,
    files,
    deliverablesForApproval,
  });
}

export async function markMessagesAsRead(chatThreadId: string): Promise<IChatMessage> {
  return await authorizedPost<IChatMessage>(`${resource}/mark-messages-read`, { chatThreadId });
}

export async function triggerTyping(chatThreadId: string): Promise<IChatMessage> {
  return await authorizedGet<IChatMessage>(`${resource}/typing/${chatThreadId}`);
}

export async function getDisputesMessages(
  chatThreadId: string,
  skip: number,
  take: number,
  asUserId: string,
): Promise<IChatMessage[]> {
  return await authorizedGet(
    `${resource}/get-dispute-messages?chatThreadId=${chatThreadId}&skip=${skip}&take=${take}&asUserId=${asUserId}`,
  );
}
