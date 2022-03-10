import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import type {
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  QuerySnapshot,
  Unsubscribe as FBUnsubscribe,
} from 'firebase/firestore';
import { eventConverter } from './FirestoreUtil';
import { EventInfo } from '../Shared/Types';
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

export const readAllEventsFromFirestore = (observer: CollectionObserver): Unsubscribe =>
  onSnapshot(query(eventsCollection, orderBy('date')), observer);

export const readSingleEventFromFirestore = (
  observer: DocumentObserver,
  eventId: string,
): Unsubscribe => onSnapshot(doc(eventsCollection, eventId), observer);

export const toggleCancelEventInFirestore = async (event: EventInfo): Promise<void> =>
  updateDoc(doc(eventsCollection, event.id), {
    isCancelled: !event.isCancelled,
  });

export const updateEventInFirestore = async (event: EventInfo): Promise<void> =>
  setDoc(doc(eventsCollection, event.id), event);
