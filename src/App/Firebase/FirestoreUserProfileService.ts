import type { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Unsubscribe as FBUnsubscribe,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { EventInfo, PhotoData, UserBasicInfo, UserProfile } from '../Shared/Types';
import { getDateTimeStringFromDate } from '../Shared/Utils';
import { db } from './Firebase';
import {
  readCurrentUser,
  updateAuthUserDisplayNameInFirebase,
  updateAuthUserPhotoInFirebase,
} from './FirebaseAuthService';
import { CollectionObserver, DocumentObserver, eventsCollection } from './FirestoreEventService';
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

export const readIsUserFollowedFromFirestore = async (followedUserId: string): Promise<boolean> => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const currentUserRelationshipRef = doc(relationshipCollection, currentUser.uid);
  const userFollowingCollection = collection(
    db,
    currentUserRelationshipRef.path,
    'following',
  ).withConverter(userBasicInfoDataConverter);
  const snapshot = await getDoc(doc(userFollowingCollection, followedUserId));
  return snapshot.exists();
};

const readUserProfileFromFirestore = async () => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
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
  if (!currentUser) throw new Error('No current user');
  const batch = writeBatch(db);

  const currentUserRelationshipRef = doc(relationshipCollection, currentUser.uid);
  const userFollowingCollection = collection(
    db,
    currentUserRelationshipRef.path,
    'following',
  ).withConverter(userBasicInfoDataConverter);
  batch.set(doc(userFollowingCollection, followedUser.id), {
    id: followedUser.id,
    displayName: followedUser.displayName,
    photoURL: followedUser.photoURL,
  });

  const currentUserProfileRef = doc(userProfileCollection, currentUser.uid);
  batch.update(currentUserProfileRef, { followingCount: increment(1) });

  await batch.commit();
};

export const setUnfollowUserInFirestore = async (followedUserId: string) => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const batch = writeBatch(db);

  const currentUserRelationshipRef = doc(relationshipCollection, currentUser.uid);
  const userFollowingCollection = collection(
    db,
    currentUserRelationshipRef.path,
    'following',
  ).withConverter(userBasicInfoDataConverter);
  batch.delete(doc(userFollowingCollection, followedUserId));

  const currentUserProfileRef = doc(userProfileCollection, currentUser.uid);
  batch.update(currentUserProfileRef, { followingCount: increment(-1) });

  batch.commit();
};

export const updateUserProfileInFirestore = async (profile: UserProfile): Promise<void> => {
  const { displayName } = profile;
  await updateAuthUserDisplayNameInFirebase(displayName);
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  return updateDoc(doc(userProfileCollection, currentUser.uid), profile);
};

export const updateUserProfilePhotoInFirestore = async (photoData: PhotoData): Promise<void> => {
  const userProfile = await readUserProfileFromFirestore();
  if (!userProfile) throw new Error('No user profile');

  const { photoURL } = photoData;

  // Update the user photo everywhere or nowhere.
  const batch = writeBatch(db);

  // Update the main photo in the user profile.
  batch.update(userProfile.ref, { photoURL });

  // Update the user photo in all upcoming events.
  const now = getDateTimeStringFromDate(new Date()); // we are storing dates as strings
  const eventDocQuery = query(
    eventsCollection,
    where('attendeeIds', 'array-contains', userProfile.id),
    where('date', '>=', now),
  );
  const eventDocsSnap = await getDocs(eventDocQuery);
  eventDocsSnap.forEach((eventDoc) => {
    const event = eventDoc.data() as EventInfo;

    // Update the host photo if user is hosting.
    if (event.hostUid === userProfile.id) {
      batch.update(eventDoc.ref, { hostPhotoURL: photoURL });
    }

    // Update attendee photo if user is attending event.
    const updatedAttendees =
      event.attendees &&
      event.attendees.map((a) => ({
        ...a,
        photoURL: a.id === userProfile.id ? photoURL : a.photoURL,
      }));
    updatedAttendees &&
      batch.update(eventDoc.ref, {
        attendees: updatedAttendees,
      });
  });

  // Update the user photo in the relationships for all the people the user follows.
  const userRelationshipRef = doc(relationshipCollection, userProfile.id);
  const userFollowingCollection = collection(
    db,
    userRelationshipRef.path,
    'following',
  ).withConverter(userBasicInfoDataConverter);
  const userFollowingDocsSnap = await getDocs(userFollowingCollection);
  userFollowingDocsSnap.forEach((followedInfoRef) => {
    const followedDocRef = doc(relationshipCollection, followedInfoRef.id);
    const userFollowerDocRef = doc(db, followedDocRef.path, 'followers', userProfile.id);
    batch.update(userFollowerDocRef, { photoURL });
  });

  await batch.commit();

  // This can't be part of the batch because it doesn't work with updating the user auth record.
  // If the batch fails, this won't run, so it's effectively part of the batch.
  await updateAuthUserPhotoInFirebase(photoData.photoURL);
};

export const watchFollowersForProfileFromFirestore = (
  observer: CollectionObserver,
  profileId: string,
): Unsubscribe => {
  const profileRelationshipRef = doc(relationshipCollection, profileId);
  return onSnapshot(
    collection(db, profileRelationshipRef.path, 'followers').withConverter(
      userBasicInfoDataConverter,
    ),
    observer,
  );
};

export const watchFollowingForProfileFromFirestore = (
  observer: CollectionObserver,
  profileId: string,
): Unsubscribe => {
  const profileRelationshipRef = doc(relationshipCollection, profileId);
  return onSnapshot(
    collection(db, profileRelationshipRef.path, 'following').withConverter(
      userBasicInfoDataConverter,
    ),
    observer,
  );
};

export const watchUserProfileFromFirestore = (
  observer: DocumentObserver,
  userId: string,
): Unsubscribe => onSnapshot(doc(userProfileCollection, userId), observer);
