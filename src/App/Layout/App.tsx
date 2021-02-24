import * as React from 'react';
import { Container } from 'semantic-ui-react';
import EventDashboard from '../../Features/Events/Dashboard/EventDashboard';
import NavBar from '../../Features/Nav/NavBar';
import type { EventInfo } from '../../Shared/Types';

const App: React.FC = () => {
  const [isFormOpenState, setIsFormOpenState] = React.useState(false);
  const [selectedEventState, setSelectedEventState] = React.useState<EventInfo | undefined>(undefined);

  const onCloseEventFormHandler = React.useCallback(() => {
    setIsFormOpenState(false);
  }, [setIsFormOpenState]);

  const onOpenCreateEventFormHandler = React.useCallback(() => {
    setSelectedEventState(undefined);
    setIsFormOpenState(true);
  }, [setIsFormOpenState, setSelectedEventState]);

  const onSelectEvent = React.useCallback(
    (selectedEvent: EventInfo) => {
      setSelectedEventState(selectedEvent);
      setIsFormOpenState(true);
    },
    [setIsFormOpenState, setSelectedEventState],
  );

  return (
    <>
      <NavBar onOpenCreateEventForm={onOpenCreateEventFormHandler} />
      <Container className='main'>
        <EventDashboard
          isFormOpen={isFormOpenState}
          onCloseEventForm={onCloseEventFormHandler}
          onSelectEvent={onSelectEvent}
          selectedEvent={selectedEventState}
        />
      </Container>
    </>
  );
};

export default App;
