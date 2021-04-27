import React, {Fragment, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import useUser from "./utils/useUser";
import Login from "./components/login/Login";
import Header from "./components/layout/Header";

import './App.css';
import Routes from "./components/routing/Routes";

function App() {
  const {user, setUser, unsetUser} = useUser();
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    unsetUser();
  }

  if (!user || !user.token) {
    return <Login setToken={setUser} setIsLoading={setIsLoading} setUser={setUser}/>
  }

  return (
    <Router>
      <Fragment>
        <Header logout={logout}/>
        <Switch>
          {/* TODO Maybe make this path */}
          {/*<Route exact path="/" component={Landing} />*/}
          <Route component={<Routes isLoading={isLoading} />}/>
        </Switch>
      </Fragment>
    </Router>
  );
}

export default App;