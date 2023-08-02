import { FileType } from 'global/enums/fileTypes';

export interface IFileMetadata {
  id: string;
  name: string;
  directory: string;
  type: FileType;
  extension: string;
  isProcessed: boolean;
  path: string;
}
