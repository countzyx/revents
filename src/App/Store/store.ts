import { configureStore } from '@reduxjs/toolkit';
import asyncReducer from '../Async/asyncSlice';
import authReducer from '../../Features/Auth/authSlice';
import eventsReducer from '../../Features/Events/eventsSlice';
import modalsReducer from '../Components/Modals/modalsSlice';
import sandboxReducer from '../../Features/Sandbox/sandboxSlice';

const store = configureStore({
  reducer: {
    async: asyncReducer,
    auth: authReducer,
    events: eventsReducer,
    modals: modalsReducer,
    sandbox: sandboxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
