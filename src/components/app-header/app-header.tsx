import { selectUser } from '@selectors';
import { AppHeaderUI } from '@ui';
import { useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);
  const { pathname } = useLocation();

  return <AppHeaderUI userName={user?.name} pathname={pathname} />;
};
