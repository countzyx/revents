import { createStore, Store } from '@reduxjs/toolkit';
import testReducer from '../../Features/Sandbox/testReducer';
import type { TestState } from '../../Features/Sandbox/testReducer';

const configureStore = (): Store<TestState> => {
  return createStore(testReducer);
};

export default configureStore;
