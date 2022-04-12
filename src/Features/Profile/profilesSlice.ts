import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createImageInFirebase,
  deleteImageInFirebase,
  readDownloadUrl,
} from '../../App/Firebase/FirebaseStorageService';
import { readEventsForUserFromFirestore } from '../../App/Firebase/FirestoreEventService';
import {
  readUserProfilePhotosFromFirestore,
  watchUserProfileFromFirestore,
  Unsubscribe,
  updateUserProfilePhotoInFirestore,
  createPhotoInProfileCollection,
  deletePhotoInProfileCollection,
  setFollowUserInFirestore,
  setUnfollowUserInFirestore,
} from '../../App/Firebase/FirestoreUserProfileService';
import { EventInfo, PhotoData, UserEventType, UserProfile } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type ProfileState = {
  currentProfile?: UserProfile;
  eventsError?: Error;
  isLoadingEvents: boolean;
  isLoadingPhotos: boolean;
  isLoadingProfile: boolean;
  isUpdatingProfile: boolean;
  isUploadingPhoto: boolean;
  photos: PhotoData[];
  photosError?: Error;
  profileError?: Error;
  profileEvents?: EventInfo[];
  selectedProfile?: UserProfile;
  uploadProgress: number;
};

const initialState: ProfileState = {
  currentProfile: undefined,
  eventsError: undefined,
  isLoadingEvents: false,
  isLoadingPhotos: false,
  isLoadingProfile: false,
  isUpdatingProfile: false,
  isUploadingPhoto: false,
  photos: [],
  photosError: undefined,
  profileError: undefined,
  profileEvents: [],
  selectedProfile: undefined,
  uploadProgress: 0,
};

export const deletePhotoFromCurrentProfile = createAsyncThunk<
  void,
  PhotoData,
  { dispatch: AppDispatch; state: RootState }
>('profile/deletePhotoFromCurrentProfile', async (photoData, thunkApi) => {
  const { id, photoName, photoURL } = photoData;
  if (!id) {
    thunkApi.rejectWithValue(new Error('photo has no ID'));
    return;
  }
  const { profiles } = thunkApi.getState();
  const { currentProfile } = profiles;
  if (!currentProfile) {
    thunkApi.rejectWithValue(new Error('no current profile'));
    return;
  }
  if (currentProfile?.photoURL === photoURL) {
    thunkApi.rejectWithValue(new Error('cannot delete active profile photo'));
    return;
  }

  await deletePhotoInProfileCollection(id);
  await deleteImageInFirebase(photoName);
});

