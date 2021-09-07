import { format } from 'date-fns';
import { kDateFormat } from '../Shared/Constants';
import { EventInfo } from '../Shared/Types';
import firebase from './firebase';

const db = firebase.firestore();
const eventsCollection = db.collection('events');

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

export const addEventToFirestore = (
  event: EventInfo,
): Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> =>
  eventsCollection.add({
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
    isCancelled: false,
  });

export const deleteEventInFirestore = (eventId: string): Promise<void> =>
  eventsCollection.doc(eventId).delete();

export const docToEventInfo = (doc: firebase.firestore.DocumentSnapshot): EventInfo | undefined => {
  if (!doc.exists) return undefined;
  const data = doc.data();
  console.log(data);

  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      console.log(prop);
      if (data[prop] instanceof firebase.firestore.Timestamp) {
        data[prop] = format(data[prop].toDate(), kDateFormat);
      }
    }
  }

  if (data && !Object.prototype.hasOwnProperty.call(data, 'isCancelled')) {
    data.isCancelled = false;
  }

  return {
    ...data,
    id: doc.id,
  } as EventInfo;
};

export const getAllEventsFromFirestore = (observer: CollectionObserver): (() => void) =>
  eventsCollection.orderBy('date').onSnapshot(observer);

export const getSingleEventFromFirestore = (
  observer: DocumentObserver,
  eventId: string,
): (() => void) => eventsCollection.doc(eventId).onSnapshot(observer);

export const updateEventInFirestore = (event: EventInfo): Promise<void> =>
  eventsCollection.doc(event.id).update(event);
