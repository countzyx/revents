import type { NextOrObserver, User, UserInfo as FBUserInfo } from 'firebase/auth';
import type { Unsubscribe as FBUnsubscribe } from 'firebase/firestore';
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
  updatePassword,
  updateProfile,
} from 'firebase/auth';
import { UserCredentials, UserRegistrationInfo } from '../Shared/Types';
import { createUserProfileInFirestore } from './FirestoreUserProfileService';

export const AuthProviderId = ProviderId;
export type Unsubscribe = FBUnsubscribe;
export type UserInfo = FBUserInfo;

export const createPasswordUserInFirebase = async (
  regInfo: UserRegistrationInfo,
): Promise<User> => {
  const { displayName, email, password } = regInfo;
  const auth = getAuth();
  const regResult = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = regResult;
  await updateProfile(user, { displayName });
  await createUserProfileInFirestore(user);
  return regResult.user;
};

export const readCurrentUser = (): User | undefined => {
  const auth = getAuth();
  const { currentUser } = auth;
  if (!currentUser) return undefined;
  return currentUser;
};

export const signInPasswordUserInFirebase = async (creds: UserCredentials): Promise<User> => {
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

export const signInSocialMediaUserInFirebase = async (
  providerName: SocialMediaProvider,
): Promise<User> => {
  const provider = new kSocialMediaMap[providerName]();
  const auth = getAuth();
  const authResult = await signInWithPopup(auth, provider);
  const additionalUserInfo = getAdditionalUserInfo(authResult);
  additionalUserInfo?.isNewUser && (await createUserProfileInFirestore(authResult.user));
  return authResult.user;
};

export const updateAuthUserDisplayNameInFirebase = async (
  displayName: string | undefined,
): Promise<void> => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  if (displayName !== currentUser.displayName) {
    await updateProfile(currentUser, { displayName });
  }
};

export const updateAuthUserPhotoInFirebase = async (newPhotoUrl: string): Promise<void> => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  if (newPhotoUrl !== currentUser.photoURL) {
    await updateProfile(currentUser, { photoURL: newPhotoUrl });
  }
};

export const updatePwUserPasswordInFirebase = async (newPassword: string): Promise<void> => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  return updatePassword(currentUser, newPassword);
};

export const verifyAuthWithFirebase = (authVerifyObserver: NextOrObserver<User>): Unsubscribe => {
  const auth = getAuth();
  return onAuthStateChanged(auth, authVerifyObserver);
};
