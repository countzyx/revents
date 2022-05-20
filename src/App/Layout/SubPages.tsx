import * as React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import MyAccountPage from '../../Features/Auth/MyAccountPage/MyAccountPage';
import EventDashboard from '../../Features/Events/Dashboard/EventDashboard';
import EventDetails from '../../Features/Events/Details/EventDetails';
import EventForm from '../../Features/Events/Form/EventForm';
import NavBar from '../../Features/Nav/NavBar';
import ProfilePage from '../../Features/Profile/ProfilePage/ProfilePage';
import Sandbox from '../../Features/Sandbox/Sandbox';
import Error from '../Components/Error/Error';
import AuthRouteGuard from './AuthRouteGuard';

const SubPages: React.FC = () => (
  <>
    <NavBar />
    <Container className='main'>
      <Routes>
        <Route
          path='createEvent'
          element={
            <AuthRouteGuard>
              <EventForm />
            </AuthRouteGuard>
          }
        />
        <Route
          path='editEvent/:eventId'
          element={
            <AuthRouteGuard>
              <EventForm />
            </AuthRouteGuard>
          }
        />
        <Route path='events' element={<EventDashboard />} />
        <Route path='events/:eventId' element={<EventDetails />} />
        <Route path='sandbox' element={<Sandbox />} />
        <Route
          path='myAccount'
          element={
            <AuthRouteGuard>
              <MyAccountPage />
            </AuthRouteGuard>
          }
        />
        <Route
          path='profile'
          element={
            <AuthRouteGuard>
              <ProfilePage />
            </AuthRouteGuard>
          }
        />
        <Route
          path='profile/:userId'
          element={
            <AuthRouteGuard>
              <ProfilePage />
            </AuthRouteGuard>
          }
        />
        <Route path='error' element={<Error />} />
      </Routes>
    </Container>
  </>
);

export default SubPages;
