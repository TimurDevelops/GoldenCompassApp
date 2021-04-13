import React, {useState} from "react";
import PropTypes from "prop-types";

import axios from 'axios';
import './Login.scss'
import Switch from "./Switch";

const outputErrors = (errors) => {
  errors.forEach(err=>{
    console.log(err)
  })
}

const loginUser = async ({credentials, type}) => {
  if (type === 'teacher') {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/teacher', credentials);
      return {token: res.data.token, user: res.data.user};
    } catch (e) {
      outputErrors(e.response.data.errors)
    }
  } else if (type === 'student') {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/student', credentials);
      return {token: res.data.token, user: res.data.user};
    } catch (e) {
      outputErrors(e.response.data.errors)
    }
  }
}

const Login = ({setToken, setUser}) => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [type, setType] = useState();

  const handleSubmit = async e => {
    e.preventDefault()
    const {token, user} = await loginUser({
      credentials: {
        login,
        password,
      },
      type
    });
    // console.log(user)
    setToken(token);
    setUser(user)
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
                       onChange={e => setLogin(e.target.value)} required/>
                <label htmlFor="login" className="form-label">Логин</label>
              </div>

              <div className="form-group field">
                <input type="password" className="form-field" placeholder="Пароль" name="password" id='password'
                       onChange={e => setPassword(e.target.value)} required/>
                <label htmlFor="password" className="form-label">Пароль</label>
              </div>

              <Switch labelOne="Учитель" labelTwo="Ученик" valueOne="teacher" valueTwo="student"
                      onChange={(value) => {
                        console.log(value);
                        setType(value)
                      }}/>

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
  setToken: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
}

export default Login;