import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, type SerializedError } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: SerializedError | null;
  viewedOrder: TOrder | null;
  isViewedOrderLoading: boolean;
  notFoundOrderNumber: number | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  viewedOrder: null,
  isViewedOrderLoading: false,
  notFoundOrderNumber: null,
};

export const orderBurger = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response.orders[0] ?? null;
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isViewedOrderLoading = true;
        state.notFoundOrderNumber = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isViewedOrderLoading = false;
        state.viewedOrder = action.payload;
        if (!action.payload) {
          state.notFoundOrderNumber = action.meta.arg;
        }
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isViewedOrderLoading = false;
        state.notFoundOrderNumber = action.meta.arg;
      });
  },
});

export const { clearOrderModalData } = orderSlice.actions;
