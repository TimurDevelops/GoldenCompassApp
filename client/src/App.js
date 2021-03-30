import React from 'react';
import './App.css';
import useToken from "./utils/useToken";
import Login from "./components/Login";
import Header from "./layout/Header";

function App() {

  const { token, setToken, unsetToken } = useToken();
  const logout = () => {
    console.log('here')
    unsetToken();
  }

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div>
      <Header logout={logout}/>
    </div>
  );
}

export default App;