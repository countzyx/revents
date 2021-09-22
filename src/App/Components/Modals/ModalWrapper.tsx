import * as React from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { closeModal, selectModalIsOpen } from './modalsSlice';

const ModalWrapper: React.FC<ModalProps> = (props: ModalProps) => {
  const { children, header, onClose, ...trimmedProps } = props;
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectModalIsOpen);

  return (
    <Modal
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...trimmedProps}
      onClose={
        onClose ||
        (() => {
          dispatch(closeModal());
        })
      }
      open={isOpen}
    >
      {header && <Modal.Header>{header}</Modal.Header>}
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
};

export default ModalWrapper;
