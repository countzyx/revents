import { createAction, createReducer, PayloadAction } from '@reduxjs/toolkit';

const DECREMENT_DATA = 'DECREMENT_DATA';
const INCREMENT_DATA = 'INCREMENT_DATA';

export const decrementAction = createAction<number>(DECREMENT_DATA);
export const incrementAction = createAction<number>(INCREMENT_DATA);

export type TestState = {
  data: number;
};

const initialState: TestState = {
  data: 42,
};

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(incrementAction, (state, action: PayloadAction<number>) => {
      return { ...state, data: state.data + action.payload };
    })
    .addCase(decrementAction, (state, action: PayloadAction<number>) => {
      return { ...state, data: state.data - action.payload };
    });
});

export default reducer;
