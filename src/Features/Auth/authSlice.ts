import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import firebase from 'firebase';
import type { UserCredentials } from '../../App/Shared/Types';
import { RootState } from '../../App/Store/store';

export type AuthState = {
  currentUser?: firebase.User;
  error?: Error;
  isAuth: boolean;
};

const initialState: AuthState = {
  currentUser: undefined,
  error: undefined,
  isAuth: false,
};

export const signInUser = createAsyncThunk<firebase.User, UserCredentials>(
  'auth/signInUser',
  async (creds, thunkApi) => {
    const auth = firebase.auth();
    const authResult = await auth.signInWithEmailAndPassword(creds.email, creds.password);
    if (!authResult.user) {
      return thunkApi.rejectWithValue(new Error('null user'));
    }
    return authResult.user;
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOutUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.fulfilled, (state, action) => ({
        ...state,
        currentUser: action.payload,
        isAuth: true,
      }))
      .addCase(signInUser.pending, (state) => initialState)
      .addCase(signInUser.rejected, (state, action) => ({
        ...initialState,
        error: action.error as Error,
      }));
  },
});

export const { signOutUser } = authSlice.actions;
export const selectCurrentUser = (state: RootState): firebase.User | undefined =>
  state.auth.currentUser;
export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;

export default authSlice.reducer;
