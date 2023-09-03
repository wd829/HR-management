import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { UserModel } from '@app/domain/UserModel';
import { persistUser, readUser } from '@app/services/localStorage.service';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { SaveUserProfileRequest, saveUserProfile, GetUserProfileRequest, getUserProfile } from '@app/api/user.api';
import { allow } from '@app/api/user.api';

export interface UserState {
  user: UserModel | null;
}

const initialState: UserState = {
  user: readUser(),
};

export const setUser = createAction<PrepareAction<UserModel>>('user/setUser', (newUser) => {
  persistUser(newUser);

  return {
    payload: newUser,
  };
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const setAllowStatus = createAction<PrepareAction<UserModel>>('user/doAllow', (status) => {
  return {
    payload: status,
  };
});

export const doSaveUserProfile = createAsyncThunk('user/doSaveUserProfile', async (savePayload: SaveUserProfileRequest, { dispatch }) =>
  saveUserProfile(savePayload).then(data => {
    dispatch(setUser(data.data))
  })
);

export const doGetUserProfile = createAsyncThunk('user/doGetUserProfile', async (getUserProfilePayload: GetUserProfileRequest, { dispatch }) =>
  getUserProfile(getUserProfilePayload).then(data => {
    dispatch(setUser(data.data))
  }))
  
export default userSlice.reducer;
