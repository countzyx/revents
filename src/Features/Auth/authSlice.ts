import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserCredentials, UserRegistrationInfo } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';
import type { Unsubscribe, UserInfo } from '../../App/Firebase/FirebaseAuthService';
import {
  updatePwUserPasswordInFirebase,
  createPasswordUserInFirebase,
  signInPasswordUserInFirebase,
  signOutUserInFirebase,
  SocialMediaProvider,
  signInSocialMediaUserInFirebase,
  verifyAuthWithFirebase,
} from '../../App/Firebase/FirebaseAuthService';

type AuthState = {
  error?: Error;
  isAppLoaded: boolean;
  isAuthed: boolean;
  userInfo?: UserInfo;
};

const initialState: AuthState = {
  error: undefined,
  isAppLoaded: false,
  isAuthed: false,
  userInfo: undefined,
};

export const changePasswordUserPassword = createAsyncThunk<void, string>(
  'auth/changePasswordUserPassword',
  async (newPassword) => {
    await updatePwUserPasswordInFirebase(newPassword);
  },
);

/* TODO: Move Firebase calls to a Firebase service */
export const registerPasswordUser = createAsyncThunk<UserInfo, UserRegistrationInfo>(
  'auth/registerPasswordUser',
  async (regInfo, _0) => {
    const user = await createPasswordUserInFirebase(regInfo);
    const userInfo = user.providerData[0];
    return userInfo;
  },
);

export const signInPasswordUser = createAsyncThunk<UserInfo, UserCredentials>(
  'auth/signInPasswordUser',
  async (creds, thunkApi) => {
    const user = await signInPasswordUserInFirebase(creds);
    if (!user) {
      return thunkApi.rejectWithValue(new Error('null user'));
    }
    const userInfo = user.providerData[0];
    return userInfo;
  },
);

export const signInSocialMediaUser = createAsyncThunk<UserInfo, SocialMediaProvider>(
  'auth/signInSocialMediaUser',
  async (providerName, thunkApi) => {
    const user = await signInSocialMediaUserInFirebase(providerName);
    if (!user) {
      return thunkApi.rejectWithValue(new Error('null user'));
    }
    const userInfo = { ...user.providerData[0], uid: user.uid }; // Social media provider data has wrong uid
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
        const userInfo = { ...user.providerData[0], uid: user.uid }; // Assume it's social media provider and has wrong uid
        dispatch(authSlice.actions.authUser(userInfo));
      } else {
        dispatch(authSlice.actions.unauthUser());
      }
      dispatch(authSlice.actions.loadedApp());
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
      userInfo: action.payload,
      isAuthed: true,
    }),
    clearError: (state) => ({
      ...state,
      error: undefined,
    }),
    loadedApp: (state) => ({
      ...state,
      isAppLoaded: true,
    }),
    setError: (state, action: PayloadAction<Error>) => ({
      ...state,
      error: action.payload,
    }),
    unauthUser: (state) => ({
      ...state,
      error: undefined,
      isAuthed: false,
      userInfo: undefined,
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePasswordUserPassword.pending, (state) =>
        authSlice.caseReducers.clearError(state),
      )
      .addCase(changePasswordUserPassword.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      )
      .addCase(registerPasswordUser.pending, (state) => authSlice.caseReducers.clearError(state))
      .addCase(registerPasswordUser.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(registerPasswordUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      )
      .addCase(signInPasswordUser.pending, (state) => authSlice.caseReducers.unauthUser(state))
      .addCase(signInPasswordUser.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(signInPasswordUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      )
      .addCase(signInSocialMediaUser.pending, (state) => authSlice.caseReducers.unauthUser(state))
      .addCase(signInSocialMediaUser.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(signInSocialMediaUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      )
      .addCase(signOutUser.pending, (state) => authSlice.caseReducers.clearError(state))
      .addCase(signOutUser.fulfilled, (state) => authSlice.caseReducers.unauthUser(state))
      .addCase(signOutUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      );
  },
});

export const { clearError } = authSlice.actions;
export const selectAuthError = (state: RootState): Error | undefined => state.auth.error;
export const selectAuthIsAppLoaded = (state: RootState): boolean => state.auth.isAppLoaded;
export const selectAuthIsAuthed = (state: RootState): boolean => state.auth.isAuthed;
export const selectAuthUserInfo = (state: RootState): UserInfo | undefined => state.auth.userInfo;

export default authSlice.reducer;
