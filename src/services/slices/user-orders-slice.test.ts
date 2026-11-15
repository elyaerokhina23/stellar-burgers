import { orders, requestError, requestId } from './__tests__/test-data';
import { fetchUserOrders, userOrdersSlice } from './user-orders-slice';
import { logoutUser } from './user-slice';

const reducer = userOrdersSlice.reducer;
const initialState = userOrdersSlice.getInitialState();

describe('userOrdersSlice: история заказов пользователя', () => {
  it('при начале запроса включает isLoading и сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: { message: 'старая ошибка' } },
      fetchUserOrders.pending(requestId)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('при успешном запросе сохраняет заказы и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchUserOrders.fulfilled(orders, requestId)
    );

    expect(state.orders).toEqual(orders);
    expect(state.isLoading).toBe(false);
  });

  it('при ошибке запроса сохраняет ошибку и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchUserOrders.rejected(requestError, requestId)
    );

    expect(state.error?.message).toBe(requestError.message);
    expect(state.isLoading).toBe(false);
  });

  it('очищает историю после выхода пользователя', () => {
    const state = reducer(
      { ...initialState, orders },
      logoutUser.fulfilled(undefined, requestId)
    );

    expect(state).toEqual(initialState);
  });
});
