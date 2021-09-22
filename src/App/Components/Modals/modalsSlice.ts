import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalProps } from 'semantic-ui-react';
import { RootState } from '../../Store/store';

export type ModalInfo = {
  modalProps?: ModalProps;
  modalType: string;
};

type ModalsState = ModalInfo & {
  isOpen: boolean;
};

const initialState: ModalsState = {
  isOpen: false,
  modalProps: undefined,
  modalType: '',
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    closeModal: (state) => ({ ...state, isOpen: false }),
    openModal: (state, action: PayloadAction<ModalInfo>) => ({
      ...state,
      ...action.payload,
      isOpen: true,
    }),
  },
});

export const { closeModal, openModal } = modalsSlice.actions;
export const selectModalIsOpen = (state: RootState): boolean => state.modals.isOpen;
export const selectModalType = (state: RootState): string | undefined => state.modals.modalType;
export const selectModalProps = (state: RootState): ModalProps | undefined =>
  state.modals.modalProps;

export default modalsSlice.reducer;
