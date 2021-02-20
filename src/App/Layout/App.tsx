import * as React from 'react';
import { Container } from 'semantic-ui-react';
import EventDashboard from '../../Features/Events/EventDashboard/EventDashboard';
import NavBar from '../../Features/Nav/NavBar';

const App: React.FC = () => {
  return (
    <>
      <NavBar />
      <Container className='main'>
        <EventDashboard />
      </Container>
    </>
  );
};

export default App;
