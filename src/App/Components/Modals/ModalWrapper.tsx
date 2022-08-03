import * as React from 'react';
import { Modal, ModalProps } from 'semantic-ui-react';
import { useAppDispatch, useAppSelector } from '../../Store/hooks';
import { closeModal, selectModalIsOpen } from './modalsSlice';

const ModalWrapper: React.FC<ModalProps> = (props: ModalProps) => {
  // children and onClose need to be extracted to map them in with shorthand properly.
  const { children, onClose, ...trimmedProps } = props;
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectModalIsOpen);

  return (
    <Modal
      // The trimmed props are spread esp. for shorthand props to be handled correctly.
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...trimmedProps}
      content={children}
      onClose={
        onClose ||
        (() => {
          dispatch(closeModal());
        })
      }
      open={isOpen}
    />
  );
};

export default ModalWrapper;
