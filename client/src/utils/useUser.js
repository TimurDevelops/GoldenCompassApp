import {useState} from 'react';

export default function useUser() {
  const getUser = () => {
    const userString = sessionStorage.getItem('user');
    const user = JSON.parse(userString);
    return user ? user : undefined
  };

  const [user, setUser] = useState(getUser());

  const saveUser = userToken => {
    sessionStorage.setItem('user', JSON.stringify(userToken));
    setUser(userToken);
  };
  const unsetToken = () => {
    sessionStorage.removeItem('user');
    setUser(undefined);
  }

  return {
    setUser: saveUser,
    user: user,
    unsetUser: unsetToken
  }
}