import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../App/Store/store';

type SandboxState = {
  data: number;
};

const initialState: SandboxState = {
  data: 42,
};

export const sandboxSlice = createSlice({
  name: 'sandbox',
  initialState,
  reducers: {
    decrement: (state, action: PayloadAction<number>) => {
      return { ...state, data: state.data - action.payload };
    },
    increment: (state, action: PayloadAction<number>) => {
      return { ...state, data: state.data + action.payload };
    },
  },
});

export const { decrement, increment } = sandboxSlice.actions;
export const selectSandboxData = (state: RootState): number => state.sandbox.data;

export default sandboxSlice.reducer;
