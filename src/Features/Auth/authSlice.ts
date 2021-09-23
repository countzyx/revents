import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserCredentials, UserRegistrationInfo } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';
import type { Unsubscribe, UserInfo } from '../../App/Firebase/FirebaseAuthService';
import {
  changePasswordUserPasswordInFirebase,
  registerPasswordUserInFirebase,
  signInPasswordUserInFirebase,
  signOutUserInFirebase,
  SocialMediaProvider,
  signInSocialMediaUserInFirebase,
  verifyAuthWithFirebase,
} from '../../App/Firebase/FirebaseAuthService';

export type AuthState = {
  userInfo?: UserInfo;
  error?: Error;
  isAuth: boolean;
};

const initialState: AuthState = {
  userInfo: undefined,
  error: undefined,
  isAuth: false,
};

export const changePasswordUserPassword = createAsyncThunk<void, string>(
  'auth/changePasswordUserPassword',
  async (newPassword) => {
    await changePasswordUserPasswordInFirebase(newPassword);
  },
);

/* TODO: Move Firebase calls to a Firebase service */
export const registerPasswordUser = createAsyncThunk<UserInfo, UserRegistrationInfo>(
  'auth/registerPasswordUser',
  async (regInfo, _0) => {
    const user = await registerPasswordUserInFirebase(regInfo);
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
        const userInfo = { ...user.providerData[0], uid: user.uid };
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
      userInfo: action.payload,
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
      .addCase(signInPasswordUser.pending, () => authSlice.caseReducers.unauthUser())
      .addCase(signInPasswordUser.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(signInPasswordUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      )
      .addCase(signInSocialMediaUser.pending, () => authSlice.caseReducers.unauthUser())
      .addCase(signInSocialMediaUser.fulfilled, (state, action) =>
        authSlice.caseReducers.authUser(state, action),
      )
      .addCase(signInSocialMediaUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      )
      .addCase(signOutUser.pending, (state) => authSlice.caseReducers.clearError(state))
      .addCase(signOutUser.fulfilled, () => authSlice.caseReducers.unauthUser())
      .addCase(signOutUser.rejected, (state, action) =>
        authSlice.caseReducers.setError(state, authSlice.actions.setError(action.error as Error)),
      );
  },
});

export const { clearError } = authSlice.actions;
export const selectAuthUserInfo = (state: RootState): UserInfo | undefined => state.auth.userInfo;
export const selectAuthError = (state: RootState): Error | undefined => state.auth.error;
export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;

export default authSlice.reducer;
