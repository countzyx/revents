import * as React from 'react';
import { Button } from 'semantic-ui-react';
import ModalWrapper from 'src/App/Components/Modals/ModalWrapper';

const UnauthModal: React.FC = () => (
  <ModalWrapper header='You need to be signed in to do that' size='mini'>
    <p>Please either login or register to see this content</p>
    <Button.Group>
      <Button color='teal' content='Login' fluid />
      <Button.Or />
      <Button color='green' content='Register' fluid />
    </Button.Group>
  </ModalWrapper>
);

export default UnauthModal;
