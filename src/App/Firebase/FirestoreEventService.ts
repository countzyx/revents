import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
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
import { eventConverter } from './FirestoreUtil';
import { EventInfo, EventSearchCriteria } from '../Shared/Types';
import { db } from './Firebase';
import { readCurrentUser } from './FirebaseAuthService';

export type Unsubscribe = FBUnsubscribe;

const eventsCollection = collection(db, 'events').withConverter(eventConverter);

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

export const addCurrentUserAsEventAttendeeInFirestore = async (event: EventInfo): Promise<void> => {
  const user = readCurrentUser();
  return updateDoc(doc(eventsCollection, event.id), {
    attendees: arrayUnion({
      id: user.uid,
      name: user.displayName,
      photoUrl: user.photoURL,
    }),
    attendeeIds: arrayUnion(user.uid),
  });
};

export const createEventInFirestore = async (
  event: EventInfo,
): Promise<DocumentReference<EventInfo>> => {
  const user = readCurrentUser();
  const { displayName, photoURL, uid } = user;
  return addDoc(eventsCollection, {
    ...event,
    hostUid: uid,
    hostedBy: displayName || 'anonymous',
    hostPhotoUrl: photoURL || '/assets/user.png',
    attendees: arrayUnion({
      id: uid,
      name: displayName || 'anonymous',
      photoUrl: photoURL || '/assets/user.png',
    }),
    attendeeIds: arrayUnion(uid),
    isCancelled: false,
  });
};

export const deleteEventInFirestore = async (eventId: string): Promise<void> =>
  deleteDoc(doc(eventsCollection, eventId));

export const readAllEventsFromFirestore = (
  observer: CollectionObserver,
  searchCriteria: EventSearchCriteria,
): Unsubscribe => {
  const { uid } = readCurrentUser();
  const criteria = [where('date', '>=', searchCriteria.startDate)];
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

  const allEventsQuery = query(eventsCollection, orderBy('date'), ...criteria);
  return onSnapshot(allEventsQuery, observer);
};

export const readSingleEventFromFirestore = (
  observer: DocumentObserver,
  eventId: string,
): Unsubscribe => onSnapshot(doc(eventsCollection, eventId), observer);

export const removeCurrentUserAsEventAttendeeInFirestore = async (
  event: EventInfo,
): Promise<void> => {
  const user = readCurrentUser();
  const eventRef = doc(eventsCollection, event.id);
  const eventDoc = await getDoc(eventRef);
  const oldEvent = eventDoc.data();
  if (!oldEvent) throw Error(`event ${event.id}: ${event.title} data not found`);
  return updateDoc(eventRef, {
    attendees: oldEvent.attendees?.filter((a) => a.id !== user.uid),
    attendeeIds: arrayRemove(user.uid),
  });
};

export const toggleCancelEventInFirestore = async (event: EventInfo): Promise<void> =>
  updateDoc(doc(eventsCollection, event.id), {
    isCancelled: !event.isCancelled,
  });

export const updateEventInFirestore = async (event: EventInfo): Promise<void> =>
  setDoc(doc(eventsCollection, event.id), event);
