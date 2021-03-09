import { configureStore, Store } from '@reduxjs/toolkit';
import testReducer from '../../Features/Sandbox/testReducer';
import type { TestState } from '../../Features/Sandbox/testReducer';

const makeStore = (): Store<TestState> => {
  return configureStore({ reducer: testReducer });
};

export default makeStore;
