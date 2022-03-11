import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card, Grid, Header, Image, Tab, TabProps } from 'semantic-ui-react';
import { UserEventType } from '../../../App/Shared/Types';
import { getShortDateAndTimeFromString } from '../../../App/Shared/Utils';
import { useAppDispatch, useAppSelector } from '../../../App/Store/hooks';
import {
  fetchUserEvents,
  selectProfileEvents,
  selectProfileIsLoadingEvents,
  selectProfileSelectedProfile,
} from '../profilesSlice';

type EventPane = {
  menuItem: string;
  pane: { key: UserEventType };
};

const EventTypes: UserEventType[] = ['attending', 'past', 'hosting'];

const EventsTab: React.FC = () => {
  const isLoadingEvents = useAppSelector(selectProfileIsLoadingEvents);
  const profileEvents = useAppSelector(selectProfileEvents);
  const selectedProfile = useAppSelector(selectProfileSelectedProfile);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = React.useState<UserEventType>('attending');

  React.useEffect(() => {
    if (!selectedProfile) return undefined;

    const unsubscribe = fetchUserEvents(dispatch, activeTab, selectedProfile.id);
    return unsubscribe;
  }, [dispatch, activeTab, selectedProfile]);

  const onTabChange = (_0: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps) => {
    const activeIndex = Number(data.activeIndex);
    setActiveTab(EventTypes[activeIndex]);
  };

  const panes: EventPane[] = [
    { menuItem: 'Attending', pane: { key: 'attending' } },
    { menuItem: 'Past Events', pane: { key: 'past' } },
    { menuItem: 'Hosting', pane: { key: 'hosting' } },
  ];

  return (
    <Tab.Pane loading={isLoadingEvents}>
      <Grid>
        <Grid.Column width={16}>
          <Header content='Events' floated='left' icon='user' />
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab menu={{ secondary: true, pointing: true }} onTabChange={onTabChange} panes={panes} />
          <Card.Group itemsPerRow={5} style={{ marginTop: 10 }}>
            {profileEvents?.map((event) => {
              const { shortDate, time } = getShortDateAndTimeFromString(event.date) || {
                shortDate: '',
                time: '',
              };
              return (
                <Card as={Link} to={`/events/${event.id}`} key={event.id}>
                  <Image
                    src={`/assets/categoryImages/${event.category}.jpg`}
                    style={{ minHeight: 100, objectFit: 'cover' }}
                  />
                  <Card.Content>
                    <Card.Header content={event.title} textAlign='center' />
                    <Card.Meta textAlign='center'>
                      <div>{shortDate}</div>
                      <div>{time}</div>
                    </Card.Meta>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default EventsTab;
