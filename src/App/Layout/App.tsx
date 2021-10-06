import * as React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Container } from 'semantic-ui-react';
import { selectAuthIsAppLoaded, verifyAuth } from '../../Features/Auth/authSlice';
import MyAccountPage from '../../Features/Auth/MyAccountPage/MyAccountPage';
import ProfilePage from '../../Features/Profile/ProfilePage/ProfilePage';
import EventDashboard from '../../Features/Events/Dashboard/EventDashboard';
import EventDetails from '../../Features/Events/Details/EventDetails';
import EventForm from '../../Features/Events/Form/EventForm';
import HomePage from '../../Features/Home/HomePage';
import NavBar from '../../Features/Nav/NavBar';
import Sandbox from '../../Features/Sandbox/Sandbox';
import Error from '../Components/Error/Error';
import ModalManager from '../Components/Modals/ModalManager';
import { useAppDispatch, useAppSelector } from '../Store/hooks';
import LoadingComponent from './LoadingComponent';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAppLoaded = useAppSelector(selectAuthIsAppLoaded);

  React.useEffect(() => {
    const unsubscribed = verifyAuth(dispatch);
    return unsubscribed;
  }, [dispatch]);

  const location = useLocation();

  if (!isAppLoaded) return <LoadingComponent content='Loading app...' />;

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
            <Route path='/myAccount'>
              <MyAccountPage />
            </Route>
            <Route path='/profile/:id?'>
              <ProfilePage />
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
