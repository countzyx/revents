export type EventAttendee = {
  id: string;
  name: string;
  photoUrl: string; // should be URL?
};

export type Category = {
  key: string;
  text: string;
  value: string;
};

export type EventInfo = {
  id: string;
  title: string;
  date: Date | null;
  category: string;
  description: string;
  city: string;
  venue: string;
  hostedBy: string;
  hostPhotoUrl: string; // should be URL?
  attendees?: EventAttendee[];
};
