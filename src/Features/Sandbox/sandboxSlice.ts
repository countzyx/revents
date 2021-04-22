import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlacesInfo } from '../../App/Shared/Types';
import { RootState } from '../../App/Store/store';

type SandboxState = {
  data: number;
  place: PlacesInfo;
};

const initialState: SandboxState = {
  data: 42,
  place: { address: '', latLng: undefined },
};

export const sandboxSlice = createSlice({
  name: 'sandbox',
  initialState,
  reducers: {
    decrement: (state, action: PayloadAction<number>) => ({
      ...state,
      data: state.data - action.payload,
    }),
    increment: (state, action: PayloadAction<number>) => ({
      ...state,
      data: state.data + action.payload,
    }),
    setAddress: (state, action: PayloadAction<string>) => ({
      ...state,
      place: { address: action.payload, latLng: undefined },
    }),
    setPlace: (state, action: PayloadAction<PlacesInfo>) => ({
      ...state,
      place: action.payload,
    }),
  },
});

export const { decrement, increment, setAddress, setPlace } = sandboxSlice.actions;
export const selectSandboxData = (state: RootState): number => state.sandbox.data;

export default sandboxSlice.reducer;
