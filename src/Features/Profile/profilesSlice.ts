import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  readUserProfileFromFirestore,
  Unsubscribe,
} from '../../App/Firebase/FirestoreUserProfileService';
import { UserProfile } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type ProfileState = {
  currentProfile?: UserProfile;
  error?: Error;
  isLoading: boolean;
};

const initialState: ProfileState = {
  currentProfile: undefined,
  error: undefined,
  isLoading: false,
};

export const fetchUserProfile = (dispatch: AppDispatch, eventId: string): Unsubscribe => {
  const { fetchUserProfilePending, fetchUserProfileFulfilled, fetchUserProfileRejected } =
    profilesSlice.actions;
  const unsubscribe = readUserProfileFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchUserProfilePending());
        const fetchedUserProfile = snapshot.data() as UserProfile;
        dispatch(fetchUserProfileFulfilled(fetchedUserProfile));
      },
      error: async (err) => dispatch(fetchUserProfileRejected(err)),
    },
    eventId,
  );

  return unsubscribe;
};

export const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    clearError: (state) => ({
      ...state,
      error: undefined,
    }),
    fetchUserProfilePending: (state) => ({
      ...state,
      currentProfile: undefined,
      error: undefined,
      isLoading: true,
    }),
    fetchUserProfileFulfilled: (state, action: PayloadAction<UserProfile>) => ({
      ...state,
      currentProfile: action.payload,
      error: undefined,
      isLoading: false,
    }),
    fetchUserProfileRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      currentProfile: undefined,
      error: action.payload,
      isLoading: false,
    }),
    setError: (state, action: PayloadAction<Error>) => ({
      ...state,
      error: action.payload,
    }),
  },
});

export const { clearError } = profilesSlice.actions;
export const selectProfileCurrentProfile = (state: RootState): UserProfile | undefined =>
  state.profiles.currentProfile;
export const selectProfileError = (state: RootState): Error | undefined => state.profiles.error;
export const selectProfileIsLoading = (state: RootState): boolean => state.profiles.isLoading;

export default profilesSlice.reducer;
