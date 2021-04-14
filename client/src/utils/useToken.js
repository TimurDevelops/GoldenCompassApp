import {useState} from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken ? userToken : undefined
  };

  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    sessionStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken);
  };
  const unsetToken = () => {
    sessionStorage.removeItem('token');
    setToken(undefined);
  }

  return {
    setToken: saveToken,
    user: token,
    unsetToken
  }
}