import { profileContainer } from 'global/constants';
import { FileType } from 'global/enums/fileTypes';
import { IUploadQueue } from 'global/interfaces/user';

export function getThumbnailId(id: string): string {
  return id + '_thumbnail';
}

export function openPDF(path: string, container: string = profileContainer): void {
  const url = `${process.env.REACT_APP_BLOB_URL ?? ''}/${container}/${path}`;
  window.open(url, '_blank');
}

export async function getBase64Image(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      resolve(String(reader.result));
    };
    reader.onerror = function (error) {
      reject(error);
    };
  });
}

export function getTempFileId(): string {
  return (Math.random() + 1).toString(36);
}

export function getFileType(type: string): FileType {
  if (type.includes('image/')) {
    return FileType.Image;
  }
  if (type.includes('video/')) {
    return FileType.Video;
  }
  if (type.includes('application/pdf')) {
    return FileType.Pdf;
  }
  return FileType.Other;
}

export function createFileFormData(file: File): FormData {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export function getPreUploadFormFile(file: File): IUploadQueue {
  const formFile: IUploadQueue = {
    isUploadCancelled: false,
    file,
    tempId: getTempFileId(),
  };
  return formFile;
}
