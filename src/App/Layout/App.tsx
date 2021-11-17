import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { selectAuthIsAppLoaded, verifyAuth } from '../../Features/Auth/authSlice';
import HomePage from '../../Features/Home/HomePage';
import ModalManager from '../Components/Modals/ModalManager';
import { useAppDispatch, useAppSelector } from '../Store/hooks';
import LoadingComponent from './LoadingComponent';
import SubPages from './SubPages';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAppLoaded = useAppSelector(selectAuthIsAppLoaded);

  React.useEffect(() => {
    const unsubscribed = verifyAuth(dispatch);
    return unsubscribed;
  }, [dispatch]);

  if (!isAppLoaded) return <LoadingComponent content='Loading app...' />;

  return (
    <>
      <ModalManager />
      <ToastContainer position='bottom-right' />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/*' element={<SubPages />} />
      </Routes>
    </>
  );
};

export default App;
