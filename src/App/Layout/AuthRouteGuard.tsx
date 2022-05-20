/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { selectAuthIsAuthed } from 'src/Features/Auth/authSlice';
import { openModal } from '../Components/Modals/modalsSlice';
import { useAppDispatch, useAppSelector } from '../Store/hooks';

const AuthRouteGuard: React.FC = (props) => {
  const { children } = props;
  const isAuthed = useAppSelector(selectAuthIsAuthed);
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    !isAuthed && dispatch(openModal({ modalType: 'UnauthModal' }));
  }, [isAuthed, dispatch]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>; // this fragment is no useless; it's an easy fix for the type
};

export default AuthRouteGuard;
