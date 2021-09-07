import { format } from 'date-fns';
import { kDateFormat } from '../Shared/Constants';
import { EventInfo } from '../Shared/Types';
import firebase from './firebase';

const kEvents = 'events';

const db = firebase.firestore();

export type CollectionObserver = {
  next?: (snapshot: firebase.firestore.QuerySnapshot) => void;
  error?: (error: firebase.firestore.FirestoreError) => void;
  complete?: () => void; // Never gets executed by Firestore.
};

export type DocumentObserver = {
  next?: (snapshot: firebase.firestore.DocumentSnapshot) => void;
  error?: (error: firebase.firestore.FirestoreError) => void;
  complete?: () => void; // Never gets executed by Firestore.
};

export const docToEventInfo = (doc: firebase.firestore.DocumentSnapshot): EventInfo | undefined => {
  if (!doc.exists) return undefined;
  const data = doc.data();

  for (const prop in data) {
    // eslint-disable-next-line no-prototype-builtins
    if (data.hasOwnProperty(prop)) {
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = format(data[prop].toDate(), kDateFormat);
      }
    }
  }

  return {
    ...data,
    id: doc.id,
  } as EventInfo;
};

export const addEventToFirestore = (
  event: EventInfo,
): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> =>
  db.collection(kEvents).add({
    ...event,
    hostedBy: 'Bobbie',
    hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    attendees: firebase.firestore.FieldValue.arrayUnion(
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
    ),
  });

export const getAllEventsFromFirestore = (observer: CollectionObserver): (() => void) =>
  db.collection(kEvents).orderBy('date').onSnapshot(observer);

export const getSingleEventFromFirestore = (
  observer: DocumentObserver,
  eventId: string,
): (() => void) => db.collection(kEvents).doc(eventId).onSnapshot(observer);

export const updateEventInFirestore = (event: EventInfo): Promise<void> =>
  db.collection(kEvents).doc(event.id).update(event);
