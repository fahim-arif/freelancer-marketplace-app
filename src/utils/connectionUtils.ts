import { IConnection } from 'global/interfaces/connection';
import { SelectItem } from 'global/interfaces/selects';

export const mapConnectionsToSelectItems = (connections: IConnection[]): SelectItem[] =>
  connections.map(c => ({
    id: c.otherUser?.userId ?? '',
    label: c.otherUser?.displayName ?? '',
  }));
