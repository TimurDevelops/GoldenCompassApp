import React from 'react';
import './App.css';
import useToken from "./utils/useToken";
import Login from "./components/Login";
import Header from "./layout/Header";
import Canvas from "./layout/Canvas";

function App() {

  const { token, setToken, unsetToken } = useToken();
  const logout = () => {
    unsetToken();
  }

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div>
      <Header logout={logout}/>
      <Canvas/>
    </div>
  );
}

export default App;