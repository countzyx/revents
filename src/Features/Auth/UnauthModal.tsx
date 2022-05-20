import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { closeModal, openModal } from 'src/App/Components/Modals/modalsSlice';
import ModalWrapper from 'src/App/Components/Modals/ModalWrapper';
import { useAppDispatch } from 'src/App/Store/hooks';

const UnauthModal: React.FC = () => {
  const dispatch = useAppDispatch();

  const onLoginClick = () => {
    dispatch(closeModal);
    dispatch(openModal({ modalType: 'LoginForm' }));
  };

  const onRegisterClick = () => {
    dispatch(closeModal);
    dispatch(openModal({ modalType: 'RegisterForm' }));
  };

  return (
    <ModalWrapper header='You need to be signed in to do that' size='mini'>
      <p>Please either login or register to see this content</p>
      <Button.Group widths={4}>
        <Button color='teal' content='Login' fluid onClick={onLoginClick} />
        <Button.Or />
        <Button color='green' content='Register' fluid onClick={onRegisterClick} />
      </Button.Group>
    </ModalWrapper>
  );
};
export default UnauthModal;
