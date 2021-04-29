import React, {useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
// TODO restructure components folder
import useUser from "./utils/useUser";

import Alert from "./components/layout/Alert";

import Login from "./components/login/Login";
import TeacherMenu from "./components/teacherMenu/TeacherMenu";
import TeachersList from "./components/teachersList/TeachersList";

import StudentMenu from "./components/studentMenu/StudentMenu"
import PrivateRoute from "./components/routing/PrivateRoute";
import Canvas from "./components/canvas/Canvas";
import {v4 as uuidv4} from 'uuid';

const Routes = () => {
  const {user, setUser} = useUser()
  const [isLoading, setIsLoading] = useState(true);
  const auth = {isAuthenticated: Boolean(user && user.token), isLoading};
  const [alerts, setAlerts] = useState([])

  const setAlert = (msg, alertType, timeout = 5000) => {
    const id = uuidv4();
    setAlerts([...alerts, {msg, alertType, id}])

    setTimeout(() => removeAlert(id), timeout);
  };

  function removeAlert(id) {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  }

  return (
    <section className="container">
      <Alert alerts={alerts}/>
      <Router>
        <Switch>
          {/* Sign In Page */}
          <Route exact path="/login"
                 render={(props) =>
                   <Login {...props} setIsLoading={setIsLoading} setAlert={setAlert} setUser={setUser}/>
                 }/>
          {/* Teacher Menu */}
          <PrivateRoute exact path="/teacher" component={TeacherMenu} auth={auth}/>

          {/* TODO Links for teachers */}
          {/*<PrivateRoute exact path="/teacher/note" component={}/>*/}

          {/* Student Available Teachers */}
          <PrivateRoute exact path="/student" component={StudentMenu} auth={auth} student={user}/>

          {/* Student Available Teachers */}
          <PrivateRoute exact path="/teachers-list" component={TeachersList} auth={auth} student={user}/>

          {/* Canvas will determine content by type and room */}
          <PrivateRoute exact path="/canvas/:room" component={Canvas} auth={auth}/>

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

export default Routes;