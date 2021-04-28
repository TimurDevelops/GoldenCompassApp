import React from 'react';
import PropTypes from 'prop-types';

const Alert = ({alerts}) => {
  return (
    alerts.map((alert) => (
      <div key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </div>
    ))
  )
}


Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};


export default Alert;