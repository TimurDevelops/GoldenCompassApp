import React, {useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import {useUser} from "./hooks/useUser";

import Login from "./components/login/Login";
import TeacherMenu from "./components/teacherMenu/TeacherMenu";
import TeachersList from "./components/teachersList/TeachersList";

import StudentMenu from "./components/studentMenu/StudentMenu"
import PrivateRoute from "./components/ui/PrivateRoute";
import ClassRoom from "./components/classRoom/ClassRoom";
import ResetPassword from "./components/resetPassword/ResetPassword";
import {ErrorBoundary} from 'react-error-boundary';

import './App.css'
import './Common.scss'
import api from "./utils/api";

const App = () => {
  const {user, getUser} = useUser();

  const [auth, setAuth] = useState({user: user, isAuthenticated: Boolean(user && user.token), isLoading: false})

  const logout = () => {
    setAuth({user: undefined, isAuthenticated: false, isLoading: false});
  };

  const myErrorHandler = (error, componentStack) => {
    const user = getUser()
    api.post('/errors', {error, componentStack, user}).catch(console.error);

  };

  window.addEventListener("error", function (e) {
    const user = getUser()
    api.post('/errors', {error: e, componentStack: '', user}).catch(console.error);
  })

  return (
    <ErrorBoundary onError={myErrorHandler}>
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
                            logout={logout}/>
            }

            {/* Student Menu */}
            {auth.user && auth.user.type === 'student' &&
              <PrivateRoute exact path="/student"
                            component={StudentMenu}
                            auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}
                            logout={logout}/>
            }

            {/* Student Available Teachers */}
            {auth.user && auth.user.type === 'student' &&
              <PrivateRoute exact path="/teachers-list"
                            component={TeachersList}
                            auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}/>
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
    </ErrorBoundary>
  );
};

export default App;