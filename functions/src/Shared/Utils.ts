import { format } from 'date-fns';
import type {
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
} from 'firebase-admin/firestore';

const kStandardDateTimeFormat = 'yyyy-MM-dd h:mm a';

export const getDateTimeStringFromDate = (date: Date): string =>
  format(date, kStandardDateTimeFormat);

export const WithIdDataConverter = <T extends { id?: string }>(): FirestoreDataConverter<T> => ({
  fromFirestore: (docSnap: DocumentSnapshot): T => {
    const objData = docSnap.data();
    return {
      ...objData,
      id: docSnap.id,
    } as T;
  },
  toFirestore: (data: T) => {
    // Not called by updateDoc
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...returnData } = data;
    return returnData as DocumentData;
  },
});
