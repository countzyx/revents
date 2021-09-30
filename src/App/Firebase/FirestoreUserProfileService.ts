import type { User } from 'firebase/auth';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
// import { UserProfile } from '../Shared/Types';
import { db } from './Firebase';
// import dateConverter from './FirestoreUtil';

const userProfileCollection = collection(db, 'users');

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

export const doNothing = (): void => {
  // stop nagging me, ESLint! I don't want a default export because I'm going to be adding more exports!
};
