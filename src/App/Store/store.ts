import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../Features/Auth/authSlice';
import eventsReducer from '../../Features/Events/eventsSlice';
import modalsReducer from '../Components/Modals/modalsSlice';
import profilesReducer from '../../Features/Profile/profilesSlice';
import sandboxReducer from '../../Features/Sandbox/sandboxSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    modals: modalsReducer,
    profiles: profilesReducer,
    sandbox: sandboxReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
