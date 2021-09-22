import type { UserInfo } from 'firebase/auth';
import type { Unsubscribe } from 'firebase/firestore';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserCredentials, UserRegistrationInfo } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';
import {
  registerUserInFirebase,
  signInUserInFirebase,
  signOutUserInFirebase,
  SocialMediaProvider,
  socialMediaSignInForFirebase,
  verifyAuthWithFirebase,
} from '../../App/Firebase/FirestoreAuthService';

export type AuthState = {
  currentUser?: UserInfo;
  error?: Error;
  isAuth: boolean;
};

const initialState: AuthState = {
  currentUser: undefined,
  error: undefined,
  isAuth: false,
};

/* TODO: Move Firebase calls to a Firebase service */
export const registerUserWithEmail = createAsyncThunk<UserInfo, UserRegistrationInfo>(
  'auth/registerUserWithEmail',
  async (regInfo, _0) => {
    const user = await registerUserInFirebase(regInfo);
    const userInfo = user.providerData[0];
    return userInfo;
  },
);

export const signInUserWithEmail = createAsyncThunk<UserInfo, UserCredentials>(
  'auth/signInUserWithEmail',
  async (creds, thunkApi) => {
    const user = await signInUserInFirebase(creds);
    if (!user) {
      return thunkApi.rejectWithValue(new Error('null user'));
    }
    const userInfo = user.providerData[0];
    return userInfo;
  },
);

export const signInUserWithSocialMedia = createAsyncThunk<UserInfo, SocialMediaProvider>(
  'auth/signInUserWithSocialMedia',
  async (providerName, thunkApi) => {
    const user = await socialMediaSignInForFirebase(providerName);
    if (!user) {
      return thunkApi.rejectWithValue(new Error('null user'));
    }
    const userInfo = user.providerData[0];
    return userInfo;
  },
);

export const signOutUser = createAsyncThunk('auth/signOutUser', async () => {
  await signOutUserInFirebase();
});

export const verifyAuth = (dispatch: AppDispatch): Unsubscribe =>
  verifyAuthWithFirebase({
    next: (user) => {
      if (user) {
        const userInfo = user.providerData[0];
        dispatch(authSlice.actions.authUser(userInfo));
      } else {
        dispatch(authSlice.actions.unauthUser());
      }
    },
    error: (err) => {
      dispatch(authSlice.actions.setError(err));
    },
    complete: () => {
      // never called
    },
  });

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<UserInfo>) => ({
      ...state,
      currentUser: action.payload,
      isAuth: true,
    }),
    clearError: (state) => ({
      ...state,
      error: undefined,
    }),
    setError: (state, action: PayloadAction<Error>) => ({
      ...state,
      error: action.payload,
    }),
    unauthUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUserWithEmail.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(registerUserWithEmail.rejected, (_0, action) =>
        authSlice.caseReducers.setError(initialState, {
          payload: action.error as Error,
          type: 'auth/setError',
        }),
      )
      .addCase(signInUserWithEmail.pending, () => authSlice.caseReducers.unauthUser())
      .addCase(signInUserWithEmail.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(signInUserWithEmail.rejected, (_0, action) =>
        authSlice.caseReducers.setError(initialState, {
          payload: action.error as Error,
          type: 'auth/setError',
        }),
      )
      .addCase(signInUserWithSocialMedia.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(signInUserWithSocialMedia.rejected, (_0, action) =>
        authSlice.caseReducers.setError(initialState, {
          payload: action.error as Error,
          type: 'auth/setError',
        }),
      )
      .addCase(signOutUser.fulfilled, () => authSlice.caseReducers.unauthUser())
      .addCase(signOutUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(initialState, {
          payload: action.error as Error,
          type: 'auth/setError',
        }),
      );
  },
});

export const { clearError } = authSlice.actions;
export const selectCurrentUser = (state: RootState): UserInfo | undefined => state.auth.currentUser;
export const selectError = (state: RootState): Error | undefined => state.auth.error;
export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;

export default authSlice.reducer;
