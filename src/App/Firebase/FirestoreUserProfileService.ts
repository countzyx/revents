import type { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  serverTimestamp,
  setDoc,
  Unsubscribe as FBUnsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { PhotoData, UserBasicInfo, UserProfile } from '../Shared/Types';
import { db } from './Firebase';
import {
  readCurrentUser,
  updateAuthUserDisplayNameInFirebase,
  updateAuthUserPhotoInFirebase,
} from './FirebaseAuthService';
import { CollectionObserver, DocumentObserver } from './FirestoreEventService';
import { userProfileConverter, WithIdDataConverter } from './FirestoreUtil';

export type Unsubscribe = FBUnsubscribe;

const photoDataConverter = WithIdDataConverter<PhotoData>();
const userBasicInfoDataConverter = WithIdDataConverter<UserBasicInfo>();
const relationshipCollection = collection(db, 'relationships');
const userProfileCollection = collection(db, 'users').withConverter(userProfileConverter);

export const createPhotoInProfileCollection = async (
  photoData: PhotoData,
  profilePath?: string,
): Promise<void> => {
  const photosCollection = await getProfilePhotoCollection(profilePath);
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
    followerCount: 0,
    followingCount: 0,
    id: uid,
    photoURL: photoURL || undefined,
  });
};

export const deletePhotoInProfileCollection = async (
  photoId: string,
  profilePath?: string,
): Promise<void> => {
  const photosCollection = await getProfilePhotoCollection(profilePath);
  const photoToDeleteRef = doc(photosCollection, photoId);
  await deleteDoc(photoToDeleteRef);
};

const getProfilePhotoCollection = async (
  profilePath?: string,
): Promise<CollectionReference<PhotoData>> => {
  let photoParentPath = profilePath;
  if (!photoParentPath) {
    const userProfile = await readUserProfileFromFirestore();
    if (!userProfile) throw new Error('No user profile');
    photoParentPath = userProfile.ref.path;
  }
  return collection(db, photoParentPath, 'photos').withConverter(photoDataConverter);
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

export const setFollowUserInFirestore = async (followedUser: UserProfile) => {
  const currentUser = readCurrentUser();
  const currentUserRelationshipRef = doc(relationshipCollection, currentUser.uid);
  const userFollowingCollection = collection(
    db,
    currentUserRelationshipRef.path,
    'following',
  ).withConverter(userBasicInfoDataConverter);
  await setDoc(doc(userFollowingCollection, followedUser.id), {
    id: followedUser.id,
    displayName: followedUser.displayName,
    photoURL: followedUser.photoURL,
  });

  const followedUserRelationshipRef = doc(relationshipCollection, followedUser.id);
  const userFollowersCollection = collection(
    db,
    followedUserRelationshipRef.path,
    'followers',
  ).withConverter(userBasicInfoDataConverter);
  await setDoc(doc(userFollowersCollection, currentUser.uid), {
    id: currentUser.uid,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL,
  });

  const currentUserProfileRef = doc(userProfileCollection, currentUser.uid);
  await updateDoc(currentUserProfileRef, { followingCount: increment(1) });

  const followedUserProfileRef = doc(userProfileCollection, followedUser.id);
  await updateDoc(followedUserProfileRef, { followerCount: increment(1) });
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
  await updateDoc(userProfile.ref, { photoURL: photoData.photoURL });
  await updateAuthUserPhotoInFirebase(photoData.photoURL);
};

export const watchUserProfileFromFirestore = (
  observer: DocumentObserver,
  userId: string,
): Unsubscribe => onSnapshot(doc(userProfileCollection, userId), observer);
