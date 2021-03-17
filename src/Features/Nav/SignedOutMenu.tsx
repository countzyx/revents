import * as React from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { openModal } from '../../App/Components/Modals/modalsSlice';
import { useAppDispatch } from '../../App/Store/hooks';

const SignedOutMenu: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Menu.Item position='right'>
      <Button
        basic
        inverted
        content='Login'
        onClick={() => {
          dispatch(openModal({ modalType: 'LoginForm' }));
        }}
      />
      <Button basic inverted content='Register' style={{ marginLeft: '0.5em' }} />
    </Menu.Item>
  );
};

export default SignedOutMenu;
