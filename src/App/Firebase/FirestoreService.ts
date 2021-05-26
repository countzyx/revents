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

export const getAllEventsFromFirestore = (observer: CollectionObserver): (() => void) =>
  db.collection(kEvents).onSnapshot(observer);

export const getSingleEventFromFirestore = (
  observer: DocumentObserver,
  eventId: string,
): (() => void) => db.collection(kEvents).doc(eventId).onSnapshot(observer);
