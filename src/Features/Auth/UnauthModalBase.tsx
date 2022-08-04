import * as React from 'react';
import { Button, ModalProps } from 'semantic-ui-react';
import { closeModal, openModal } from 'src/App/Components/Modals/modalsSlice';
import ModalWrapper from 'src/App/Components/Modals/ModalWrapper';
import { useAppDispatch, useAppSelector } from 'src/App/Store/hooks';
import { history } from 'src/App/Store/store';
import selectRouterPreviousLocation from '../Router/routerSlice';

type Props = {
  goBack?: boolean;
  modalProps?: ModalProps;
};

const UnauthModalBase: React.FC<Props> = (props) => {
  const { goBack, modalProps } = props;
  const dispatch = useAppDispatch();
  const prevLocation = useAppSelector(selectRouterPreviousLocation);

  const onClose = React.useCallback(() => {
    if (goBack) {
      if (prevLocation) {
        history.push(prevLocation);
      } else {
        history.push('/events');
      }
    }
    dispatch(closeModal());
  }, [dispatch, goBack, prevLocation]);

  const onLoginClick = () => {
    dispatch(closeModal());
    dispatch(openModal({ modalType: 'LoginForm' }));
  };

  const onRegisterClick = () => {
    dispatch(closeModal());
    dispatch(openModal({ modalType: 'RegisterForm' }));
  };

  return (
    <ModalWrapper
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...modalProps}
      header='You need to be signed in to do that'
      onClose={onClose}
      size='mini'
    >
      <p>Please either login or register to see this content</p>
      <Button.Group widths={4}>
        <Button color='teal' content='Login' fluid onClick={onLoginClick} />
        <Button.Or />
        <Button color='green' content='Register' fluid onClick={onRegisterClick} />
      </Button.Group>
    </ModalWrapper>
  );
};

UnauthModalBase.defaultProps = {
  goBack: true,
  modalProps: undefined,
};

export default UnauthModalBase;
