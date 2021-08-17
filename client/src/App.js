import React, {useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import Login from "./components/login/Login";
import TeacherMenu from "./components/teacherMenu/TeacherMenu";
import TeachersList from "./components/teachersList/TeachersList";

import StudentMenu from "./components/studentMenu/StudentMenu"
import PrivateRoute from "./components/ui/PrivateRoute";
import ClassRoom from "./components/classRoom/ClassRoom";
import ResetPassword from "./components/resetPassword/ResetPassword";

import './App.css'
import './Common.scss'

const App = () => {
  const [auth, setAuth] = useState({user: undefined, isAuthenticated: false, isLoading: false})


  const logout = () => {
    setAuth({user: undefined, isAuthenticated: false, isLoading: false});
  };

  return (
    <section className="container">
      <Router>
        <Switch>
          {/* Sign In Page */}
          <Route exact path="/login"
                 render={(props) =>
                   <Login {...props} setAuth={setAuth}/>
                 }/>

          {/* Teacher Menu */}
          {auth.user && auth.user.type === 'teacher' &&
          <PrivateRoute exact path="/teacher"
                        component={TeacherMenu}
                        auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}
                        user={auth.user}
                        logout={logout}/>
          }

          {/* Student Menu */}
          {auth.user && auth.user.type === 'student' &&
          <PrivateRoute exact path="/student"
                        component={StudentMenu}
                        auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}
                        user={auth.user}
                        logout={logout}/>
          }

          {/* Student Available Teachers */}
          {auth.user && auth.user.type === 'student' &&
          <PrivateRoute exact path="/teachers-list"
                        component={TeachersList}
                        auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}
                        student={auth.user}/>
          }

          {/* canvas will determine content by type and room */}
          <PrivateRoute exact path="/canvas/:teacher"
                        component={ClassRoom}
                        auth={auth}
                        user={auth.user}
                        logout={logout}/>

          {/* Reset pass word */}
          <PrivateRoute exact path="/reset-password/:user/:type"
                        component={ResetPassword}
                        auth={auth}
                        user={auth.user}
                        logout={logout}/>

          {/* 404 Page */}
          <Route path="*" render={
            () => {
              if (auth.isAuthenticated) {
                if (auth.user.type === 'student') {
                  return <Redirect to="/student"/>
                } else if (auth.user.type === 'teacher') {
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