import { order, requestError, requestId } from './__tests__/test-data';
import {
  clearOrderModalData,
  fetchOrderByNumber,
  orderBurger,
  orderSlice,
} from './order-slice';

const reducer = orderSlice.reducer;
const initialState = orderSlice.getInitialState();

describe('orderSlice', () => {
  describe('оформление заказа', () => {
    it('при начале запроса включает orderRequest и сбрасывает ошибку', () => {
      const state = reducer(
        { ...initialState, orderError: { message: 'старая ошибка' } },
        orderBurger.pending(requestId, order.ingredients)
      );

      expect(state.orderRequest).toBe(true);
      expect(state.orderError).toBeNull();
    });

    it('при успешном запросе сохраняет заказ для модального окна', () => {
      const state = reducer(
        { ...initialState, orderRequest: true },
        orderBurger.fulfilled(order, requestId, order.ingredients)
      );

      expect(state.orderModalData).toEqual(order);
      expect(state.orderRequest).toBe(false);
    });

    it('при ошибке запроса сохраняет ошибку и выключает orderRequest', () => {
      const state = reducer(
        { ...initialState, orderRequest: true },
        orderBurger.rejected(requestError, requestId, order.ingredients)
      );

      expect(state.orderError?.message).toBe(requestError.message);
      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toBeNull();
    });

    it('очищает данные модального окна при его закрытии', () => {
      const state = reducer(
        { ...initialState, orderModalData: order },
        clearOrderModalData()
      );

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('загрузка заказа по номеру', () => {
    it('при начале запроса включает isViewedOrderLoading', () => {
      const state = reducer(
        initialState,
        fetchOrderByNumber.pending(requestId, order.number)
      );

      expect(state.isViewedOrderLoading).toBe(true);
    });

    it('при успешном запросе сохраняет найденный заказ', () => {
      const state = reducer(
        { ...initialState, isViewedOrderLoading: true },
        fetchOrderByNumber.fulfilled(order, requestId, order.number)
      );

      expect(state.viewedOrder).toEqual(order);
      expect(state.isViewedOrderLoading).toBe(false);
      expect(state.notFoundOrderNumber).toBeNull();
    });

    it('запоминает номер, если сервер не нашёл заказ', () => {
      const state = reducer(
        { ...initialState, isViewedOrderLoading: true },
        fetchOrderByNumber.fulfilled(null, requestId, order.number)
      );

      expect(state.notFoundOrderNumber).toBe(order.number);
      expect(state.isViewedOrderLoading).toBe(false);
    });

    it('при ошибке запроса выключает isViewedOrderLoading', () => {
      const state = reducer(
        { ...initialState, isViewedOrderLoading: true },
        fetchOrderByNumber.rejected(requestError, requestId, order.number)
      );

      expect(state.isViewedOrderLoading).toBe(false);
      expect(state.notFoundOrderNumber).toBe(order.number);
    });
  });
});
