import { Unsubscribe } from 'firebase/firestore';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import type { UserCredentials, UserRegistrationInfo } from '../../App/Shared/Types';
import { AppDispatch, RootState } from '../../App/Store/store';

export type AuthState = {
  currentUser?: User;
  error?: Error;
  isAuth: boolean;
};

const initialState: AuthState = {
  currentUser: undefined,
  error: undefined,
  isAuth: false,
};

export const registerUser = createAsyncThunk<User, UserRegistrationInfo>(
  'auth/registerUser',
  async (regInfo, thunkApi) => {
    const auth = getAuth();
    const regResult = await createUserWithEmailAndPassword(auth, regInfo.email, regInfo.password);
    await updateProfile(regResult.user, { displayName: regInfo.displayName });
    return regResult.user;
  },
);

export const signInUser = createAsyncThunk<User, UserCredentials>(
  'auth/signInUser',
  async (creds, thunkApi) => {
    const auth = getAuth();
    const authResult = await signInWithEmailAndPassword(auth, creds.email, creds.password);
    if (!authResult.user) {
      return thunkApi.rejectWithValue(new Error('null user'));
    }
    return authResult.user;
  },
);

export const signOutUser = createAsyncThunk('auth/signOutUser', async (thunkApi) => {
  const auth = getAuth();
  await signOut(auth);
});

export const verifyAuth = (dispatch: AppDispatch): Unsubscribe => {
  const auth = getAuth();
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(authSlice.actions.authUser(user));
    } else {
      dispatch(authSlice.actions.unauthUser());
    }
  });
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authUser: (state, action: PayloadAction<User>) => ({
      ...state,
      currentUser: action.payload,
      isAuth: true,
    }),
    unauthUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, () => authSlice.caseReducers.unauthUser())
      .addCase(signInUser.rejected, (state, action) => ({
        ...initialState,
        error: action.error as Error,
      }));
  },
});

export const selectCurrentUser = (state: RootState): User | undefined => state.auth.currentUser;
export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;

export default authSlice.reducer;
