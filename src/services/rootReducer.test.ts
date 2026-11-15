import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('возвращает начальное состояние всех слайсов для неизвестного экшена', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state).toEqual({
      ingredients: {
        ingredients: [],
        isLoading: false,
        error: null,
      },
      burgerConstructor: {
        bun: null,
        ingredients: [],
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        orderError: null,
        viewedOrder: null,
        isViewedOrderLoading: false,
        notFoundOrderNumber: null,
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null,
      },
      userOrders: {
        orders: [],
        isLoading: false,
        error: null,
      },
      user: {
        user: null,
        isAuthChecked: false,
        isRequestPending: false,
        requestError: null,
      },
    });
  });
});
