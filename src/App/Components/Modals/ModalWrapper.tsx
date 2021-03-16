import * as React from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import { useAppDispatch } from '../../Store/hooks';
import { closeModal } from './modalsSlice';

const ModalWrapper: React.FC = (props: ModalProps) => {
  const { children, header, size } = props;
  const dispatch = useAppDispatch();

  return (
    <Modal
      onClose={() => {
        dispatch(closeModal);
      }}
      open
      size={size}
    >
      {header && <Modal.Header>{header}</Modal.Header>}
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
};

export default ModalWrapper;
