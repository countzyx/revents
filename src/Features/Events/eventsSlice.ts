import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetchSampleData from '../../App/Api/MockApi';
import type { AsyncState, EventInfo } from '../../App/Shared/Types';
import { RootState } from '../../App/Store/store';

type EventState = {
  events: EventInfo[];
} & AsyncState;

const initialState: EventState = {
  error: undefined,
  events: [],
  isLoading: false,
};

export const fetchEvents = createAsyncThunk('events/fetchEvents', async (thunkApi) =>
  fetchSampleData(),
);

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
    updateEvent: (state, action: PayloadAction<EventInfo>) => {
      const updatedEvent = action.payload;
      return {
        ...state,
        events: state.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => ({
        ...state,
        error: undefined,
        events: action.payload,
        isLoading: false,
      }))
      .addCase(fetchEvents.pending, (state) => ({
        ...state,
        error: undefined,
        isLoading: true,
      }))
      .addCase(fetchEvents.rejected, (state, action) => ({
        ...state,
        error: action.error as Error,
        isLoading: false,
      }));
  },
});

export const { createEvent, deleteEvent, updateEvent } = eventsSlice.actions;
export const selectEvents = (state: RootState): EventInfo[] => state.events.events;
export const selectEventsError = (state: RootState): Error | undefined => state.events.error;
export const selectEventsIsLoading = (state: RootState): boolean => state.events.isLoading;

export default eventsSlice.reducer;
