import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User, UserCredentials } from '../../App/Shared/Types';
import { RootState } from '../../App/Store/store';

export type AuthState = {
  currentUser?: User | undefined;
  isAuth: boolean;
};

const initialState: AuthState = {
  currentUser: undefined,
  isAuth: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInUser: (state, action: PayloadAction<UserCredentials>) => ({
      ...state,
      currentUser: { email: action.payload.email, photoUrl: '/assets/user.png' },
      isAuth: true,
    }),
    signOutUser: () => initialState,
  },
});

export const { signInUser, signOutUser } = authSlice.actions;
export const selectCurrentUser = (state: RootState): User | undefined => state.auth.currentUser;
export const selectIsAuth = (state: RootState): boolean => state.auth.isAuth;

export default authSlice.reducer;
