import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlacesInfo } from '../../App/Shared/Types';
import { delay } from '../../App/Shared/Utils';
import { RootState } from '../../App/Store/store';

type SandboxState = {
  data: number;
  isLoadingSandbox: boolean;
  place: PlacesInfo;
  sandboxError?: Error;
};

const initialState: SandboxState = {
  data: 42,
  isLoadingSandbox: false,
  place: { address: '', latLng: undefined },
  sandboxError: undefined,
};

export const decrement = createAsyncThunk('sandbox/decrement', async (amount: number, thunkApi) => {
  await delay(1000);
  return amount;
});

export const increment = createAsyncThunk('sandbox/increment', async (amount: number, thunkApi) => {
  await delay(1000);
  return amount;
});

export const sandboxSlice = createSlice({
  name: 'sandbox',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => ({
      ...state,
      place: { address: action.payload, latLng: undefined },
    }),
    setPlace: (state, action: PayloadAction<PlacesInfo>) => ({
      ...state,
      place: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(decrement.fulfilled, (state, action) => ({
        ...state,
        data: state.data - action.payload,
        isLoadingSandbox: false,
        sandboxError: undefined,
      }))
      .addCase(decrement.pending, (state) => ({
        ...state,
        isLoadingSandbox: true,
        sandboxError: undefined,
      }))
      .addCase(decrement.rejected, (state, action) => ({
        ...state,
        isLoadingSandbox: false,
        sandboxError: action.error as Error,
      }))
      .addCase(increment.fulfilled, (state, action) => ({
        ...state,
        data: state.data + action.payload,
        isLoadingSandbox: false,
        sandboxError: undefined,
      }))
      .addCase(increment.pending, (state) => ({
        ...state,
        isLoadingSandbox: true,
        sandboxError: undefined,
      }))
      .addCase(increment.rejected, (state, action) => ({
        ...state,
        isLoadingSandbox: false,
        sandboxError: action.error as Error,
      }));
  },
});

export const { setAddress, setPlace } = sandboxSlice.actions;
export const selectSandboxData = (state: RootState): number => state.sandbox.data;
export const selectSandboxError = (state: RootState): Error | undefined =>
  state.sandbox.sandboxError;
export const selectSandboxIsLoading = (state: RootState): boolean => state.sandbox.isLoadingSandbox;
export const selectSandboxPlace = (state: RootState): PlacesInfo => state.sandbox.place;

export default sandboxSlice.reducer;
