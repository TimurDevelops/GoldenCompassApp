import React from "react";
import { Link } from 'react-router-dom';
// import PropTypes from "prop-types";

import './MenuItem.scss'

const MenuItem = ({link, label}) => {
  return (
    <div className={"MenuWrapper"}>
      <Link to={link}>{label}</Link>
    </div>
  )
}

// TeacherItem.propTypes = {
//   teacher: PropTypes.object
// }

export default MenuItem;