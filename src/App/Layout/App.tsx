import * as React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import { verifyAuth } from '../../Features/Auth/authSlice';
import EventDashboard from '../../Features/Events/Dashboard/EventDashboard';
import EventDetails from '../../Features/Events/Details/EventDetails';
import EventForm from '../../Features/Events/Form/EventForm';
import HomePage from '../../Features/Home/HomePage';
import NavBar from '../../Features/Nav/NavBar';
import Sandbox from '../../Features/Sandbox/Sandbox';
import Error from '../Components/Error/Error';
import ModalManager from '../Components/Modals/ModalManager';
import { useAppDispatch } from '../Store/hooks';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const unsubscribed = verifyAuth(dispatch);
    return unsubscribed;
  }, [dispatch]);

  const location = useLocation();

  return (
    <>
      <ModalManager />
      <ToastContainer position='bottom-right' />
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        <Route path='/(.+)'>
          <NavBar />
          <Container className='main'>
            <Route path={['/createEvent', '/editEvent/:id']} key={location.key}>
              <EventForm />
            </Route>
            <Route path='/events' exact>
              <EventDashboard />
            </Route>
            <Route path='/events/:id'>
              <EventDetails />
            </Route>
            <Route path='/sandbox'>
              <Sandbox />
            </Route>
            <Route path='/error'>
              <Error />
            </Route>
          </Container>
        </Route>
      </Switch>
    </>
  );
};

export default App;
