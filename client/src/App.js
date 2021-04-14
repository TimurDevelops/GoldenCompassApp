import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import useToken from "./utils/useToken";
import Login from "./components/login/Login";
import Header from "./components/layout/Header";

import './App.css';
import Routes from "./components/routing/Routes";

function App() {
  const {token, setToken, unsetToken} = useToken();

  const logout = () => {
    unsetToken();
  }

  if (!token) {
    return <Login setToken={setToken} setUser={setToken}/>
  }

  return (
    <Router>
      <Fragment>
        <Header logout={logout}/>
        <Switch>
          {/* TODO Maybe make this path */}
          {/*<Route exact path="/" component={Landing} />*/}
          <Route component={Routes}/>
        </Switch>
      </Fragment>
    </Router>
  );
}

export default App;