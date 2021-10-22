import {
  addDoc,
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
import dateConverter from './FirestoreUtil';
import { EventInfo } from '../Shared/Types';
import { db } from './Firebase';

export type Unsubscribe = FBUnsubscribe;

const eventsCollection = collection(db, 'events').withConverter(dateConverter<EventInfo>());

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

export const createEventInFirestore = async (
  event: EventInfo,
): Promise<DocumentReference<EventInfo>> =>
  addDoc(eventsCollection, {
    ...event,
    hostedBy: 'Bobbie',
    hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    attendees: [
      {
        id: 'a',
        name: 'Bobbie',
        photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        id: 'b',
        name: 'Tony',
        photoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
      },
    ],
    isCancelled: false,
  });

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
