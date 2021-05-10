import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { docToEventInfo, getEventsFromFirestore } from '../../App/Firebase/FirestoreService';

import type { AsyncState, EventInfo } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type EventState = {
  events: EventInfo[];
} & AsyncState;

const initialState: EventState = {
  error: undefined,
  events: [],
  isLoading: false,
};

export const fetchEvents = (dispatch: AppDispatch): (() => void) => {
  const { fetchEventsPending, fetchEventsFulfilled, fetchEventsRejected } = eventsSlice.actions;
  const unsubscribed = getEventsFromFirestore({
    next: (snapshot) => {
      dispatch(fetchEventsPending());
      const fetchedEvents = snapshot.docs.map((doc) => docToEventInfo(doc));
      const events = fetchedEvents.filter((e) => e !== undefined) as EventInfo[];
      dispatch(fetchEventsFulfilled(events));
    },
    error: (err) => dispatch(fetchEventsRejected(err)),
  });

  return unsubscribed;
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    createEvent: (state, action: PayloadAction<EventInfo>) => ({
      ...state,
      events: [...state.events, action.payload],
    }),
    deleteEvent: (state, action: PayloadAction<string>) => ({
      ...state,
      events: state.events.filter((e) => e.id !== action.payload),
    }),
    fetchEventsFulfilled: (state, action: PayloadAction<EventInfo[]>) => ({
      ...state,
      error: undefined,
      events: action.payload,
      isLoading: false,
    }),
    fetchEventsPending: (state) => ({
      ...state,
      error: undefined,
      isLoading: true,
    }),
    fetchEventsRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      error: action.payload,
      isLoading: false,
    }),
    updateEvent: (state, action: PayloadAction<EventInfo>) => {
      const updatedEvent = action.payload;
      return {
        ...state,
        events: state.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
      };
    },
  },
});

export const { createEvent, deleteEvent, updateEvent } = eventsSlice.actions;
export const selectEvents = (state: RootState): EventInfo[] => state.events.events;
export const selectEventsError = (state: RootState): Error | undefined => state.events.error;
export const selectEventsIsLoading = (state: RootState): boolean => state.events.isLoading;

export default eventsSlice.reducer;
