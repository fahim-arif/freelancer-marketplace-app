import { IChatFile } from 'global/interfaces/chatMessage';
import { handleApiError } from 'utils/errorHandler';
import { authorizedPost } from './baseApiService';
import authApi from './apiService';

import { createFileFormData, getFileType } from 'utils/file';
import { IFileMetadata } from 'global/interfaces/file';

const resource = 'Storage';

export async function saveImage(file: File): Promise<IFileMetadata> {
  const formData = createFileFormData(file);
  return await initFilePost<IFileMetadata>(formData, '/profileImages');
}

export async function savePortfolioFiles(file: File, controller: AbortController): Promise<IFileMetadata> {
  const formData = createFileFormData(file);
  return await initFilePost<IFileMetadata>(formData, '/portfolioFiles', controller);
}

export async function createChatFileUrl(file: IChatFile): Promise<string> {
  return await authorizedPost<string>(`${resource}/CreateChatFileUrl`, {
    chatThreadId: file.chatThreadId,
    fileName: file.fileName,
    extension: file.extension,
  });
}

export async function saveChatFile(
  upload: File,
  chatThreadId: string,
  controller: AbortController,
): Promise<IChatFile> {
  const formData = new FormData();
  formData.append('upload.file', upload);
  formData.append('upload.fileType', JSON.stringify(getFileType(upload.type)));
  formData.append('upload.chatThreadId', chatThreadId);

  return await initFilePost<IChatFile>(formData, '/SaveChatFile', controller);
}

async function initFilePost<T>(
  formData: FormData | object,
  route = '',
  controller: AbortController | undefined = undefined,
): Promise<T> {
  return await new Promise((resolve, reject) => {
    authApi
      .post(`${resource}${route}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        signal: controller?.signal,
      })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        handleApiError(error);
        reject({ message: error.message, status: error.response?.status });
      });
  });
}
