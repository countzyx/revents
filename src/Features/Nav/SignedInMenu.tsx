import * as React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Image, Menu } from 'semantic-ui-react';

type Props = {
  onSignOut: () => void;
};

const SignedInMenu: React.FC<Props> = (props: Props) => {
  const { onSignOut } = props;

  return (
    <Menu.Item position='right'>
      <Image avatar spaced='right' src='/assets/user.png' />
      <Dropdown pointing='top left' text='Bobbie'>
        <Dropdown.Menu>
          <Dropdown.Item as={Link} to='/createEvent' text='Create Event' icon='plus' />
          <Dropdown.Item text='My Profile' icon='user' />
          <Dropdown.Item text='Sign out' icon='power' onClick={onSignOut} />
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  );
};

export default SignedInMenu;
