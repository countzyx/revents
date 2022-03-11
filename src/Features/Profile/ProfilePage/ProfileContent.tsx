import * as React from 'react';
import { Tab } from 'semantic-ui-react';
import AboutTab from './AboutTab';
import EventsTab from './EventsTab';
import PhotosTab from './PhotosTab';

const ProfileContent: React.FC = () => {
  const tabPanes = [
    { menuItem: 'About', render: () => <AboutTab /> },
    { menuItem: 'Photos', render: () => <PhotosTab /> },
    { menuItem: 'Events', render: () => <EventsTab /> },
    { menuItem: 'Followers', render: () => <Tab.Pane>Followers</Tab.Pane> },
    { menuItem: 'Following', render: () => <Tab.Pane>Following</Tab.Pane> },
  ];
  return <Tab menu={{ fluid: true, vertical: true }} menuPosition='right' panes={tabPanes} />;
};

export default ProfileContent;
