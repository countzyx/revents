import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addCurrentUserAsEventAttendeeInFirestore,
  readAllEventsFromFirestore,
  readSingleEventFromFirestore,
  removeCurrentUserAsEventAttendeeInFirestore,
} from '../../App/Firebase/FirestoreEventService';
import type { Unsubscribe } from '../../App/Firebase/FirestoreEventService';
import type { EventInfo } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type EventState = {
  events: EventInfo[];
  eventsError?: Error;
  isLoadingEvents: boolean;
  isUpdatingAttendees: boolean;
  updateAttendeesError?: Error;
};

const initialState: EventState = {
  events: [],
  eventsError: undefined,
  isLoadingEvents: true,
  isUpdatingAttendees: false,
  updateAttendeesError: undefined,
};

export const addCurrentUserAsAttendeeToEvent = createAsyncThunk<
  void,
  EventInfo,
  { dispatch: AppDispatch; state: RootState }
>('events/addCurrentUserAsAttendeeToEvent', async (event, thunkApi) => {
  await addCurrentUserAsEventAttendeeInFirestore(event);
});

export const fetchSingleEvent = (dispatch: AppDispatch, eventId: string): Unsubscribe => {
  const { fetchEventsPending, fetchEventsFulfilled, fetchEventsRejected } = eventsSlice.actions;
  const unsubscribe = readSingleEventFromFirestore(
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

export const fetchAllEvents = (dispatch: AppDispatch): Unsubscribe => {
  const { fetchEventsPending, fetchEventsFulfilled, fetchEventsRejected } = eventsSlice.actions;
  const unsubscribe = readAllEventsFromFirestore({
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

export const removeCurrentUserAsAttendeeFromEvent = createAsyncThunk<
  void,
  EventInfo,
  { dispatch: AppDispatch; state: RootState }
>('events/removeCurrentUserAsAttendeeToEvent', async (event, thunkApi) => {
  await removeCurrentUserAsEventAttendeeInFirestore(event);
});

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    fetchEventsFulfilled: (state, action: PayloadAction<EventInfo[]>) => ({
      ...state,
      eventsError: undefined,
      events: action.payload,
      isLoadingEvents: false,
    }),
    fetchEventsPending: (state) => ({
      ...state,
      eventsError: undefined,
      isLoadingEvents: true,
    }),
    fetchEventsRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      eventsError: action.payload,
      isLoadingEvents: false,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCurrentUserAsAttendeeToEvent.pending, (state) => ({
        ...state,
        isUpdatingAttendees: true,
        updateAttendeesError: undefined,
      }))
      .addCase(addCurrentUserAsAttendeeToEvent.rejected, (state, action) => ({
        ...state,
        isUpdatingAttendees: false,
        updateAttendeesError: action.error as Error,
      }))
      .addCase(addCurrentUserAsAttendeeToEvent.fulfilled, (state) => ({
        ...state,
        isUpdatingAttendees: false,
      }))
      .addCase(removeCurrentUserAsAttendeeFromEvent.pending, (state) => ({
        ...state,
        isUpdatingAttendees: true,
        updateAttendeesError: undefined,
      }))
      .addCase(removeCurrentUserAsAttendeeFromEvent.rejected, (state, action) => ({
        ...state,
        isUpdatingAttendees: false,
        updateAttendeesError: action.error as Error,
      }))
      .addCase(removeCurrentUserAsAttendeeFromEvent.fulfilled, (state) => ({
        ...state,
        isUpdatingAttendees: false,
      }));
  },
});

// export const {} = eventsSlice.actions;
export const selectEvents = (state: RootState): EventInfo[] => state.events.events;
export const selectEventsError = (state: RootState): Error | undefined => state.events.eventsError;
export const selectEventsIsLoading = (state: RootState): boolean => state.events.isLoadingEvents;
export const selectEventsIsUpdatingAttendees = (state: RootState): boolean =>
  state.events.isUpdatingAttendees;
export const seletcEventsUpdateAttendeesError = (state: RootState): Error | undefined =>
  state.events.updateAttendeesError;

export default eventsSlice.reducer;
