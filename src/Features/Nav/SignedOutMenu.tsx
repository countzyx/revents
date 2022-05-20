import * as React from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { openModal } from 'src/App/Components/Modals/modalsSlice';
import { useAppDispatch } from 'src/App/Store/hooks';

const SignedOutMenu: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Menu.Item position='right'>
      <Button
        basic
        content='Login'
        inverted
        onClick={() => {
          dispatch(openModal({ modalType: 'LoginForm' }));
        }}
      />
      <Button
        basic
        content='Register'
        inverted
        onClick={() => {
          dispatch(openModal({ modalType: 'RegisterForm' }));
        }}
        style={{ marginLeft: '0.5em' }}
      />
    </Menu.Item>
  );
};

export default SignedOutMenu;
