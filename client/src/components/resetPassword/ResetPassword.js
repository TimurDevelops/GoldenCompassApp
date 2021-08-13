import React, {useState} from "react";
import api from "../../utils/api";

import GoBack from "../ui/GoBack";

import {useAlerts} from "../../hooks/useAlerts";
import {useParams} from "react-router-dom";

const ResetPassword = () => {
  const {setAlert} = useAlerts()

  const {user, type} = useParams();

  const [oldPassword, setOldPassword] = useState()
  const [password, setPassword] = useState()
  const [passwordConfirm, setPasswordConfirm] = useState()

  const handleSubmit = async () => {
    if (password !== passwordConfirm) {
      return setAlert('Пароли не совпадают', 'danger')
    }
    try {
      await api.post(`/${type}/set-password`, {login: user, oldPassword, password});
      setAlert('Пароль сменен успешно', 'primary')

    } catch (e) {
      e.response.data.errors.forEach(err => {
        setAlert(err.msg, 'danger')
      })
    }
  }

  return (
    <div className={"menu-bg"} id={'resetPassForm'}>
      <div className={"menu-wrapper"}>
        <form className='form' onSubmit={(e) => handleSubmit(e)}>
          <div className="login-header">
            <p><span className='golden-compass'><span className='g-letter'>С</span></span>менить пароль</p>
          </div>
          <div className={'inputs-wrapper'}>
            <div className="form-group field">
              <input type="password" className="form-field" placeholder="Ваш старый пароль" name="oldPassword"
                     id='oldPassword'
                     onChange={e => setOldPassword(e.target.value)} required/>
              <label htmlFor="oldPassword" className="form-label">Ваш старый пароль</label>
            </div>

            <div className="form-group field">
              <input type="password" className="form-field" placeholder="Введите новый пароль" name="password"
                     id='password'
                     onChange={e => setPassword(e.target.value)} required/>
              <label htmlFor="password" className="form-label">Введите новый пароль</label>
            </div>

            <div className="form-group field">
              <input type="password" className="form-field" placeholder="Введите новый пароль повторно"
                     name="passwordConfirm"
                     id='passwordConfirm'
                     onChange={e => setPasswordConfirm(e.target.value)} required/>
              <label htmlFor="passwordConfirm" className="form-label">Введите новый пароль повторно</label>
            </div>

            <div className='submit-btn-wrapper'>
              <button type="submit" className='btn' id='loginBtn'>
                <span>Сменить пароль</span>
              </button>
            </div>
          </div>
        </form>
        <GoBack/>

      </div>
    </div>
  );
}

export default ResetPassword;