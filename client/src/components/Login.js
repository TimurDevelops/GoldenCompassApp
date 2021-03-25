import React, {useState} from "react";
import PropTypes from "prop-types";

import axios from 'axios';
import './Login.scss'

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
      <div className="login-form">

        <div className="login-header">
          Golden Compass
        </div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className={'form'}>
            <div className="form-group field">
              <input type="input" className="form-field" placeholder="Логин" name="login" id='login'
                     onChange={e => setUserName(e.target.value)} required/>
              <label htmlFor="login" className="form-label">Логин</label>
            </div>

            <div className="form-group field">
              <input type="password" className="form-field" placeholder="Пароль" name="password" id='password'
                     onChange={e => setPassword(e.target.value)} required/>
              <label htmlFor="password" className="form-label">Пароль</label>
            </div>

            <div className={'submit-btn-wrapper'}>
              <button type="submit" className={'btn'}>
                <span>Войти</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login;