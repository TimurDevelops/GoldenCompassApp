import React from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

import './MenuItem.scss'

const MenuItem = ({link, label}) => {
  return (
    <Link to={link}>{label}</Link>
  )
}

MenuItem.propTypes = {
  link: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}

export default MenuItem;