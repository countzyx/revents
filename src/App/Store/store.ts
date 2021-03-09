import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from '../../Features/Events/eventsSlice';
import sandboxReducer from '../../Features/Sandbox/sandboxSlice';

const store = configureStore({
  reducer: {
    events: eventsReducer,
    sandbox: sandboxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
