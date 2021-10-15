import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe as FBUnsubscribe,
} from 'firebase/firestore';
import { UserProfile } from '../Shared/Types';
// import { UserProfile } from '../Shared/Types';
import { db } from './Firebase';
import { DocumentObserver } from './FirestoreEventService';
import dateConverter from './FirestoreUtil';
// import dateConverter from './FirestoreUtil';

export type Unsubscribe = FBUnsubscribe;

const userProfileCollection = collection(db, 'users').withConverter(dateConverter<UserProfile>());

export const setUserProfileInFirestore = async (user: User): Promise<void> => {
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

export const getUserProfileFromFirestore = (
  observer: DocumentObserver,
  userId: string,
): Unsubscribe => onSnapshot(doc(userProfileCollection, userId), observer);
