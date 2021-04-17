export type Category = {
  key: string;
  text: string;
  value: string;
};

export type EventAttendee = {
  id: string;
  name: string;
  photoUrl: string;
};

export type EventInfo = {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  city: PlacesInfo;
  venue: PlacesInfo;
  hostedBy: string;
  hostPhotoUrl: string;
  attendees?: EventAttendee[];
};

export type PlacesInfo = {
  address: string;
  latLng?: google.maps.LatLngLiteral;
};

export type User = {
  email: string;
  photoUrl: string;
};

export type UserCredentials = {
  email: string;
  password: string;
};
