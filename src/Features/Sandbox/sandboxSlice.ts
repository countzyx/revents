import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlacesInfo } from '../../App/Shared/Types';
import { delay } from '../../App/Shared/Utils';
import { RootState } from '../../App/Store/store';
import type { AsyncState } from '../../App/Shared/Types';

type SandboxState = {
  data: number;
  place: PlacesInfo;
} & AsyncState;

const initialState: SandboxState = {
  data: 42,
  error: undefined,
  isLoading: false,
  place: { address: '', latLng: undefined },
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
        error: undefined,
        isLoading: false,
      }))
      .addCase(decrement.pending, (state) => ({
        ...state,
        error: undefined,
        isLoading: true,
      }))
      .addCase(decrement.rejected, (state, action) => ({
        ...state,
        error: action.error as Error,
      }))
      .addCase(increment.fulfilled, (state, action) => ({
        ...state,
        data: state.data + action.payload,
        error: undefined,
        isLoading: false,
      }))
      .addCase(increment.pending, (state) => ({
        ...state,
        error: undefined,
        isLoading: true,
      }))
      .addCase(increment.rejected, (state, action) => ({
        ...state,
        error: action.error as Error,
        isLoading: false,
      }));
  },
});

export const { setAddress, setPlace } = sandboxSlice.actions;
export const selectSandboxData = (state: RootState): number => state.sandbox.data;
export const selectSandboxError = (state: RootState): Error | undefined => state.sandbox.error;
export const selectSandboxIsLoading = (state: RootState): boolean => state.sandbox.isLoading;
export const selectSandboxPlace = (state: RootState): PlacesInfo => state.sandbox.place;

export default sandboxSlice.reducer;
