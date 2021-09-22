import type { NextOrObserver, User } from 'firebase/auth';
import type { Unsubscribe } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  onAuthStateChanged,
  ProviderId,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { UserCredentials, UserRegistrationInfo } from '../Shared/Types';
import { setUserProfileInFirestore } from './FirestoreUserProfileService';

export const registerUserInFirebase = async (regInfo: UserRegistrationInfo): Promise<User> => {
  const auth = getAuth();
  const regResult = await createUserWithEmailAndPassword(auth, regInfo.email, regInfo.password);
  const { user } = regResult;
  await updateProfile(user, { displayName: regInfo.displayName });
  await setUserProfileInFirestore(user);
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

const kSocialMediaMap = {
  [ProviderId.FACEBOOK]: FacebookAuthProvider,
  [ProviderId.GOOGLE]: GoogleAuthProvider,
};

const kSocialMediaProviders = [ProviderId.FACEBOOK, ProviderId.GOOGLE] as const;
export type SocialMediaProvider = typeof kSocialMediaProviders[number];

export const socialMediaSignInForFirebase = async (
  providerName: SocialMediaProvider,
): Promise<User> => {
  const provider = new kSocialMediaMap[providerName]();
  const auth = getAuth();
  const authResult = await signInWithPopup(auth, provider);
  const additionalUserInfo = getAdditionalUserInfo(authResult);
  additionalUserInfo?.isNewUser && (await setUserProfileInFirestore(authResult.user));
  return authResult.user;
};

export const verifyAuthWithFirebase = (authVerifyObserver: NextOrObserver<User>): Unsubscribe => {
  const auth = getAuth();
  return onAuthStateChanged(auth, authVerifyObserver);
};
