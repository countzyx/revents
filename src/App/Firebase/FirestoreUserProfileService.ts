import type { User } from 'firebase/auth';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from './Firebase';

const userProfileCollection = collection(db, 'users');

export const setUserProfileInFirestore = async (user: User): Promise<void> => {
  const { displayName, email, photoURL } = user;
  return setDoc(doc(userProfileCollection, user.uid), {
    createdAt: serverTimestamp(),
    displayName,
    email,
    photoURL,
  });
};

export const doNothing = (): void => {
  // stop nagging me, ESLint! I don't want a default export because I'm going to be adding more exports!
};
