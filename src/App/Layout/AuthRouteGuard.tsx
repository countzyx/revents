/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { selectAuthIsAuthed } from 'src/Features/Auth/authSlice';
import { openModal } from '../Components/Modals/modalsSlice';
import { useAppDispatch, useAppSelector } from '../Store/hooks';

type Props = {
  children?: React.ReactNode;
};

const AuthRouteGuard: React.FC<Props> = (props) => {
  const { children } = props;
  const isAuthed = useAppSelector(selectAuthIsAuthed);
  const dispatch = useAppDispatch();

  // If the user is not authenticated, launch a modal dialog to challenge when this component loads.
  React.useEffect(() => {
    !isAuthed && dispatch(openModal({ modalType: 'UnauthModalRedirect' }));
  }, [isAuthed, dispatch]);

  return isAuthed ? <>{children}</> : null;
};

AuthRouteGuard.defaultProps = {
  children: undefined,
};

export default AuthRouteGuard;
