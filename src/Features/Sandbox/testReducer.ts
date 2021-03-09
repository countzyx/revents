import * as _ from 'lodash';
import { Action } from '@reduxjs/toolkit';

export const DECREMENT_DATA = 'DECREMENT_DATA';
export const INCREMENT_DATA = 'INCREMENT_DATA';
export type TestState = {
  data: number;
};

const initialState: TestState = {
  data: 42,
};

const reducer = (state: TestState = initialState, action: Action): TestState => {
  const newState = _.cloneDeep(state);

  switch (action.type) {
    case DECREMENT_DATA: {
      newState.data -= 1;
      break;
    }
    case INCREMENT_DATA: {
      newState.data += 1;
      break;
    }
    default: {
      return state;
    }
  }

  return newState;
};

export default reducer;
