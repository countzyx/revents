import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  readUserProfilePhotosFromFirestore,
  readUserProfileFromFirestore,
  Unsubscribe,
} from '../../App/Firebase/FirestoreUserProfileService';
import { PhotoData, UserProfile } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type ProfileState = {
  currentProfile?: UserProfile;
  isLoadingPhotos: boolean;
  isLoadingProfile: boolean;
  photos: PhotoData[];
  photosError?: Error;
  profileError?: Error;
  selectedProfile?: UserProfile;
};

const initialState: ProfileState = {
  currentProfile: undefined,
  isLoadingPhotos: false,
  isLoadingProfile: false,
  photos: [],
  photosError: undefined,
  profileError: undefined,
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

export const fetchUserProfilePhotos = (dispatch: AppDispatch, userId: string): Unsubscribe => {
  const {
    fetchUserProfilePhotosFulfilled,
    fetchUserProfilePhotosPending,
    fetchUserProfilePhotosRejected,
  } = profilesSlice.actions;
  const unsubscribe = readUserProfilePhotosFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchUserProfilePhotosPending());
        const fetchedPhotos = snapshot.docs.map((docResult) => docResult.data());
        const photos = fetchedPhotos.filter((p) => p !== undefined) as PhotoData[];
        dispatch(fetchUserProfilePhotosFulfilled(photos));
      },
      error: async (err) => dispatch(fetchUserProfilePhotosRejected(err)),
    },
    userId,
  );
  return unsubscribe;
};

export const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    clearErrors: (state) => ({
      ...state,
      photosError: undefined,
      profileError: undefined,
    }),
    fetchCurrentUserProfilePending: (state) => ({
      ...state,
      currentProfile: undefined,
      profileError: undefined,
      isLoadingProfile: true,
    }),
    fetchCurrentUserProfileFulfilled: (state, action: PayloadAction<UserProfile>) => ({
      ...state,
      currentProfile: action.payload,
      profileError: undefined,
      isLoadingProfile: false,
    }),
    fetchCurrentUserProfileRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      currentProfile: undefined,
      profileError: action.payload,
      isLoadingProfile: false,
    }),
    fetchSelectedUserProfilePending: (state) => ({
      ...state,
      selectedProfile: undefined,
      profileError: undefined,
      isLoadingProfile: true,
    }),
    fetchSelectedUserProfileFulfilled: (state, action: PayloadAction<UserProfile>) => ({
      ...state,
      selectedProfile: action.payload,
      profileError: undefined,
      isLoadingProfile: false,
    }),
    fetchSelectedUserProfileRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      selectedProfile: undefined,
      profileError: action.payload,
      isLoadingProfile: false,
    }),
    fetchUserProfilePhotosPending: (state) => ({
      ...state,
      photos: [],
      error: undefined,
      isLoading: true,
    }),
    fetchUserProfilePhotosFulfilled: (state, action: PayloadAction<PhotoData[]>) => ({
      ...state,
      photos: action.payload,
      error: undefined,
      isLoading: false,
    }),
    fetchUserProfilePhotosRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      photos: [],
      error: action.payload,
      isLoading: false,
    }),
    setPhotoError: (state, action: PayloadAction<Error>) => ({
      ...state,
      photosError: action.payload,
    }),
    setProfileError: (state, action: PayloadAction<Error>) => ({
      ...state,
      profileError: action.payload,
    }),
  },
});

export const { clearErrors } = profilesSlice.actions;
export const selectProfileCurrentProfile = (state: RootState): UserProfile | undefined =>
  state.profiles.currentProfile;
export const selectProfileError = (state: RootState): Error | undefined =>
  state.profiles.profileError;
export const selectProfileIsLoading = (state: RootState): boolean =>
  state.profiles.isLoadingProfile;
export const selectProfileIsLoadingPhotos = (state: RootState): boolean =>
  state.profiles.isLoadingPhotos;
export const selectProfilePhotos = (state: RootState): PhotoData[] => state.profiles.photos;
export const selectProfilePhotosError = (state: RootState): Error | undefined =>
  state.profiles.photosError;
export const selectProfileSelectedProfile = (state: RootState): UserProfile | undefined =>
  state.profiles.selectedProfile;

export default profilesSlice.reducer;
