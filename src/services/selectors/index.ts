import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TIngredient, TOrder } from '@utils-types';

export const selectIngredients = (
  state: RootState
): RootState['ingredients']['ingredients'] => state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const selectIngredientsError = (
  state: RootState
): RootState['ingredients']['error'] => state.ingredients.error;

export const selectConstructorItems = (
  state: RootState
): RootState['burgerConstructor'] => state.burgerConstructor;

export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;

export const selectFeed = (state: RootState): RootState['feed'] => state.feed;
export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;

export const selectUserOrders = (state: RootState): TOrder[] => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState): boolean =>
  state.userOrders.isLoading;

export const selectUser = (state: RootState): RootState['user']['user'] =>
  state.user.user;
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUserRequestError = (
  state: RootState
): RootState['user']['requestError'] => state.user.requestError;

export const selectNotFoundOrderNumber = (state: RootState): number | null =>
  state.order.notFoundOrderNumber;

const selectViewedOrder = (state: RootState): TOrder | null => state.order.viewedOrder;

export const selectOrderByNumber = createSelector(
  [
    selectFeedOrders,
    selectUserOrders,
    selectViewedOrder,
    (_state: RootState, orderNumber: number): number => orderNumber,
  ],
  (feedOrders, userOrders, viewedOrder, orderNumber): TOrder | null =>
    feedOrders.find((order) => order.number === orderNumber) ??
    userOrders.find((order) => order.number === orderNumber) ??
    (viewedOrder?.number === orderNumber ? viewedOrder : null)
);

export const selectIngredientById = createSelector(
  [
    selectIngredients,
    (_state: RootState, ingredientId?: string): string | undefined => ingredientId,
  ],
  (ingredients, ingredientId): TIngredient | null =>
    ingredients.find((ingredient) => ingredient._id === ingredientId) ?? null
);
