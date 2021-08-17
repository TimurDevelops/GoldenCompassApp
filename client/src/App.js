import React, {useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import Alert from "./components/ui/Alert";

import Login from "./components/login/Login";
import TeacherMenu from "./components/teacherMenu/TeacherMenu";
import TeachersList from "./components/teachersList/TeachersList";

import StudentMenu from "./components/studentMenu/StudentMenu"
import PrivateRoute from "./components/ui/PrivateRoute";
import ClassRoom from "./components/classRoom/ClassRoom";
import ResetPassword from "./components/resetPassword/ResetPassword";

import {useAlerts} from "./hooks/useAlerts";
import {useUser} from "./hooks/useUser";

import './App.css'
import './Common.scss'
// import Spinner from "./components/ui/Spinner";

const App = () => {
  const {user, unsetUser} = useUser()
  console.log(user)
  const {alerts} = useAlerts()

  const [auth, setAuth] = useState({isAuthenticated: Boolean(user && user.token), isLoading: false});

  // if (!user) {
  //   return <div><Spinner/></div>
  // }

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
                   <Login {...props} setAuth={setAuth}/>
                 }/>

          {/* Teacher Menu */}
          {user && user.type === 'teacher' &&
          <PrivateRoute exact path="/teacher" component={TeacherMenu} auth={auth} user={user} logout={logout}/>
          }

          {/* Student Menu */}
          {user && user.type === 'student' &&
          <PrivateRoute exact path="/student" component={StudentMenu} auth={auth} user={user} logout={logout}/>
          }

          {/* Student Available Teachers */}
          {user && user.type === 'student' &&
          <PrivateRoute exact path="/teachers-list" component={TeachersList} auth={auth} student={user}/>
          }

          {/* canvas will determine content by type and room */}
          <PrivateRoute exact path="/canvas/:teacher"
                        component={ClassRoom}
                        auth={auth}
                        user={user}
                        logout={logout}/>

          {/* Reset pass word */}
          <PrivateRoute exact path="/reset-password/:user/:type"
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