import { createSlice, configureStore } from '@reduxjs/toolkit';

const AppConfig = {
  auth: {
    status: 'UnAuthorize',
    user: {
      displayName: '',
      email: '',
      emailVerified: '',
    },
  },
};

const UserAuthSlice = createSlice({
  name: 'UserAuth',
  initialState: AppConfig,
  reducers: {
    updateUser: (state, action) => {
      console.log(action.payload);
      state.auth = {
        status: action.payload.status,
        user: { ...action.payload.user },
      };
    },
  },
});

export const { updateUser } = UserAuthSlice.actions;

export const store = configureStore({
  reducer: UserAuthSlice.reducer,
});
