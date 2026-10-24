import { selectUserRequestError } from '@selectors';
import { clearRequestError, loginUser } from '@slices/user-slice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const requestError = useSelector(selectUserRequestError);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    dispatch(clearRequestError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={requestError?.message ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
