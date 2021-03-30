import React from 'react';
import PropTypes from "prop-types";
import Logo from '../components/Logo';
import './Header.scss'

const Header = ({logout}) => {

  return (
    <header className='header'>
      <div className='logo'>
        <Logo/>
      </div>
      <button id='logoutBtn' onClick={logout}>Выйти</button>
    </header>
  )
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
}

export default Header;