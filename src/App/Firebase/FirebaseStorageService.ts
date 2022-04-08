import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import type { StorageReference, UploadTask } from 'firebase/storage';
import { readCurrentUser } from './FirebaseAuthService';

export const createImageInFirebase = (fileName: string, image: Blob): UploadTask => {
  const trimmedFileName = fileName.trim();
  if (!trimmedFileName) throw new Error('file name is empty');
  if (!image || image.size === 0) throw new Error('image is empty');
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const storage = getStorage();
  const fileRef = ref(storage, `${currentUser.uid}/images/${trimmedFileName}`);
  return uploadBytesResumable(fileRef, image);
};

export const deleteImageInFirebase = (fileName: string): Promise<void> => {
  const trimmedFileName = fileName.trim();
  if (!trimmedFileName) throw new Error('file name is empty');
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const storage = getStorage();
  const fileRef = ref(storage, `${currentUser.uid}/images/${trimmedFileName}`);
  return deleteObject(fileRef);
};

export const readDownloadUrl = async (uploadedRef: StorageReference): Promise<string> =>
  getDownloadURL(uploadedRef);
