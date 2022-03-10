import * as _ from 'lodash';
import { Timestamp } from 'firebase/firestore';
import type { DocumentData, DocumentSnapshot, FirestoreDataConverter } from 'firebase/firestore';
import { EventInfo, PhotoData, UserProfile } from '../Shared/Types';
import { getStringFromDate } from '../Shared/Utils';

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
  toFirestore: (data: EventInfo) => {
    // Not called by updateDoc
    const { id, ...cleanData } = data;
    return cleanData as DocumentData;
  },
};

export const photoDataConverter: FirestoreDataConverter<PhotoData> = {
  fromFirestore: (docSnap: DocumentSnapshot): PhotoData => {
    const photoData = docSnap.data();
    return {
      ...photoData,
      id: docSnap.id,
    } as PhotoData;
  },
  toFirestore: (data: PhotoData) => {
    // Not called by updateDoc
    const { id, ...returnData } = data;
    return returnData as DocumentData;
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
  toFirestore: (data: UserProfile) => {
    // Not called by updateDoc
    const { id, ...returnData } = data;
    return returnData as DocumentData;
  },
};

const convertTimestampsToDateStrings = (data: DocumentData): DocumentData => {
  const returnData: DocumentData = _.cloneDeep(data); // didn't know how to make an empty version

  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      if (data[prop] instanceof Timestamp) {
        returnData[prop] = getStringFromDate(data[prop].toDate());
      }
    }
  }

  return returnData;
};
