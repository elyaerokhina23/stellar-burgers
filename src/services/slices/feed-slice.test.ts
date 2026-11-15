import { orders, requestError, requestId } from './__tests__/test-data';
import { feedSlice, fetchFeeds } from './feed-slice';

const reducer = feedSlice.reducer;
const initialState = feedSlice.getInitialState();

const feedsResponse = {
  success: true,
  orders,
  total: 1500,
  totalToday: 42,
};

describe('feedSlice: загрузка ленты заказов', () => {
  it('при начале запроса включает isLoading и сбрасывает ошибку', () => {
    const state = reducer(
      { ...initialState, error: { message: 'старая ошибка' } },
      fetchFeeds.pending(requestId)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('при успешном запросе сохраняет заказы и счётчики и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchFeeds.fulfilled(feedsResponse, requestId)
    );

    expect(state.orders).toEqual(orders);
    expect(state.total).toBe(feedsResponse.total);
    expect(state.totalToday).toBe(feedsResponse.totalToday);
    expect(state.isLoading).toBe(false);
  });

  it('при ошибке запроса сохраняет ошибку и выключает isLoading', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchFeeds.rejected(requestError, requestId)
    );

    expect(state.error).toMatchObject({ message: requestError.message });
    expect(state.isLoading).toBe(false);
  });
});
