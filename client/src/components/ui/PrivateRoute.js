import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from "./Spinner";

const PrivateRoute = ({component: Component, auth: {isAuthenticated, isLoading}, ...rest}) => {

  return (
    <Route
      {...rest}
      render={props =>
        isLoading ? (
          <Spinner/>
        ) : isAuthenticated ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect to="/login"/>
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

export default PrivateRoute;
