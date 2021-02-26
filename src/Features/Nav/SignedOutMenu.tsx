import * as React from 'react';
import { Button, Menu } from 'semantic-ui-react';

type Props = {
  onSignIn: () => void;
};

const SignedOutMenu: React.FC<Props> = (props: Props) => {
  const { onSignIn } = props;

  return (
    <Menu.Item position='right'>
      <Button basic inverted content='Login' onClick={onSignIn} />
      <Button basic inverted content='Register' style={{ marginLeft: '0.5em' }} />
    </Menu.Item>
  );
};

export default SignedOutMenu;
