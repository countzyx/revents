import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { arrayToTree } from 'performant-array-to-tree';
import {
  addCurrentUserAsEventAttendeeInFirestore,
  addEventChatCommentAsCurrentUserInFirebase,
  removeCurrentUserAsEventAttendeeInFirestore,
  readAllEventsFromFirestore,
  watchChatCommentsFromFirebase,
  watchNewsFeedForCurrentUserFromFirebase,
  watchSingleEventFromFirestore,
} from '../../App/Firebase/FirestoreEventService';
import type { Unsubscribe } from '../../App/Firebase/FirestoreEventService';
import { ChatComment, EventInfo, EventSearchCriteria, NewsFeedPost } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';
import { convertCatchToError, getDateTimeStringFromDate } from '../../App/Shared/Utils';

type EventState = {
  areMoreEventsAvailable: boolean;
  chatComments: ChatComment[];
  chatError?: Error;
  detailedEvent?: EventInfo;
  detailedEventError?: Error;
  events: EventInfo[];
  eventsError?: Error;
  isLoadingChat: boolean;
  isLoadingDetailedEvent: boolean;
  isLoadingEvents: boolean;
  isLoadingNewsFeed: boolean;
  isUpdatingAttendees: boolean;
  isUpdatingChat: boolean;
  lastVisibleEvent?: EventInfo;
  newsFeed: NewsFeedPost[];
  newsFeedError?: Error;
  perPageLimit: number;
  searchCriteria: EventSearchCriteria;
  updateAttendeesError?: Error;
};

const defaultSearchCriteria: EventSearchCriteria = {
  filter: 'all',
  startDate: getDateTimeStringFromDate(new Date()),
};

const initialState: EventState = {
  areMoreEventsAvailable: false,
  chatComments: [],
  chatError: undefined,
  detailedEvent: undefined,
  detailedEventError: undefined,
  events: [],
  eventsError: undefined,
  isLoadingChat: false,
  isLoadingDetailedEvent: false,
  isLoadingEvents: true,
  isLoadingNewsFeed: false,
  isUpdatingAttendees: false,
  isUpdatingChat: false,
  lastVisibleEvent: undefined,
  newsFeed: [],
  newsFeedError: undefined,
  perPageLimit: 2,
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

export const fetchSingleEvent = (dispatch: AppDispatch, eventId: string): Unsubscribe => {
  const { fetchEventPending, fetchEventFulfilled, fetchEventRejected } = eventsSlice.actions;
  const unsubscribe = watchSingleEventFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchEventPending());
        const fetchedEvent = snapshot.data() as EventInfo;
        dispatch(fetchEventFulfilled(fetchedEvent));
      },
      error: async (err) => dispatch(fetchEventRejected(err)),
    },
    eventId,
  );

  return unsubscribe;
};

export const getAllEvents = createAsyncThunk<
  EventInfo[],
  void,
  { dispatch: AppDispatch; state: RootState }
>('events/getAllEvents', async (_, thunkApi) => {
  const { lastVisibleEvent, perPageLimit, searchCriteria } = thunkApi.getState().events;
  const snapshot = await readAllEventsFromFirestore(searchCriteria, lastVisibleEvent, perPageLimit);
  const fetchedEvents = snapshot.docs.map((docResult) => docResult.data());
  const events = fetchedEvents.filter((e) => e !== undefined) as EventInfo[];
  thunkApi.dispatch(setLastVisibleEvent(events.length > 0 ? events[events.length - 1] : undefined));
  thunkApi.dispatch(setAreMoreEventsAvailable(events.length >= perPageLimit));
  return events;
});

