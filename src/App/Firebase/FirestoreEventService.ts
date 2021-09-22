import { format } from 'date-fns';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import type {
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  QuerySnapshot,
  Unsubscribe as FBUnsubscribe,
} from 'firebase/firestore';
import { kDateFormat } from '../Shared/Constants';
import { EventInfo } from '../Shared/Types';
import { db } from './Firebase';

export type Unsubscribe = FBUnsubscribe;

const eventConverter = {
  fromFirestore: (docSnap: DocumentSnapshot): EventInfo => {
    const data = docSnap.data();

    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        if (data[prop] instanceof Timestamp) {
          data[prop] = format(data[prop].toDate(), kDateFormat);
        }
      }
    }

    if (data && !Object.prototype.hasOwnProperty.call(data, 'isCancelled')) {
      data.isCancelled = false;
    }

    return {
      ...data,
      id: docSnap.id,
    } as EventInfo;
  },
  toFirestore: (event: EventInfo) => event,
};

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

export const addEventToFirestore = async (
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

export const getAllEventsFromFirestore = (observer: CollectionObserver): Unsubscribe =>
  onSnapshot(query(eventsCollection, orderBy('date')), observer);

export const getSingleEventFromFirestore = (
  observer: DocumentObserver,
  eventId: string,
): Unsubscribe => onSnapshot(doc(eventsCollection, eventId), observer);

export const toggleCancelEventInFirestore = async (event: EventInfo): Promise<void> =>
  updateDoc(doc(eventsCollection, event.id), {
    isCancelled: !event.isCancelled,
  });

export const updateEventInFirestore = async (event: EventInfo): Promise<void> =>
  setDoc(doc(eventsCollection, event.id), event);
