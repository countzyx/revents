export type Category = {
  key: string;
  text: string;
  value: string;
};

export type ChatComment = {
  children?: ChatComment[];
  datetime: string;
  id?: string;
  name: string;
  parentId?: string;
  photoURL: string;
  text: string;
  uid: string;
};

export type UserBasicInfo = {
  id: string;
  displayName: string;
  photoURL: string;
};

export type EventInfo = {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  city: PlacesInfo;
  venue: PlacesInfo;
  hostUid: string;
  hostedBy: string;
  hostPhotoURL: string;
  attendees?: UserBasicInfo[];
  attendeeIds: string[];
  isCancelled: boolean;
};

export type CriteriaKeys = 'filter' | 'startDate';
export type FilterValues = 'all' | 'isGoing' | 'isHost';
export type FilterEntry = { filter: FilterValues };
export type EventSearchCriteria = FilterEntry & { startDate: string };

export type PhotoData = {
  id?: string;
  photoName: string;
  photoURL: string;
};

export type PhotoPreview = {
  file: File;
  previewURL: string;
};

export type PlacesInfo = {
  address: string;
  latLng?: google.maps.LatLngLiteral;
};

export type ShortDateAndTime = {
  shortDate: string | '';
  time: string | '';
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserEventType = 'attending' | 'past' | 'hosting';

export type UserProfile = {
  createdAt: string;
  description?: string;
  displayName?: string;
  email: string;
  followerCount: number;
  followingCount: number;
  id: string;
  photoURL?: string;
};

export type UserRegistrationInfo = UserCredentials & {
  displayName: string;
};
