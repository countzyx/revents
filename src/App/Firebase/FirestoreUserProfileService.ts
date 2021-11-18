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
import { DocumentObserver } from './FirestoreEventService';
import { photoDataConverter, userProfileConverter } from './FirestoreUtil';

export type Unsubscribe = FBUnsubscribe;

const userProfileCollection = collection(db, 'users').withConverter(userProfileConverter);

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

export const readUserProfileFromFirestore = (
  observer: DocumentObserver,
  userId: string,
): Unsubscribe => onSnapshot(doc(userProfileCollection, userId), observer);

export const updateUserProfileInFirestore = async (profile: UserProfile): Promise<void> => {
  const { displayName } = profile;
  await updateAuthUserDisplayNameInFirebase(displayName);
  const currentUser = readCurrentUser();
  return updateDoc(doc(userProfileCollection, currentUser.uid), profile);
};

export const updateUserProfilePhotoInFirestore = async (photoData: PhotoData): Promise<void> => {
  const currentUser = readCurrentUser();
  const profileDoc = doc(userProfileCollection, currentUser.uid);
  const userProfile = (await getDoc(profileDoc)).data();
  if (!userProfile) throw new Error('No user profile');
  // not sure why we are only updating the photo url if it's empty; users should be able to change it all they want
  if (!userProfile.photoURL) {
    await updateDoc(profileDoc, { photoURL: photoData.photoUrl });
    await updateAuthUserPhotoInFirebase(photoData.photoUrl);
  }
  const photosCollection = collection(db, profileDoc.path, 'photos').withConverter(
    photoDataConverter,
  );
  await addDoc(photosCollection, photoData);
};
