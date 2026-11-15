import { requestError, requestId, user } from './__tests__/test-data';
import {
  checkUserAuth,
  clearRequestError,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userSlice,
} from './user-slice';

const reducer = userSlice.reducer;
const initialState = userSlice.getInitialState();

const loginData = { email: user.email, password: 'password' };
const registerData = { ...loginData, name: user.name };

describe('userSlice', () => {
  describe('проверка авторизации', () => {
    it('сохраняет пользователя и отмечает, что проверка завершена', () => {
      const state = reducer(initialState, checkUserAuth.fulfilled(user, requestId));

      expect(state.user).toEqual(user);
      expect(state.isAuthChecked).toBe(true);
    });

    it('при ошибке оставляет пользователя пустым и завершает проверку', () => {
      const state = reducer(
        initialState,
        checkUserAuth.rejected(requestError, requestId)
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe.each([
    {
      title: 'регистрация',
      pending: registerUser.pending(requestId, registerData),
      fulfilled: registerUser.fulfilled(user, requestId, registerData),
      rejected: registerUser.rejected(requestError, requestId, registerData),
    },
    {
      title: 'вход',
      pending: loginUser.pending(requestId, loginData),
      fulfilled: loginUser.fulfilled(user, requestId, loginData),
      rejected: loginUser.rejected(requestError, requestId, loginData),
    },
    {
      title: 'обновление профиля',
      pending: updateUser.pending(requestId, { name: user.name }),
      fulfilled: updateUser.fulfilled(user, requestId, { name: user.name }),
      rejected: updateUser.rejected(requestError, requestId, { name: user.name }),
    },
  ])('$title', ({ pending, fulfilled, rejected }) => {
    it('при начале запроса включает isRequestPending и сбрасывает ошибку', () => {
      const state = reducer(
        { ...initialState, requestError: { message: 'старая ошибка' } },
        pending
      );

      expect(state.isRequestPending).toBe(true);
      expect(state.requestError).toBeNull();
    });

    it('при успешном запросе сохраняет пользователя', () => {
      const state = reducer({ ...initialState, isRequestPending: true }, fulfilled);

      expect(state.user).toEqual(user);
      expect(state.isRequestPending).toBe(false);
    });

    it('при ошибке запроса сохраняет ошибку', () => {
      const state = reducer({ ...initialState, isRequestPending: true }, rejected);

      expect(state.requestError?.message).toBe(requestError.message);
      expect(state.isRequestPending).toBe(false);
    });
  });

  it('удаляет данные пользователя после выхода', () => {
    const state = reducer(
      { ...initialState, user, isAuthChecked: true },
      logoutUser.fulfilled(undefined, requestId)
    );

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  it('сбрасывает ошибку запроса', () => {
    const state = reducer(
      { ...initialState, requestError: { message: 'ошибка' } },
      clearRequestError()
    );

    expect(state.requestError).toBeNull();
  });
});
