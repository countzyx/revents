import * as _ from 'lodash';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import type {
  DocumentData,
  DocumentSnapshot,
  FirestoreDataConverter,
  WithFieldValue,
} from 'firebase/firestore';
import { kDateFormat } from '../Shared/Constants';
import { EventInfo, UserProfile } from '../Shared/Types';

export const eventConverter: FirestoreDataConverter<EventInfo> = {
  fromFirestore: (docSnap: DocumentSnapshot): EventInfo => {
    const docData = docSnap.data();

    const returnData = docData && convertTimestampsToDateStrings(docData);

    if (returnData && !Object.prototype.hasOwnProperty.call(returnData, 'isCancelled')) {
      returnData.isCancelled = false;
    }

    return {
      ...returnData,
      id: docSnap.id,
    } as EventInfo;
  },
  toFirestore: (data: WithFieldValue<EventInfo>) => {
    const { id, ...cleanData } = data;
    return cleanData as DocumentData;
  },
};

export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  fromFirestore: (docSnap: DocumentSnapshot): UserProfile => {
    const docData = docSnap.data();

    const returnData = docData && convertTimestampsToDateStrings(docData);

    return {
      ...returnData,
      id: docSnap.id,
    } as UserProfile;
  },
  toFirestore: (data: WithFieldValue<UserProfile>) => {
    const { id, ...returnData } = data;
    return returnData as DocumentData;
  },
};

const convertTimestampsToDateStrings = (data: DocumentData): DocumentData => {
  const returnData: DocumentData = _.cloneDeep(data); // didn't know how to make an empty version

  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      if (data[prop] instanceof Timestamp) {
        returnData[prop] = format(data[prop].toDate(), kDateFormat);
      }
    }
  }

  return returnData;
};
