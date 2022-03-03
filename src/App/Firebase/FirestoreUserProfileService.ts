import type { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe as FBUnsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { PhotoData, UserProfile } from '../Shared/Types';
import { db } from './Firebase';
import {
  readCurrentUser,
  updateAuthUserDisplayNameInFirebase,
  updateAuthUserPhotoInFirebase,
} from './FirebaseAuthService';
import { CollectionObserver, DocumentObserver } from './FirestoreEventService';
import { photoDataConverter, userProfileConverter } from './FirestoreUtil';

export type Unsubscribe = FBUnsubscribe;

const userProfileCollection = collection(db, 'users').withConverter(userProfileConverter);

export const createPhotoInProfileCollection = async (
  photoData: PhotoData,
  profilePath?: string,
): Promise<void> => {
  let photoParentPath = profilePath;
  if (!photoParentPath) {
    const userProfile = await readUserProfileFromFirestore();
    if (!userProfile) throw new Error('No user profile');
    photoParentPath = userProfile.ref.path;
  }
  const photosCollection = collection(db, photoParentPath, 'photos').withConverter(
    photoDataConverter,
  );
  await addDoc(photosCollection, photoData);
};

export const createUserProfileInFirestore = async (user: User): Promise<void> => {
  const { displayName, email, photoURL, uid } = user;
  if (!email) {
    throw new Error('email is null');
  }
  return setDoc(doc(userProfileCollection, uid), {
    createdAt: serverTimestamp(),
    displayName: displayName || undefined,
    email,
    id: uid,
    photoURL: photoURL || undefined,
  });
};

const readUserProfileFromFirestore = async () => {
  const currentUser = readCurrentUser();
  const profileDoc = doc(userProfileCollection, currentUser.uid);
  const userProfile = await getDoc(profileDoc);
  return userProfile;
};

export const readUserProfilePhotosFromFirestore = (
  observer: CollectionObserver,
  userId: string,
): Unsubscribe => {
  const profileDoc = doc(userProfileCollection, userId);
  const photosCollection = collection(db, profileDoc.path, 'photos').withConverter(
    photoDataConverter,
  );
  return onSnapshot(photosCollection, observer);
};

export const updateUserProfileInFirestore = async (profile: UserProfile): Promise<void> => {
  const { displayName } = profile;
  await updateAuthUserDisplayNameInFirebase(displayName);
  const currentUser = readCurrentUser();
  return updateDoc(doc(userProfileCollection, currentUser.uid), profile);
};

export const updateUserProfilePhotoInFirestore = async (photoData: PhotoData): Promise<void> => {
  const userProfile = await readUserProfileFromFirestore();
  if (!userProfile) throw new Error('No user profile');
  await updateDoc(userProfile.ref, { photoURL: photoData.photoUrl });
  await updateAuthUserPhotoInFirebase(photoData.photoUrl);
};

export const watchUserProfileFromFirestore = (
  observer: DocumentObserver,
  userId: string,
): Unsubscribe => onSnapshot(doc(userProfileCollection, userId), observer);
