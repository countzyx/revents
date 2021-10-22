import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import type {
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
  WithFieldValue,
} from 'firebase/firestore';
import { kDateFormat } from '../Shared/Constants';

export const dateConverter = <T>(): FirestoreDataConverter<T> => ({
  fromFirestore: (docSnap: DocumentSnapshot): T => {
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
    } as unknown as T;
  },
  toFirestore: (data: WithFieldValue<T>) => data as DocumentData,
});

export default dateConverter;
