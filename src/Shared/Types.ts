export type EventAttendee = {
  id: string;
  name: string;
  photoUrl: string; // should be URL?
};

export type EventInfo = {
  id: string;
  title: string;
  date: string; // a string for now, needs to be Date maybe?
  category: string;
  description: string;
  city: string;
  venue: string;
  hostedBy: string;
  hostPhotoUrl: string; // should be URL?
  attendees?: EventAttendee[];
};
