import React, {useState} from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';

import {useUser} from "./hooks/useUser";

import Login from "./components/login/Login";
import TeacherMenu from "./components/teacherMenu/TeacherMenu";
import TeachersList from "./components/teachersList/TeachersList";

import ErrorFallback from "./components/ui/ErrorFallback"
import StudentMenu from "./components/studentMenu/StudentMenu"
import PrivateRoute from "./components/ui/PrivateRoute";
import ClassRoom from "./components/classRoom/ClassRoom";
import ResetPassword from "./components/resetPassword/ResetPassword";
import {ErrorBoundary} from 'react-error-boundary';

import "./App.css"
import "./Common.scss"
import api from "./utils/api";
// import {serverUrl} from './config.json';
// import io from 'socket.io-client'
const App = () => {
  const baseURL = process.env.PUBLIC_URL
  console.log(baseURL)
  // const socket = io(serverUrl);
  // let startTime;
  //
  // useEffect(() => {
  //   setInterval(function () {
  //     startTime = Date.now();
  //     socket.emit('ping');
  //   }, 2000);
  //
  //   socket.on('pong', function () {
  //     let latency = Date.now() - startTime;
  //     console.log(latency);
  //   });
  // }, [])

  const {user, getUser} = useUser();

  const [auth, setAuth] = useState({user: user, isAuthenticated: Boolean(user && user.token), isLoading: false})

  const logout = () => {
    setAuth({user: undefined, isAuthenticated: false, isLoading: false});
  };

  const myErrorHandler = (e, componentStack) => {
    const user = getUser()
    const message = e
    const stack = componentStack.componentStack || componentStack
    api.post('/errors', {error: message, componentStack: stack, user}).catch(console.error);
  };

  window.addEventListener("error", function (e) {
    const user = getUser()
    const message = e.error.message || e.message || e.error
    const componentStack = e.error.stack || ""
    api.post('/errors', {error: message, componentStack: componentStack, user}).catch(console.error);
  })

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={myErrorHandler}
    >
      <section className="container">
        <Router>
          <Switch>
            {/* Sign In Page */}
            <Route exact path={`${baseURL}/login`}
                   render={(props) =>
                     <Login {...props} setAuth={setAuth}/>
                   }/>

            {/* Teacher Menu */}
            {auth.user && auth.user.type === 'teacher' &&
              <PrivateRoute exact path={`${baseURL}/teacher`}
                            component={TeacherMenu}
                            auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}
                            logout={logout}/>
            }

            {/* Student Menu */}
            {auth.user && auth.user.type === 'student' &&
              <PrivateRoute exact path={`${baseURL}/student`}
                            component={StudentMenu}
                            auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}
                            logout={logout}/>
            }

            {/* Student Available Teachers */}
            {auth.user && auth.user.type === 'student' &&
              <PrivateRoute exact path={`${baseURL}/teachers-list`}
                            component={TeachersList}
                            auth={{isAuthenticated: auth.isAuthenticated, isLoading: auth.isLoading}}/>
            }

            {/* canvas will determine content by type and room */}
            <PrivateRoute exact path={`${baseURL}/canvas/:teacher`}
                          component={ClassRoom}
                          auth={auth}
                          user={auth.user}
                          logout={logout}/>

            {/* Reset pass word */}
            <PrivateRoute exact path={`${baseURL}/reset-password/:user/:type`}
                          component={ResetPassword}
                          auth={auth}
                          user={auth.user}
                          logout={logout}/>

            {/* 404 Page */}
            <Route path="*" render={
              () => {
                if (auth.isAuthenticated) {
                  if (auth.user.type === 'student') {
                    return <Redirect to={`${baseURL}/student`}/>
                  } else if (auth.user.type === 'teacher') {
                    return <Redirect to={`${baseURL}/teacher`}/>
                  } else {
                    return <Redirect to={`${baseURL}/login`}/>
                  }
                } else {
                  return <Redirect to={`${baseURL}/login`}/>
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