import { selectUser, selectUserRequestError } from '@selectors';
import { clearRequestError, updateUser } from '@slices/user-slice';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { TRegisterData } from '@api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const requestError = useSelector(selectUserRequestError);
  const userName = user?.name ?? '';
  const userEmail = user?.email ?? '';

  const [formValue, setFormValue] = useState({
    name: userName,
    email: userEmail,
    password: '',
  });

  useEffect(() => {
    dispatch(clearRequestError());
  }, [dispatch]);

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userName,
      email: userEmail,
      password: '',
    }));
  }, [userName, userEmail]);

  const isFormChanged =
    formValue.name !== userName || formValue.email !== userEmail || !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    const changedData: Partial<TRegisterData> = {
      name: formValue.name,
      email: formValue.email,
    };
    if (formValue.password) {
      changedData.password = formValue.password;
    }

    void dispatch(updateUser(changedData)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue((prevState) => ({ ...prevState, password: '' }));
      }
    });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: userName,
      email: userEmail,
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      updateUserError={requestError?.message}
    />
  );
};
