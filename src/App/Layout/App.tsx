import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import EventDashboard from '../../Features/Events/Dashboard/EventDashboard';
import EventDetails from '../../Features/Events/Details/EventDetails';
import EventForm from '../../Features/Events/Form/EventForm';
import HomePage from '../../Features/Home/HomePage';
import NavBar from '../../Features/Nav/NavBar';
import type { EventInfo } from '../Shared/Types';
import SampleData from '../Api/SampleData';
import Sandbox from '../../Features/Sandbox/Sandbox';

type EventState = {
  events: EventInfo[];
};

const initialEventState: EventState = {
  events: SampleData,
};

const App: React.FC = () => {
  const [eventsState, setEventsState] = React.useState(initialEventState);

  const onCreateEvent = React.useCallback(
    (newEvent: EventInfo) => {
      setEventsState((prevState) => {
        return { events: [...prevState.events, newEvent] };
      });
    },
    [setEventsState],
  );

  const onDeleteEvent = React.useCallback(
    (eventId: string) => {
      setEventsState((prevState) => {
        return { events: prevState.events.filter((e) => e.id !== eventId) };
      });
    },
    [setEventsState],
  );

  const onUpdateEvent = React.useCallback(
    (updatedEvent: EventInfo) => {
      setEventsState((prevState) => {
        return { events: prevState.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)) };
      });
    },
    [setEventsState],
  );

  return (
    <>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        <Route path='/(.+)'>
          <NavBar />
          <Container className='main'>
            <Route path='/createEvent'>
              <EventForm onCreateEvent={onCreateEvent} onUpdateEvent={onUpdateEvent} />
            </Route>
            <Route path='/events' exact>
              <EventDashboard events={eventsState.events} onDeleteEvent={onDeleteEvent} />
            </Route>
            <Route path='/events/:id'>
              <EventDetails />
            </Route>
            <Route path='/sandbox'>
              <Sandbox />
            </Route>
          </Container>
        </Route>{' '}
      </Switch>
    </>
  );
};

export default App;
