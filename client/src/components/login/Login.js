import React, {useState} from "react";
import PropTypes from "prop-types";

import axios from 'axios';
import './Login.scss'
import Switch from "../ui/Switch";

const loginUser = async ({credentials, type}) => {
  try {
    if (type === 'teacher') {
      const res = await axios.post('http://localhost:5000/api/auth/teacher', credentials);
      return {token: res.data.token, user: res.data.user};
    } else if (type === 'student') {
      const res = await axios.post('http://localhost:5000/api/auth/student', credentials);
      return {token: res.data.token, user: res.data.user};
    }
  } catch (e) {
    throw e.response.data.errors;
  }
}

const Login = ({setUser, setIsLoading, setAlert}) => {
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [type, setType] = useState("teacher");

  const outputErrors = (errors) => {
    errors.forEach(err => {
      setAlert(err.msg, 'danger')
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(false);
    try {
      const user = await loginUser({
        credentials: {
          login,
          password,
        },
        type
      });
      setUser(user)
    } catch (errors) {
      outputErrors(errors);
    }
    setIsLoading(true);
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
                        setType(value);
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
  setAlert: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
}

export default Login;