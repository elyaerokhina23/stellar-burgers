import { selectUserOrders, selectUserOrdersLoading } from '@selectors';
import { fetchUserOrders } from '@slices/user-orders-slice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);

  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);

  if (!orders.length && isLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
