import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EventInfo } from '../../App/Shared/Types';
import SampleData from '../../App/Api/SampleData';
import { RootState } from '../../App/Store/store';

type EventState = {
  events: EventInfo[];
};

const initialState: EventState = {
  events: SampleData,
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    createEvent: (state, action: PayloadAction<EventInfo>) => {
      return { events: [...state.events, action.payload] };
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      return { events: state.events.filter((e) => e.id !== action.payload) };
    },
    updateEvent: (state, action: PayloadAction<EventInfo>) => {
      const updatedEvent = action.payload;
      return { events: state.events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)) };
    },
  },
});

export const { createEvent, deleteEvent, updateEvent } = eventsSlice.actions;
export const selectEvents = (state: RootState): EventInfo[] => state.events.events;

export default eventsSlice.reducer;
