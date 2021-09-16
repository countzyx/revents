/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import LoginForm from '../../../Features/Auth/LoginForm';
import RegisterForm from '../../../Features/Auth/RegisterForm';
import TestModal from '../../../Features/Sandbox/TestModal';
import { useAppSelector } from '../../Store/hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalDictionary = { [key: string]: React.FC<any> };

const ModalManager: React.FC = () => {
  const modalLookup: ModalDictionary = {
    LoginForm,
    RegisterForm,
    TestModal,
  };
  const currentModal = useAppSelector((state) => state.modals);

  if (currentModal) {
    const { modalType, modalProps } = currentModal;
    const ModalComponent = modalLookup[modalType];
    return (
      <span>
        <ModalComponent {...modalProps} />
      </span>
    );
  }

  return <span />;
};

export default ModalManager;
