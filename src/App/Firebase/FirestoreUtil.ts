import * as _ from 'lodash';
import { Timestamp } from 'firebase/firestore';
import type { DocumentData, DocumentSnapshot, FirestoreDataConverter } from 'firebase/firestore';
import { EventInfo, UserProfile } from '../Shared/Types';
import { getDateTimeStringFromDate } from '../Shared/Utils';

const convertTimestampsToDateStrings = (data: DocumentData): DocumentData => {
  const returnData: DocumentData = _.cloneDeep(data); // didn't know how to make an empty version

  for (const prop in data) {
    if (Object.prototype.hasOwnProperty.call(data, prop)) {
      if (data[prop] instanceof Timestamp) {
        returnData[prop] = getDateTimeStringFromDate(data[prop].toDate());
      }
    }
  }

  return returnData;
};

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

export const userProfileConverter: FirestoreDataConverter<UserProfile> = {
  fromFirestore: (docSnap: DocumentSnapshot): UserProfile => {
    const docData = docSnap.data();

    const returnData = docData && convertTimestampsToDateStrings(docData);

    const tempValue = {
      ...returnData,
      id: docSnap.id,
    } as UserProfile;

    const returnValue: UserProfile = {
      ...tempValue,
      followerCount: tempValue.followerCount || 0,
      followingCount: tempValue.followingCount || 0,
    };
    return returnValue;
  },
  toFirestore: (data: UserProfile) => {
    // Not called by updateDoc
    const { id, ...returnData } = data;
    return returnData as DocumentData;
  },
};

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
    const { id, ...returnData } = data;
    return returnData as DocumentData;
  },
});
