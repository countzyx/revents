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

export type PlacesInfo = {
  address: string;
  latLng?: google.maps.LatLngLiteral;
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

export type NewsFeedPostCode = 'joined-event' | 'left-event';

export type NewsFeedPost = {
  code: NewsFeedPostCode;
  // Somebody tell Google not to use Object as the type for admin.database.ServerValues.TIMESTAMP.
  // eslint-disable-next-line @typescript-eslint/ban-types
  date: number | Object;
  displayName: string;
  eventId: string;
  photoURL: string;
  userId: string;
};

export type PhotoData = {
  id?: string;
  photoName: string;
  photoURL: string;
};

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
