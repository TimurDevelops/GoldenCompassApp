import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../utils/api";
import Checkbox from "../ui/Checkbox";


import './Login.scss'
import useUser from "../../hooks/useUser";

const loginUser = async ({credentials, type}) => {
  try {
    if (type === 'teacher') {
      const res = await api.post('/auth/teacher', credentials);
      return res.data;
    } else if (type === 'student') {
      const res = await api.post('/auth/student', credentials);
      return res.data;
    }
  } catch (e) {
    throw e.response.data.errors;
  }
}

const Login = ({setAuth, setAlert}) => {
  const {setUser} = useUser()
  const history = useHistory();
  const [login, setLogin] = useState();
  const [password, setPassword] = useState();
  const [type, setType] = useState("student");

  const outputErrors = (errors) => {
    errors.forEach(err => {
      setAlert(err.msg, 'danger')
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setAuth({isLoading: true, isAuthenticated: false});
    try {
      const user = await loginUser({
        credentials: {
          login,
          password,
        },
        type
      });
      setUser(user)
      setAuth({isLoading: false, isAuthenticated: true});
      history.push("/" + user.type);

    } catch (errors) {
      setAuth({isLoading: false, isAuthenticated: false});
      outputErrors(errors);
    }
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

              <Checkbox onChange={(value) => setType(value)}
                        label={'Учитель'}
                        name={'type'}
                        value={'teacher'}/>

              <Checkbox onChange={(value) => setType(value)}
                        label={'Ученик'}
                        name={'type'}
                        value={'student'}
                        checked={true}/>

              {/*<Switch labelOne="Учитель" labelTwo="Ученик" valueOne="teacher" valueTwo="student"*/}
              {/*        onChange={(value) => {*/}
              {/*          setType(value);*/}
              {/*        }}/>*/}

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
  auth: PropTypes.object.isRequired,
  setAlert: PropTypes.func.isRequired,
  setAuth: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
}

export default Login;