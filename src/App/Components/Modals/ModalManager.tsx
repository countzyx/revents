/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import LoginForm from '../../../Features/Auth/LoginForm';
import RegisterForm from '../../../Features/Auth/RegisterForm';
import TestModal from '../../../Features/Sandbox/TestModal';
import { useAppSelector } from '../../Store/hooks';
import { selectModalIsOpen, selectModalProps, selectModalType } from './modalsSlice';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalDictionary = { [key: string]: React.FC<any> };

const modalLookup: ModalDictionary = {
  LoginForm,
  RegisterForm,
  TestModal,
};

const ModalManager: React.FC = () => {
  const isOpen = useAppSelector(selectModalIsOpen);
  const modalProps = useAppSelector(selectModalProps);
  const modalType = useAppSelector(selectModalType);

  if (isOpen && modalType) {
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
