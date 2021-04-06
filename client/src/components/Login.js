import React, {useState} from "react";
import PropTypes from "prop-types";

import axios from 'axios';
import './Login.scss'

const loginUser = async (credentials) => {
  const res = await axios.post('http://161.35.232.115:5000/login', credentials);
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
      <div className='background-holder'>
        <div className="login-form">

          <form className='form' onSubmit={(e) => handleSubmit(e)}>
            <div className="login-header">
              <p>Добро пожаловать в <br/>
                <span className='golden-compass'><span className='g-letter'>G</span>olden Compass</span></p>
            </div>
            <div className={'inputs-wrapper'}>
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

              <div className='submit-btn-wrapper'>
                <button type="submit" className='btn' id='loginBtn'>
                  <span>Войти</span>
                </button>
              </div>
            </div>
          </form>
          <div className='login-image'>

          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login;