import * as React from 'react';
import { Container } from 'semantic-ui-react';
import EventDashboard from '../../Features/Events/Dashboard/EventDashboard';
import NavBar from '../../Features/Nav/NavBar';

const App: React.FC = () => {
  const [isFormOpenState, setIsFormOpenState] = React.useState(false);

  const onCloseEventFormHandler = React.useCallback(() => {
    setIsFormOpenState(false);
  }, [setIsFormOpenState]);

  const onOpenEventFormHandler = React.useCallback(() => {
    setIsFormOpenState(true);
  }, [setIsFormOpenState]);

  return (
    <>
      <NavBar onOpenEventForm={onOpenEventFormHandler} />
      <Container className='main'>
        <EventDashboard isFormOpen={isFormOpenState} onCloseEventForm={onCloseEventFormHandler} />
      </Container>
    </>
  );
};

export default App;