export const fetchCurrentUserProfile = (dispatch: AppDispatch, userId: string): Unsubscribe => {
  const {
    fetchCurrentUserProfilePending,
    fetchCurrentUserProfileFulfilled,
    fetchCurrentUserProfileRejected,
  } = profilesSlice.actions;
  const unsubscribe = watchUserProfileFromFirestore(
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
  const unsubscribe = watchUserProfileFromFirestore(
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

export const fetchUserEvents = (
  dispatch: AppDispatch,
  eventType: UserEventType,
  uid: string,
): Unsubscribe => {
  const {
    fetchUserProfileEventsFulfilled,
    fetchUserProfileEventsPending,
    fetchUserProfileEventsRejected,
  } = profilesSlice.actions;

  const unsubscribe = readEventsForUserFromFirestore(
    {
      next: async (snapshot) => {
        dispatch(fetchUserProfileEventsPending());
        const fetchedEvents = snapshot.docs.map((docResult) => docResult.data());
        const events = fetchedEvents.filter((e) => e !== undefined) as EventInfo[];
        dispatch(fetchUserProfileEventsFulfilled(events));
      },
      error: async (err) => dispatch(fetchUserProfileEventsRejected(err)),
    },
    eventType,
    uid,
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

export const setFollowUser = createAsyncThunk<
  void,
  UserProfile,
  { dispatch: AppDispatch; state: RootState }
>('profile/setFollowUser', async (followedUser, thunkApi) => {
  await setFollowUserInFirestore(followedUser);
});

export const setUnfollowUser = createAsyncThunk<
  void,
  string,
  { dispatch: AppDispatch; state: RootState }
>('profile/setUnfollowUser', async (followedUserId, thunkApi) => {
  await setUnfollowUserInFirestore(followedUserId);
});

export const updateUserProfilePhoto = createAsyncThunk<
  void,
  PhotoData,
  { dispatch: AppDispatch; state: RootState }
>('profile/updateUserProfilePhoto', async (photoData, thunkApi) => {
  await updateUserProfilePhotoInFirestore(photoData);
});

export const uploadPhotoToCurrentProfile = (
  dispatch: AppDispatch,
  photoName: string,
  photo: Blob,
  updateProfilePhoto = false,
) => {
  const { uploadPhotosPending, uploadPhotosFulfilled, uploadPhotosRejected, uploadPhotosProgress } =
    profilesSlice.actions;
  dispatch(uploadPhotosPending());
  const uploadTask = createImageInFirebase(photoName, photo);
  uploadTask.on('state_changed', {
    next: (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      dispatch(uploadPhotosProgress(progress));
    },
    error: (error) => {
      dispatch(uploadPhotosRejected(error));
    },
    complete: async () => {
      try {
        const photoURL = await readDownloadUrl(uploadTask.snapshot.ref);

        const photoData: PhotoData = {
          photoName,
          photoURL,
        };
        await createPhotoInProfileCollection(photoData);
        dispatch(uploadPhotosFulfilled());

        if (updateProfilePhoto) {
          try {
            await updateUserProfilePhotoInFirestore(photoData);
          } catch (e) {
            const err = e as Error;
            dispatch(uploadPhotosRejected(err || new Error(String(e))));
          }
        }
      } catch (e) {
        const err = e as Error;
        dispatch(uploadPhotosRejected(err || new Error(String(e))));
      }
    },
  });
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
    fetchUserProfileEventsPending: (state) => ({
      ...state,
      profileEvents: [],
      eventsError: undefined,
      isLoadingEvents: true,
    }),
    fetchUserProfileEventsFulfilled: (state, action: PayloadAction<EventInfo[]>) => ({
      ...state,
      profileEvents: action.payload,
      eventsError: undefined,
      isLoadingEvents: false,
    }),
    fetchUserProfileEventsRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      profileEvents: [],
      eventsError: action.payload,
      isLoadingEvents: false,
    }),
    fetchUserProfilePhotosPending: (state) => ({
      ...state,
      photos: [],
      photosError: undefined,
      isLoadingPhotos: true,
    }),
    fetchUserProfilePhotosFulfilled: (state, action: PayloadAction<PhotoData[]>) => ({
      ...state,
      photos: action.payload,
      photosError: undefined,
      isLoadingPhotos: false,
    }),
    fetchUserProfilePhotosRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      photos: [],
      photosError: action.payload,
      isLoadingPhotos: false,
    }),
    setPhotoError: (state, action: PayloadAction<Error>) => ({
      ...state,
      photosError: action.payload,
    }),
    setProfileError: (state, action: PayloadAction<Error>) => ({
      ...state,
      profileError: action.payload,
    }),
    uploadPhotosPending: (state) => ({
      ...state,
      isUploadingPhoto: true,
      photosError: undefined,
      uploadProgress: 0,
    }),
    uploadPhotosFulfilled: (state) => ({
      ...state,
      isUploadingPhoto: false,
      photosError: undefined,
      uploadProgress: 0,
    }),
    uploadPhotosRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      isUploadingPhoto: false,
      photosError: action.payload,
      uploadProgress: 0,
    }),
    uploadPhotosProgress: (state, action: PayloadAction<number>) => ({
      ...state,
      uploadProgress: action.payload,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(deletePhotoFromCurrentProfile.pending, (state) => ({
        ...state,
        photosError: undefined,
      }))
      .addCase(deletePhotoFromCurrentProfile.rejected, (state, action) => ({
        ...state,
        photosError: action.error as Error,
      }))
      .addCase(setFollowUser.fulfilled, (state) => ({
        ...state,
        isUpdatingProfile: false,
      }))
      .addCase(setFollowUser.pending, (state) => ({
        ...state,
        isUpdatingProfile: true,
        profileError: undefined,
      }))
      .addCase(setFollowUser.rejected, (state, action) => ({
        ...state,
        isUpdatingProfile: false,
        profileError: action.error as Error,
      }))
      .addCase(setUnfollowUser.fulfilled, (state) => ({
        ...state,
        isUpdatingProfile: false,
      }))
      .addCase(setUnfollowUser.pending, (state) => ({
        ...state,
        isUpdatingProfile: true,
        profileError: undefined,
      }))
      .addCase(setUnfollowUser.rejected, (state, action) => ({
        ...state,
        isUpdatingProfile: false,
        profileError: action.error as Error,
      }))
      .addCase(updateUserProfilePhoto.fulfilled, (state) => ({
        ...state,
        isUpdatingProfile: false,
      }))
      .addCase(updateUserProfilePhoto.pending, (state) => ({
        ...state,
        isUpdatingProfile: true,
        photosError: undefined,
      }))
      .addCase(updateUserProfilePhoto.rejected, (state, action) => ({
        ...state,
        isUpdatingProfile: false,
        photosError: action.error as Error,
      }));
  },
});

export const { clearErrors } = profilesSlice.actions;
export const selectProfileCurrentProfile = (state: RootState): UserProfile | undefined =>
  state.profiles.currentProfile;
export const selectProfileError = (state: RootState): Error | undefined =>
  state.profiles.profileError;
export const selectProfileEvents = (state: RootState): EventInfo[] | undefined =>
  state.profiles.profileEvents;
export const selectProfileEventsError = (state: RootState): Error | undefined =>
  state.profiles.eventsError;
export const selectProfileIsLoading = (state: RootState): boolean =>
  state.profiles.isLoadingProfile;
export const selectProfileIsLoadingEvents = (state: RootState): boolean =>
  state.profiles.isLoadingEvents;
export const selectProfileIsLoadingPhotos = (state: RootState): boolean =>
  state.profiles.isLoadingPhotos;
export const selectProfileIsUpdating = (state: RootState): boolean =>
  state.profiles.isUpdatingProfile;
export const selectProfileIsUploadingPhoto = (state: RootState): boolean =>
  state.profiles.isUploadingPhoto;
export const selectProfilePhotos = (state: RootState): PhotoData[] => state.profiles.photos;
export const selectProfilePhotosError = (state: RootState): Error | undefined =>
  state.profiles.photosError;
export const selectProfileSelectedProfile = (state: RootState): UserProfile | undefined =>
  state.profiles.selectedProfile;

export default profilesSlice.reducer;
