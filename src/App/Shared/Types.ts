export type {
  ChatComment,
  EventInfo,
  NewsFeedPost,
  NewsFeedPostCode,
  PhotoData,
  PlacesInfo,
  UserBasicInfo,
  UserProfile,
} from '@functions/Types';

export type Category = {
  key: string;
  text: string;
  value: string;
};

export type CriteriaKeys = 'filter' | 'startDate';
export type FilterValues = 'all' | 'isGoing' | 'isHost';
export type FilterEntry = { filter: FilterValues };
export type EventSearchCriteria = FilterEntry & { startDate: string };

export type PhotoPreview = {
  file: File;
  previewURL: string;
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

export type UserRegistrationInfo = UserCredentials & {
  displayName: string;
};
