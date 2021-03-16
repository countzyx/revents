import * as _ from 'lodash';
import type { EventInfo } from '../Shared/Types';

export const SampleData: EventInfo[] = [
  {
    id: _.uniqueId(),
    title: 'Trip to Empire State building',
    date: '2021-07-21 6:30 PM',
    category: 'culture',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: 'NY, USA',
    venue: 'Empire State Building, 5th Avenue, New York, NY, USA',
    hostedBy: 'Bobbie',
    hostPhotoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    attendees: [
      {
        id: 'a',
        name: 'Bobbie',
        photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        id: 'b',
        name: 'Tony',
        photoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
      },
    ],
  },
  {
    id: _.uniqueId(),
    title: 'Trip to Punch and Judy Pub',
    date: '2021-06-18 7:00 PM',
    category: 'drinks',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
    city: 'London, UK',
    venue: 'Punch & Judy, Henrietta Street, London, UK',
    hostedBy: 'Tony',
    hostPhotoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
    attendees: [
      {
        id: 'a',
        name: 'Bobbie',
        photoUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      {
        id: 'b',
        name: 'Tony',
        photoUrl: 'https://randomuser.me/api/portraits/men/40.jpg',
      },
    ],
  },
];

export default SampleData;
