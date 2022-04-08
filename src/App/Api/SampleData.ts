import * as _ from 'lodash';
import type { EventInfo } from '../Shared/Types';

export const SampleData: EventInfo[] = [
  {
    id: _.uniqueId(),
    title: 'Trip to Empire State Building',
    date: '2021-07-21 6:30 PM',
    category: 'culture',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: {
      address: 'New York, NY, USA',
      latLng: {
        lat: 40.71090786786135,
        lng: -74.00663895067672,
      },
    },
    venue: {
      address: 'Empire State Building, West 34th Street, New York, NY, USA',
      latLng: {
        lat: 40.748594910787375,
        lng: -73.98568585932333,
      },
    },
    hostUid: 'bobbie',
    hostedBy: 'Bobbie',
    hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    attendees: [
      {
        id: 'a',
        displayName: 'Bobbie',
        photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        id: 'b',
        displayName: 'Tony',
        photoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
      },
    ],
    attendeeIds: ['a', 'b'],
    isCancelled: false,
  },
  {
    id: _.uniqueId(),
    title: 'Trip to Punch and Judy Pub',
    date: '2021-06-18 7:00 PM',
    category: 'drinks',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: {
      address: 'London, UK',
      latLng: {
        lat: 51.51488646433931,
        lng: -0.1256364611675684,
      },
    },
    venue: {
      address: 'Punch & Judy, Henrietta Street, London, UK',
      latLng: {
        lat: 51.51203367851523,
        lng: -0.12295318602565862,
      },
    },
    hostUid: 'tony',
    hostedBy: 'Tony',
    hostPhotoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
    attendees: [
      {
        id: 'a',
        displayName: 'Bobbie',
        photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        id: 'b',
        displayName: 'Tony',
        photoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
      },
    ],
    attendeeIds: ['a', 'b'],
    isCancelled: false,
  },
];

export default SampleData;
