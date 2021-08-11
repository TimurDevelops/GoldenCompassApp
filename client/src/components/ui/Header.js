import React from 'react';
import PropTypes from "prop-types";
import {FaSignOutAlt} from "react-icons/all";

import './Header.scss'
import logo from "../../img/logo.png";

const Header = ({logout}) => {

  return (
    <header className='header'>
      <div className='logo'>
        <div className='logo-icon'>
          <img src={logo} alt="Золотой компас"/>
        </div>
      </div>
      <div className={'logout'}>
        <div id='logoutBtn' onClick={logout}>
          <FaSignOutAlt/>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
}

export default Header;