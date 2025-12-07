import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { apiClient, API_BASE_URL } from './api-client';
import { MomResponse, MomRecord } from '@/types/mom';

const guessMimeType = (name: string) => {
  if (name.endsWith('.wav')) return 'audio/wav';
  if (name.endsWith('.mp3')) return 'audio/mpeg';
  if (name.endsWith('.m4a') || name.endsWith('.mp4')) return 'audio/mp4';
  return 'audio/wav';
};

const normalizeUri = (uri: string) => (uri.startsWith('file://') ? uri : `file://${uri}`);

const audioFileFromUri = (uri: string) => {
  const parts = uri.split('/');
  const name = parts[parts.length - 1] || 'meeting.wav';
  const type = guessMimeType(name.toLowerCase());
  return {
    uri: normalizeUri(uri),
    name,
    type,
  } as any;
};

const uploadNative = async (fileUri: string): Promise<MomResponse> => {
  const file = audioFileFromUri(fileUri);
  const url = `${API_BASE_URL}/process_audio`;

  const result = await FileSystem.uploadAsync(url, file.uri, {
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: 'file',
    mimeType: file.type,
    parameters: {},
    headers: {
      Accept: 'application/json',
    },
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Upload failed with status ${result.status}`);
  }

  try {
    return JSON.parse(result.body) as MomResponse;
  } catch (err) {
    throw new Error(`Failed to parse server response: ${String(err)}`);
  }
};

const uploadWeb = async (fileUri: string): Promise<MomResponse> => {
  // On web we receive blob: URLs; fetch and append as a file.
  const response = await fetch(fileUri);
  const blob = await response.blob();
  const name = fileUri.split('/').pop() || 'meeting.wav';
  const type = blob.type || guessMimeType(name.toLowerCase());

  const formData = new FormData();
  formData.append('file', blob, name);

  const res = await fetch(`${API_BASE_URL}/process_audio`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    throw new Error(`Upload failed with status ${res.status}`);
  }
  return (await res.json()) as MomResponse;
};

const processAudio = async (fileUri: string): Promise<MomResponse> => {
  if (Platform.OS === 'web') {
    return uploadWeb(fileUri);
  }
  return uploadNative(fileUri);
};

const fetchMomList = async (): Promise<MomRecord[]> => {
  return apiClient.get<MomRecord[]>('/mom');
};

const fetchMom = async (id: string): Promise<MomRecord> => {
  return apiClient.get<MomRecord>(`/mom/${id}`);
};

export const momService = {
  processAudio,
  fetchMomList,
  fetchMom,
};
