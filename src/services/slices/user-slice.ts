import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '@api';
import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  type SerializedError,
} from '@reduxjs/toolkit';

import { deleteCookie, getCookie, setCookie } from '@utils/cookie';
import { accessTokenKey, refreshTokenKey } from '@utils/storage-keys';

import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isRequestPending: boolean;
  requestError: SerializedError | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isRequestPending: false,
  requestError: null,
};

const saveTokens = (accessToken: string, refreshTokenValue: string): void => {
  setCookie(accessTokenKey, accessToken);
  localStorage.setItem(refreshTokenKey, refreshTokenValue);
};

const removeTokens = (): void => {
  deleteCookie(accessTokenKey);
  localStorage.removeItem(refreshTokenKey);
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const response = await registerUserApi(registerData);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const response = await loginUserApi(loginData);
    saveTokens(response.accessToken, response.refreshToken);
    return response.user;
  }
);

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  if (!getCookie(accessTokenKey) && !localStorage.getItem(refreshTokenKey)) {
    return null;
  }

  try {
    if (!getCookie(accessTokenKey)) {
      await refreshToken();
    }
    const response = await getUserApi();
    return response.user;
  } catch (error) {
    removeTokens();
    throw error;
  }
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: Partial<TRegisterData>) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  removeTokens();
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearRequestError: (state) => {
      state.requestError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addMatcher(
        isAnyOf(registerUser.pending, loginUser.pending, updateUser.pending),
        (state) => {
          state.isRequestPending = true;
          state.requestError = null;
        }
      )
      .addMatcher(
        isAnyOf(registerUser.fulfilled, loginUser.fulfilled, updateUser.fulfilled),
        (state, action) => {
          state.isRequestPending = false;
          state.user = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(registerUser.rejected, loginUser.rejected, updateUser.rejected),
        (state, action) => {
          state.isRequestPending = false;
          state.requestError = action.error;
        }
      );
  },
});

export const { clearRequestError } = userSlice.actions;
