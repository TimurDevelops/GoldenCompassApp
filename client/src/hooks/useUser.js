import {useState} from 'react';

export const useUser = () => {
  const getUser = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user ? user : undefined
  };

  const [user, setUser] = useState(getUser());
  console.log('useUser', user)

  const saveUser = user => {
    console.log('saveUser', user)

    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const unsetUser = () => {
    sessionStorage.removeItem('user');
    setUser(undefined);
  }

  return {
    setUser: saveUser,
    user: user,
    unsetUser: unsetUser
  }
}
