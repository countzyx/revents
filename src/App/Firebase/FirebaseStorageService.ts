import { getStorage, ref, uploadBytes, UploadResult } from 'firebase/storage';
import { readCurrentUser } from './FirebaseAuthService';

export const createFileInFirebase = async (file: File, fileName: string): Promise<UploadResult> => {
  const trimmedFileName = fileName.trim();
  if (!trimmedFileName) throw new Error('File name is empty');
  if (file.size === 0) throw new Error('File is empty');
  const currentUser = readCurrentUser();
  const storage = getStorage();
  const fileRef = ref(storage, `${currentUser.uid}/images/${trimmedFileName}`);
  return uploadBytes(fileRef, file);
};

export default createFileInFirebase;
