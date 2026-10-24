import { combineSlices } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './slices/burger-constructor-slice';
import { feedSlice } from './slices/feed-slice';
import { ingredientsSlice } from './slices/ingredients-slice';
import { orderSlice } from './slices/order-slice';
import { userOrdersSlice } from './slices/user-orders-slice';
import { userSlice } from './slices/user-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  orderSlice,
  feedSlice,
  userOrdersSlice,
  userSlice
);
