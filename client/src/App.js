import React, {useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import useUser from "./utils/useUser";

import Alert from "./components/ui/Alert";

import Login from "./components/login/Login";
import TeacherMenu from "./components/teacherMenu/TeacherMenu";
import TeachersList from "./components/teachersList/TeachersList";

import StudentMenu from "./components/studentMenu/StudentMenu"
import PrivateRoute from "./components/ui/PrivateRoute";
import ClassRoom from "./components/classRoom/ClassRoom";
import ResetPassword from "./components/resetPassword/ResetPassword";
import {v4 as uuidv4} from 'uuid';

import './App.css'

const App = () => {
  const {user, setUser, unsetUser} = useUser()
  const [auth, setAuth] = useState({isAuthenticated: Boolean(user && user.token), isLoading: false});
  const [alerts, setAlerts] = useState([])

  const setAlert = (msg, alertType, timeout = 5000) => {
    const id = uuidv4();
    setAlerts([...alerts, {msg, alertType, id}])

    setTimeout(() => removeAlert(id), timeout);
  };

  function removeAlert(id) {
    setAlerts(alerts => alerts.filter((alert) => alert.id !== id));
  }

  const logout = () => {
    unsetUser();
    setAuth({isAuthenticated: false, isLoading: false});
  };
  return (
    <section className="container">
      <Alert alerts={alerts}/>
      <Router>
        <Switch>
          {/* Sign In Page */}
          <Route exact path="/login"
                 render={(props) =>
                   <Login {...props} setAuth={setAuth} setAlert={setAlert} setUser={setUser} auth={auth}/>
                 }/>
          {/* Teacher Menu */}
          {user && user.type === 'teacher' &&
          <PrivateRoute exact path="/teacher" component={TeacherMenu} auth={auth} user={user} logout={logout}/>
          }

          {/* Student Available Teachers */}
          {user && user.type === 'student' &&
          <PrivateRoute exact path="/student" component={StudentMenu} auth={auth} user={user} logout={logout}/>
          }

          {/* Student Available Teachers */}
          {user && user.type === 'student' &&
          <PrivateRoute exact path="/teachers-list" component={TeachersList} auth={auth} student={user}/>
          }

          {/* canvas will determine content by type and room */}
          <PrivateRoute exact path="/canvas/:teacher"
                        setAlert={setAlert}
                        component={ClassRoom}
                        auth={auth}
                        user={user}
                        logout={logout}/>

          {/* Reset pass word */}
          <PrivateRoute exact path="/reset-password/:user/:type"
                        setAlert={setAlert}
                        component={ResetPassword}
                        auth={auth}
                        user={user}
                        logout={logout}/>

          {/* 404 Page */}
          <Route path="*" render={
            () => {
              if (auth.isAuthenticated) {
                if (user.type === 'student') {
                  return <Redirect to="/student"/>
                } else if (user.type === 'teacher') {
                  return <Redirect to="/teacher"/>
                } else {
                  return <Redirect to="/login"/>
                }
              } else {
                return <Redirect to="/login"/>
              }
            }
          }/>
        </Switch>
      </Router>
    </section>
  );
};

export default App;