export const listenToChatCommentsForEvent = (
  dispatch: AppDispatch,
  eventId: string,
): Unsubscribe => {
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

export const fetchNewsFeedForCurrentUser = (dispatch: AppDispatch): Unsubscribe => {
  const { fetchNewsFeedFulfilled, fetchNewsFeedPending, fetchNewsFeedRejected } =
    eventsSlice.actions;
  const unsubscribe = watchNewsFeedForCurrentUserFromFirebase((snapshot) => {
    dispatch(fetchNewsFeedPending());
    try {
      const newPosts: NewsFeedPost[] = [];
      snapshot.forEach((child) => {
        const post: NewsFeedPost = {
          ...child.val(),
          id: child.key,
        } as NewsFeedPost;
        newPosts.push(post);
      });

      dispatch(fetchNewsFeedFulfilled(newPosts.reverse()));
    } catch (err) {
      dispatch(fetchNewsFeedRejected(convertCatchToError(err)));
    }
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
    clearChat: (state) => ({
      ...state,
      chatComments: [],
    }),
    clearEvents: (state) => ({
      ...state,
      areMoreEventsAvailable: true,
      events: [],
      eventsError: undefined,
      lastVisibleEvent: undefined,
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
    fetchEventFulfilled: (state, action: PayloadAction<EventInfo>) => ({
      ...state,
      detailedEventError: undefined,
      detailedEvent: action.payload,
      isLoadingDetailedEvent: false,
    }),
    fetchEventPending: (state) => ({
      ...state,
      detailedEvent: undefined,
      isLoadingDetailedEvent: true,
    }),
    fetchEventRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      detailedEventError: action.payload,
      isLoadingDetailedEvent: false,
    }),
    fetchNewsFeedFulfilled: (state, action: PayloadAction<NewsFeedPost[]>) => ({
      ...state,
      newsFeedError: undefined,
      newsFeed: action.payload,
      isLoadingNewsFeed: false,
    }),
    fetchNewsFeedPending: (state) => ({
      ...state,
      newsFeedError: undefined,
      isLoadingNewsFeed: true,
    }),
    fetchNewsFeedRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      newsFeedError: action.payload,
      isLoadingNewsFeed: false,
    }),
    setAreMoreEventsAvailable: (state, action: PayloadAction<boolean>) => ({
      ...state,
      areMoreEventsAvailable: action.payload,
    }),
    setLastVisibleEvent: (state, action: PayloadAction<EventInfo | undefined>) => ({
      ...state,
      lastVisibleEvent: action.payload,
    }),
    setPerPageLimit: (state, action: PayloadAction<number>) => ({
      ...state,
      perPageLimit: action.payload,
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
      .addCase(getAllEvents.fulfilled, (state, action) => ({
        ...state,
        eventsError: undefined,
        events: [...state.events, ...action.payload],
        isLoadingEvents: false,
      }))
      .addCase(getAllEvents.pending, (state) => ({
        ...state,
        eventsError: undefined,
        isLoadingEvents: true,
      }))
      .addCase(getAllEvents.rejected, (state, action) => ({
        ...state,
        eventsError: action.error as Error,
        isLoadingEvents: false,
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
export const {
  clearChat,
  clearEvents,
  setAreMoreEventsAvailable,
  setLastVisibleEvent,
  setPerPageLimit,
  setSearchCriteria,
} = eventsSlice.actions;
export const selectEvents = (state: RootState) => state.events.events;
export const selectEventsAreMoreAvailable = (state: RootState) =>
  state.events.areMoreEventsAvailable;
export const selectEventsChatComments = (state: RootState) => state.events.chatComments;
export const selectEventsChatError = (state: RootState) => state.events.chatError;
export const selectEventsDetailedEvent = (state: RootState) => state.events.detailedEvent;
export const selectEventsDetailedEventError = (state: RootState) => state.events.detailedEventError;
export const selectEventsError = (state: RootState) => state.events.eventsError;
export const selectEventsIsLoading = (state: RootState) => state.events.isLoadingEvents;
export const selectEventsIsLoadingChat = (state: RootState) => state.events.isLoadingChat;
export const selectEventsIsLoadingDetailedEvent = (state: RootState) =>
  state.events.isLoadingDetailedEvent;
export const selectEventsIsLoadingNewsFeed = (state: RootState) => state.events.isLoadingNewsFeed;
export const selectEventsIsUpdatingAttendees = (state: RootState) =>
  state.events.isUpdatingAttendees;
export const selectEventsIsUpdatingChat = (state: RootState) => state.events.isUpdatingChat;
export const selectEventsLastVisible = (state: RootState) => state.events.lastVisibleEvent;
export const selectEventsNewsFeed = (state: RootState) => state.events.newsFeed;
export const selectEventsNewsFeedError = (state: RootState) => state.events.newsFeedError;
export const selectEventsPerPageLimit = (state: RootState) => state.events.perPageLimit;
export const selectEventsSearchCriteria = (state: RootState) => state.events.searchCriteria;
export const seletcEventsUpdateAttendeesError = (state: RootState) =>
  state.events.updateAttendeesError;

export default eventsSlice.reducer;
