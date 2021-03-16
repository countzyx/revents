import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalProps } from 'semantic-ui-react';
import { RootState } from '../../Store/store';

export type ModalsState = {
  modalProps: ModalProps;
  modalType: string;
} | null;

const initialState: ModalsState = null;

export const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialState as ModalsState, // Need to explicitly type because initial value is undefined
  reducers: {
    closeModal: () => null,
    openModal: (_0, action: PayloadAction<ModalsState>) => action.payload,
  },
});

export const { closeModal, openModal } = modalsSlice.actions;
export const modalsSelector = (state: RootState): ModalsState => state.modals;

export default modalsSlice.reducer;
