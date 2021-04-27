import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../Store/store';

type AsyncState = {
  loading: boolean;
  error?: Error;
};

const initialState: AsyncState = {
  loading: false,
  error: undefined,
};

export const asyncSlice = createSlice({
  name: 'async',
  initialState,
  reducers: {
    asyncError: (state, action: PayloadAction<Error>) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    asyncFinish: (state) => ({
      ...state,
      loading: false,
    }),
    asyncStart: (state) => ({
      ...state,
      loading: true,
      error: undefined,
    }),
  },
});

export const { asyncError, asyncFinish, asyncStart } = asyncSlice.actions;
export const selectAsync = (state: RootState): AsyncState => state.async;

export default asyncSlice.reducer;
