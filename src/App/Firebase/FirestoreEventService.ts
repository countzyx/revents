import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from 'firebase/firestore';
import type {
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  QuerySnapshot,
  Unsubscribe as FBUnsubscribe,
} from 'firebase/firestore';
import {
  DataSnapshot,
  limitToLast,
  onValue,
  orderByKey,
  push,
  query as fbQuery,
  ref,
  ThenableReference,
} from 'firebase/database';
import { eventConverter } from './FirestoreUtil';
import {
  ChatComment,
  EventInfo,
  EventSearchCriteria,
  UserBasicInfo,
  UserEventType,
} from '../Shared/Types';
import { db, rtdb } from './Firebase';
import { readCurrentUser } from './FirebaseAuthService';
import { getPreciseDateTimeStringFromDate } from '../Shared/Utils';
import { kUnknownUserImageUrl } from '../Shared/Constants';

export type CollectionObserver = {
  next?: (snapshot: QuerySnapshot) => void;
  error?: (error: FirestoreError) => void;
  complete?: () => void; // Never gets executed by Firestore.
};

export type DocumentObserver = {
  next?: (snapshot: DocumentSnapshot) => void;
  error?: (error: FirestoreError) => void;
  complete?: () => void; // Never gets executed by Firestore.
};

export type FirebaseObserver = (snapshot: DataSnapshot) => void;

export type Unsubscribe = FBUnsubscribe;

const eventsCollection = collection(db, 'events').withConverter(eventConverter);

export const addCurrentUserAsEventAttendeeInFirestore = async (event: EventInfo): Promise<void> => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  return updateDoc(doc(eventsCollection, event.id), {
    attendees: arrayUnion({
      id: currentUser.uid,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
    } as UserBasicInfo), // casted to enfore data consistency
    attendeeIds: arrayUnion(currentUser.uid),
  });
};

export const addEventChatCommentAsCurrentUserInFirebase = (
  eventId: string,
  comment: string,
  parentCommentId?: string,
): ThenableReference => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const { uid, displayName, photoURL } = currentUser;
  const newComment: ChatComment = {
    datetime: getPreciseDateTimeStringFromDate(new Date()),
    uid,
    name: displayName || '',
    parentId: parentCommentId || '',
    photoURL: photoURL || kUnknownUserImageUrl,
    text: comment,
  };
  const chatRef = ref(rtdb, `chat/${eventId}`);
  return push(chatRef, { ...newComment, parentId: newComment.parentId || null }); // trick to keep ChatComment type null-less.
};

export const createEventInFirestore = async (
  event: EventInfo,
): Promise<DocumentReference<EventInfo>> => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const { uid, displayName, photoURL } = currentUser;
  return addDoc(eventsCollection, {
    ...event,
    hostUid: uid,
    hostedBy: displayName || 'anonymous',
    hostPhotoURL: photoURL || kUnknownUserImageUrl,
    attendees: arrayUnion({
      id: uid,
      displayName: displayName || 'anonymous',
      photoURL: photoURL || kUnknownUserImageUrl,
    } as UserBasicInfo), // casted to enfore data consistency
    attendeeIds: arrayUnion(uid),
    isCancelled: false,
  });
};

export const deleteEventInFirestore = async (eventId: string): Promise<void> =>
  deleteDoc(doc(eventsCollection, eventId));

export const readAllEventsFromFirestore = async (
  searchCriteria: EventSearchCriteria,
  lastVisibleEvent?: EventInfo,
  perPageLimit = 2,
): Promise<QuerySnapshot<EventInfo>> => {
  const lastVisibleDoc = lastVisibleEvent
    ? await getDoc(doc(eventsCollection, lastVisibleEvent.id))
    : null;
  const criteria: QueryConstraint[] = [
    orderBy('date'),
    limit(perPageLimit),
    startAfter(lastVisibleDoc),
  ];
  const currentUser = readCurrentUser();
  if (currentUser) {
    const { uid } = currentUser;
    criteria.push(where('date', '>=', searchCriteria.startDate));
    switch (searchCriteria.filter) {
      case 'isGoing': {
        criteria.push(where('attendeeIds', 'array-contains', uid));
        break;
      }
      case 'isHost': {
        criteria.push(where('hostUid', '==', uid));
        break;
      }
    }
  }

  const allEventsQuery = query(eventsCollection, ...criteria);
  return getDocs(allEventsQuery);
};

export const removeCurrentUserAsEventAttendeeInFirestore = async (
  event: EventInfo,
): Promise<void> => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const eventRef = doc(eventsCollection, event.id);
  const eventDoc = await getDoc(eventRef);
  const oldEvent = eventDoc.data();
  if (!oldEvent) throw Error(`event ${event.id}: ${event.title} data not found`);
  return updateDoc(eventRef, {
    attendees: oldEvent.attendees?.filter((a) => a.id !== currentUser.uid),
    attendeeIds: arrayRemove(currentUser.uid),
  });
};

export const toggleCancelEventInFirestore = async (event: EventInfo): Promise<void> =>
  updateDoc(doc(eventsCollection, event.id), {
    isCancelled: !event.isCancelled,
  });

export const updateEventInFirestore = async (event: EventInfo): Promise<void> =>
  setDoc(doc(eventsCollection, event.id), event);

export const watchChatCommentsFromFirebase = (
  eventId: string,
  observer: FirebaseObserver,
): Unsubscribe => {
  const chatRef = ref(rtdb, `chat/${eventId}`);
  const chatQuery = fbQuery(chatRef, orderByKey());
  return onValue(chatQuery, observer);
};

export const watchEventsForUserFromFirestore = (
  observer: CollectionObserver,
  eventType: UserEventType,
  uid: string,
): Unsubscribe => {
  const criteria: QueryConstraint[] = [limit(2)];
  switch (eventType) {
    case 'hosting': {
      criteria.push(where('hostUid', '==', uid));
      criteria.push(orderBy('date'));
      break;
    }
    case 'past': {
      criteria.push(where('attendeeIds', 'array-contains', uid));
      criteria.push(where('date', '<=', new Date()));
      criteria.push(orderBy('date', 'desc'));
      break;
    }
    default: {
      // attending
      criteria.push(where('attendeeIds', 'array-contains', uid));
      criteria.push(orderBy('date'));
      break;
    }
  }

  const userEventsQuery = query(eventsCollection, ...criteria);
  return onSnapshot(userEventsQuery, observer);
};

export const watchNewsFeedForCurrentUserFromFirebase = (
  observer: FirebaseObserver,
): Unsubscribe => {
  const currentUser = readCurrentUser();
  if (!currentUser) throw new Error('No current user');
  const newsFeedRef = ref(rtdb, `newsfeed/${currentUser.uid}`);
  const newsFeedQuery = fbQuery(newsFeedRef, orderByKey(), limitToLast(5));
  return onValue(newsFeedQuery, observer);
};

export const watchSingleEventFromFirestore = (
  observer: DocumentObserver,
  eventId: string,
): Unsubscribe => onSnapshot(doc(eventsCollection, eventId), observer);
