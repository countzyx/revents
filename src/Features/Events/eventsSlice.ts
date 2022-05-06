import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { arrayToTree } from 'performant-array-to-tree';
import {
  addCurrentUserAsEventAttendeeInFirestore,
  addEventChatCommentAsCurrentUserInFirebase,
  removeCurrentUserAsEventAttendeeInFirestore,
  watchAllEventsFromFirestore,
  watchChatCommentsFromFirebase,
  watchSingleEventFromFirestore,
} from '../../App/Firebase/FirestoreEventService';
import type { Unsubscribe } from '../../App/Firebase/FirestoreEventService';
import { ChatComment, EventInfo, EventSearchCriteria } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';
import { convertCatchToError, getDateTimeStringFromDate } from '../../App/Shared/Utils';

type EventState = {
  chatComments: ChatComment[];
  chatError?: Error;
  events: EventInfo[];
  eventsError?: Error;
  isLoadingChat: boolean;
  isLoadingEvents: boolean;
  isUpdatingAttendees: boolean;
  isUpdatingChat: boolean;
  searchCriteria: EventSearchCriteria;
  updateAttendeesError?: Error;
};

const defaultSearchCriteria: EventSearchCriteria = {
  filter: 'all',
  startDate: getDateTimeStringFromDate(new Date()),
};

const initialState: EventState = {
  chatComments: [],
  chatError: undefined,
  events: [],
  eventsError: undefined,
  isLoadingChat: false,
  isLoadingEvents: true,
  isUpdatingAttendees: false,
  isUpdatingChat: false,
  searchCriteria: { ...defaultSearchCriteria },
  updateAttendeesError: undefined,
};

export const addCurrentUserAsAttendeeToEvent = createAsyncThunk<
  void,
  EventInfo,
  { dispatch: AppDispatch; state: RootState }
>('events/addCurrentUserAsAttendeeToEvent', async (event, thunkApi) => {
  await addCurrentUserAsEventAttendeeInFirestore(event);
});

export const addEventChatCommentAsCurrentUser = createAsyncThunk<
  void,
  { eventId: string; comment: string; parentCommentId?: string },
  { dispatch: AppDispatch; state: RootState }
>('events/addEventChatCommentAsCurrentUser', async (eventChatMessage, thunkApi) => {
  const { eventId, comment, parentCommentId } = eventChatMessage;
  await addEventChatCommentAsCurrentUserInFirebase(eventId, comment, parentCommentId);
});

export const fetchAllEvents = (
  dispatch: AppDispatch,
  searchCriteria: EventSearchCriteria,
): Unsubscribe => {
  const { fetchEventsPending, fetchEventsFulfilled, fetchEventsRejected } = eventsSlice.actions;
  const unsubscribe = watchAllEventsFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchEventsPending());
        const fetchedEvents = snapshot.docs.map((docResult) => docResult.data());
        const events = fetchedEvents.filter((e) => e !== undefined) as EventInfo[];
        dispatch(fetchEventsFulfilled(events));
      },
      error: async (err) => dispatch(fetchEventsRejected(err)),
    },
    searchCriteria,
  );

  return unsubscribe;
};

export const fetchChatCommentsForEvent = (dispatch: AppDispatch, eventId: string): Unsubscribe => {
  const { fetchChatFulfilled, fetchChatPending, fetchChatRejected } = eventsSlice.actions;
  const unsubscribe = watchChatCommentsFromFirebase(eventId, (snapshot) => {
    dispatch(fetchChatPending());
    try {
      const newChatComments: ChatComment[] = [];
      snapshot.forEach((child) => {
        const comment: ChatComment = {
          ...child.val(),
          id: child.key,
          parentId: child.val().parentId,
        } as ChatComment;
        newChatComments.push(comment);
      });
      // Firebase doesn't do descending order, so do it client-side.
      const chatTree = arrayToTree(newChatComments.reverse(), {
        childrenField: 'children',
        dataField: null,
        id: 'id',
        parentId: 'parentId',
      }) as ChatComment[];
      dispatch(fetchChatFulfilled(chatTree));
    } catch (err) {
      dispatch(fetchChatRejected(convertCatchToError(err)));
    }
  });

  return unsubscribe;
};

export const fetchSingleEvent = (dispatch: AppDispatch, eventId: string): Unsubscribe => {
  const { fetchEventsPending, fetchEventsFulfilled, fetchEventsRejected } = eventsSlice.actions;
  const unsubscribe = watchSingleEventFromFirestore(
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
    clearChat: (state) => ({
      ...state,
      chatComments: [],
    }),
    fetchChatFulfilled: (state, action: PayloadAction<ChatComment[]>) => ({
      ...state,
      chatError: undefined,
      chatComments: action.payload,
      isLoadingChat: false,
    }),
    fetchChatPending: (state) => ({
      ...state,
      chatError: undefined,
      isLoadingChat: true,
    }),
    fetchChatRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      chatError: action.payload,
      isLoadingChat: false,
    }),
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
    setSearchCriteria: (state, action: PayloadAction<EventSearchCriteria>) => ({
      ...state,
      searchCriteria: action.payload,
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
      .addCase(addEventChatCommentAsCurrentUser.pending, (state) => ({
        ...state,
        isUpdatingChat: true,
        chatError: undefined,
      }))
      .addCase(addEventChatCommentAsCurrentUser.rejected, (state, action) => ({
        ...state,
        isUpdatingChat: false,
        chatError: action.error as Error,
      }))
      .addCase(addEventChatCommentAsCurrentUser.fulfilled, (state) => ({
        ...state,
        isUpdatingChat: false,
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
export const { clearChat, setSearchCriteria } = eventsSlice.actions;
export const selectEvents = (state: RootState): EventInfo[] => state.events.events;
export const selectEventsChatComments = (state: RootState): ChatComment[] =>
  state.events.chatComments;
export const selectEventsChatError = (state: RootState): Error | undefined =>
  state.events.chatError;
export const selectEventsError = (state: RootState): Error | undefined => state.events.eventsError;
export const selectEventsIsLoading = (state: RootState): boolean => state.events.isLoadingEvents;
export const selectEventsIsUpdatingAttendees = (state: RootState): boolean =>
  state.events.isUpdatingAttendees;
export const selectEventsIsUpdatingChat = (state: RootState): boolean =>
  state.events.isUpdatingChat;
export const selectEventsSearchCriteria = (state: RootState): EventSearchCriteria =>
  state.events.searchCriteria;
export const seletcEventsUpdateAttendeesError = (state: RootState): Error | undefined =>
  state.events.updateAttendeesError;

export default eventsSlice.reducer;
