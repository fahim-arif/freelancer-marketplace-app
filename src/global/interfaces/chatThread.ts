export enum ChatType {
  OneToOne = 0,
  Group = 1,
}

export interface IChatUserThread {
  createdByUserId: string;
  chatThreadId: string;
  displayName: string;
  otherUserId: string;
  type: ChatType;
  numberOfItemsUnread: number;
  lastMessageOn: string;
  active: boolean;
  recipients: IChatRecipient[];
  disputeRaisedById?: string;
}

export interface IChatRecipient {
  userId: string;
  displayName: string;
  numberUnread: number;
  active: boolean;
}

export interface IChatThreadUpdated {
  id: string;
}
