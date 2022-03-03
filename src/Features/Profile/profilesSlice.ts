import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createFileInFirebase, readDownloadUrl } from '../../App/Firebase/FirebaseStorageService';
import {
  readUserProfilePhotosFromFirestore,
  watchUserProfileFromFirestore,
  Unsubscribe,
  updateUserProfilePhotoInFirestore,
  createPhotoInProfileCollection,
} from '../../App/Firebase/FirestoreUserProfileService';
import { PhotoData, UserProfile } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

type ProfileState = {
  currentProfile?: UserProfile;
  isLoadingPhotos: boolean;
  isLoadingProfile: boolean;
  isUpdatingProfile: boolean;
  isUploadingPhoto: boolean;
  photos: PhotoData[];
  photosError?: Error;
  profileError?: Error;
  selectedProfile?: UserProfile;
  uploadProgress: number;
};

const initialState: ProfileState = {
  currentProfile: undefined,
  isLoadingPhotos: false,
  isLoadingProfile: false,
  isUpdatingProfile: false,
  isUploadingPhoto: false,
  photos: [],
  photosError: undefined,
  profileError: undefined,
  selectedProfile: undefined,
  uploadProgress: 0,
};

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

export const updateUserProfilePhoto = createAsyncThunk(
  'profile/updateUserProfilePhoto',
  async (photoData: PhotoData, thunkApi) => {
    await updateUserProfilePhotoInFirestore(photoData);
  },
);

export const uploadPhoto = (
  dispatch: AppDispatch,
  photoName: string,
  photo: Blob,
  updateCurrentProfile = false,
) => {
  const { uploadPhotosPending, uploadPhotosFulfilled, uploadPhotosRejected, uploadPhotosProgress } =
    profilesSlice.actions;
  dispatch(uploadPhotosPending());
  const uploadTask = createFileInFirebase(photoName, photo);
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
        const photoUrl = await readDownloadUrl(uploadTask.snapshot.ref);

        const photoData: PhotoData = {
          name: photoName,
          photoUrl,
        };
        await createPhotoInProfileCollection(photoData);
        dispatch(uploadPhotosFulfilled());

        if (updateCurrentProfile) {
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
    fetchUserProfilePhotosPending: (state) => ({
      ...state,
      photos: [],
      photosError: undefined,
      isLoading: true,
    }),
    fetchUserProfilePhotosFulfilled: (state, action: PayloadAction<PhotoData[]>) => ({
      ...state,
      photos: action.payload,
      photosError: undefined,
      isLoading: false,
    }),
    fetchUserProfilePhotosRejected: (state, action: PayloadAction<Error>) => ({
      ...state,
      photos: [],
      photosError: action.payload,
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
      .addCase(updateUserProfilePhoto.fulfilled, (state) => ({
        ...state,
        isUpdatingProfile: false,
      }))
      .addCase(updateUserProfilePhoto.pending, (state) => ({
        ...state,
        isUpdatingProfile: true,
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
export const selectProfileIsLoading = (state: RootState): boolean =>
  state.profiles.isLoadingProfile;
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
