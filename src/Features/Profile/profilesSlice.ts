import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../App/Store/store';

type ProfileState = {
  error?: Error;
};

const initialState: ProfileState = {
  error: undefined,
};

export const profilesSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    clearError: (state) => ({
      ...state,
      error: undefined,
    }),
    setError: (state, action: PayloadAction<Error>) => ({
      ...state,
      error: action.payload,
    }),
  },
});

export const { clearError } = profilesSlice.actions;
export const selectProfileError = (state: RootState): Error | undefined => state.profiles.error;

export default profilesSlice.reducer;
