import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Store/store';
import type { AsyncState } from '../Shared/Types';

const initialState: AsyncState = {
  isLoading: false,
  error: undefined,
};

export const asyncSlice = createSlice({
  name: 'async',
  initialState,
  reducers: {
    asyncError: (state, action: PayloadAction<Error>) => ({
      ...state,
      isLoading: false,
      error: action.payload,
    }),
    asyncFinish: (state) => ({
      ...state,
      isLoading: false,
    }),
    asyncStart: (state) => ({
      ...state,
      isLoading: true,
      error: undefined,
    }),
  },
});

export const { asyncError, asyncFinish, asyncStart } = asyncSlice.actions;
export const selectAsync = (state: RootState): AsyncState => state.async;

export default asyncSlice.reducer;
