import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalProps } from 'semantic-ui-react';
import { RootState } from '../../Store/store';

export type ModalsState =
  | {
      modalProps: ModalProps;
      modalType: string;
    }
  | undefined;

const initialState: ModalsState = undefined;

export const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialState as ModalsState, // Need to explicitly type because initial value is undefined
  reducers: {
    closeModal: () => undefined,
    openModal: (_0, action: PayloadAction<ModalsState>) => action.payload,
  },
});

export const { closeModal, openModal } = modalsSlice.actions;
export const modalsSelector = (state: RootState): ModalsState => state.modals;

export default modalsSlice.reducer;
