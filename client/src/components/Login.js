import React, {useState} from "react";
import PropTypes from "prop-types";

import axios from 'axios';

const loginUser = async (credentials) => {
  const res = await axios.post('http://localhost:5000/login', credentials);
  return res.data.token;
}

const Login = ({setToken}) => {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault()
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  }

  return (
    <div className="login-wrapper">
      <h1>Golden Compass</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label>
          <p>Логин</p>
          <input type="text" onChange={e => setUserName(e.target.value)} />
        </label>
        <label>
          <p>Пароль</p>
          <input type="password" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button type="submit">Войти</button>
        </div>
      </form>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login;