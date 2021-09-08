import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllEventsFromFirestore,
  getSingleEventFromFirestore,
} from '../../App/Firebase/FirestoreService';

import type { AsyncState, EventInfo } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type EventState = {
  events: EventInfo[];
} & AsyncState;

const initialState: EventState = {
  error: undefined,
  events: [],
  isLoading: true,
};

export const fetchSingleEvent = (dispatch: AppDispatch, eventId: string): (() => void) => {
  const { fetchEventsPending, fetchEventsFulfilled, fetchEventsRejected } = eventsSlice.actions;
  const unsubscribe = getSingleEventFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchEventsPending());
        const fetchedEvent = snapshot.data() as EventInfo;
        dispatch(fetchEventsFulfilled([fetchedEvent]));
      },
      error: async (err) => dispatch(fetchEventsRejected(err)),
    },
    eventId,
  );

  return unsubscribe;
};

export const fetchAllEvents = (dispatch: AppDispatch): (() => void) => {
  const { fetchEventsPending, fetchEventsFulfilled, fetchEventsRejected } = eventsSlice.actions;
  const unsubscribe = getAllEventsFromFirestore({
    next: async (snapshot) => {
      dispatch(fetchEventsPending());
      const fetchedEvents = snapshot.docs.map((docResult) => docResult.data());
      const events = fetchedEvents.filter((e) => e !== undefined) as EventInfo[];
      dispatch(fetchEventsFulfilled(events));
    },
    error: async (err) => dispatch(fetchEventsRejected(err)),
  });

  return unsubscribe;
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
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
  },
});

// export const {} = eventsSlice.actions;
export const selectEvents = (state: RootState): EventInfo[] => state.events.events;
export const selectEventsError = (state: RootState): Error | undefined => state.events.error;
export const selectEventsIsLoading = (state: RootState): boolean => state.events.isLoading;

export default eventsSlice.reducer;
