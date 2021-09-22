import type { NextOrObserver } from 'firebase/auth';
import type { Unsubscribe } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { UserCredentials, UserRegistrationInfo } from '../Shared/Types';

export const registerUserInFirebase = async (regInfo: UserRegistrationInfo): Promise<User> => {
  const auth = getAuth();
  const regResult = await createUserWithEmailAndPassword(auth, regInfo.email, regInfo.password);
  await updateProfile(regResult.user, { displayName: regInfo.displayName });
  return regResult.user;
};

export const signInUserInFirebase = async (creds: UserCredentials): Promise<User> => {
  const auth = getAuth();
  const authResult = await signInWithEmailAndPassword(auth, creds.email, creds.password);
  return authResult.user;
};

export const signOutUserInFirebase = async (): Promise<void> => {
  const auth = getAuth();
  await signOut(auth);
};

export const verifyAuthWithFirebase = (authVerifyObserver: NextOrObserver<User>): Unsubscribe => {
  const auth = getAuth();
  return onAuthStateChanged(auth, authVerifyObserver);
};
