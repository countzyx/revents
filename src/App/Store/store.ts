import { configureStore } from '@reduxjs/toolkit';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';
import authReducer from '../../Features/Auth/authSlice';
import eventsReducer from '../../Features/Events/eventsSlice';
import modalsReducer from '../Components/Modals/modalsSlice';
import profilesReducer from '../../Features/Profile/profilesSlice';
import sandboxReducer from '../../Features/Sandbox/sandboxSlice';

const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({
  history: createBrowserHistory(),
  savePreviousLocations: 1,
});

const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(routerMiddleware),
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    modals: modalsReducer,
    profiles: profilesReducer,
    router: routerReducer,
    sandbox: sandboxReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const history = createReduxHistory(store);

export default store;
