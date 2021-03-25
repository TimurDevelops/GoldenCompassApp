import React from 'react';
import './App.css';
import useToken from "./utils/useToken";
import Login from "./components/Login";

function App() {

  const { token, setToken, unsetToken } = useToken();

  const logout = () => {
    unsetToken();
  }

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="wrapper">
      <h1>Application</h1>
      Вы вошли
      <button onClick={logout}>Выйти</button>
    </div>
  );
}

export default App;