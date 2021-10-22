import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe as FBUnsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { UserProfile } from '../Shared/Types';
import { db } from './Firebase';
import { readCurrentUserId, updateAuthUserDisplayNameInFirebase } from './FirebaseAuthService';
import { DocumentObserver } from './FirestoreEventService';
import dateConverter from './FirestoreUtil';

export type Unsubscribe = FBUnsubscribe;

const userProfileCollection = collection(db, 'users').withConverter(dateConverter<UserProfile>());

export const createUserProfileInFirestore = async (user: User): Promise<void> => {
  const { displayName, email, photoURL } = user;
  if (!email) {
    throw new Error('email is null');
  }
  return setDoc(doc(userProfileCollection, user.uid), {
    createdAt: serverTimestamp(),
    displayName: displayName || undefined,
    email,
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
  const uid = readCurrentUserId();
  return updateDoc(doc(userProfileCollection, uid), profile);
};
