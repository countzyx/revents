import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  readUserProfilePhotosFromFirestore,
  readUserProfileFromFirestore,
  Unsubscribe,
} from '../../App/Firebase/FirestoreUserProfileService';
import { PhotoData, UserProfile } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type ProfileState = {
  currentProfile?: UserProfile;
  error?: Error;
  isLoading: boolean;
  photos: PhotoData[];
  selectedProfile?: UserProfile;
};

const initialState: ProfileState = {
  currentProfile: undefined,
  error: undefined,
  isLoading: false,
  photos: [],
  selectedProfile: undefined,
};

export const fetchCurrentUserProfile = (dispatch: AppDispatch, userId: string): Unsubscribe => {
  const {
    fetchCurrentUserProfilePending,
    fetchCurrentUserProfileFulfilled,
    fetchCurrentUserProfileRejected,
  } = profilesSlice.actions;
  const unsubscribe = readUserProfileFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchCurrentUserProfilePending());
        const fetchedUserProfile = snapshot.data() as UserProfile;
        dispatch(fetchCurrentUserProfileFulfilled(fetchedUserProfile));
      },
      error: async (err) => dispatch(fetchCurrentUserProfileRejected(err)),
    },
    userId,
  );

  return unsubscribe;
};

export const fetchSelectedUserProfile = (dispatch: AppDispatch, userId: string): Unsubscribe => {
  const {
    fetchSelectedUserProfilePending,
    fetchSelectedUserProfileFulfilled,
    fetchSelectedUserProfileRejected,
  } = profilesSlice.actions;
  const unsubscribe = readUserProfileFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchSelectedUserProfilePending());
        const fetchedUserProfile = snapshot.data() as UserProfile;
        dispatch(fetchSelectedUserProfileFulfilled(fetchedUserProfile));
      },
      error: async (err) => dispatch(fetchSelectedUserProfileRejected(err)),
    },
    userId,
  );

  return unsubscribe;
};

export const readUserProfilePhotos = createAsyncThunk<PhotoData[], string>(
  'profile/readUserProfilePhotos',
  async (userId, _0) => {
    const snapshot = await readUserProfilePhotosFromFirestore(userId);
    const photos = snapshot.docs.map((d) => d.data());
    return photos;
  },
);

export const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    clearError: (state) => ({
      ...state,
      error: undefined,
    }),
    fetchCurrentUserProfilePending: (state) => ({
      ...state,
      currentProfile: undefined,
      error: undefined,
      isLoading: true,
    }),
    fetchCurrentUserProfileFulfilled: (state, action: PayloadAction<UserProfile>) => ({
      ...state,
      currentProfile: action.payload,
      error: undefined,
      isLoading: false,
    }),
    fetchCurrentUserProfileRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      currentProfile: undefined,
      error: action.payload,
      isLoading: false,
    }),
    fetchSelectedUserProfilePending: (state) => ({
      ...state,
      selectedProfile: undefined,
      error: undefined,
      isLoading: true,
    }),
    fetchSelectedUserProfileFulfilled: (state, action: PayloadAction<UserProfile>) => ({
      ...state,
      selectedProfile: action.payload,
      error: undefined,
      isLoading: false,
    }),
    fetchSelectedUserProfileRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      selectedProfile: undefined,
      error: action.payload,
      isLoading: false,
    }),
    setError: (state, action: PayloadAction<Error>) => ({
      ...state,
      error: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(readUserProfilePhotos.pending, (state) => ({
        ...state,
        photos: [],
      }))
      .addCase(readUserProfilePhotos.fulfilled, (state, action) => ({
        ...state,
        photos: action.payload,
      }))
      .addCase(readUserProfilePhotos.rejected, (state, action) => ({
        ...state,
        photos: [],
        error: action.error as Error,
      }));
  },
});

export const { clearError } = profilesSlice.actions;
export const selectProfileCurrentProfile = (state: RootState): UserProfile | undefined =>
  state.profiles.currentProfile;
export const selectProfileError = (state: RootState): Error | undefined => state.profiles.error;
export const selectProfileIsLoading = (state: RootState): boolean => state.profiles.isLoading;
export const selectProfilePhotos = (state: RootState): PhotoData[] => state.profiles.photos;
export const selectProfileSelectedProfile = (state: RootState): UserProfile | undefined =>
  state.profiles.selectedProfile;

export default profilesSlice.reducer;
