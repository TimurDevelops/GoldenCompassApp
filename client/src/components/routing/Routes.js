import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Canvas from "../canvas/Canvas";
import PrivateRoute from "./PrivateRoute";
import Login from "../login/Login";
import TeacherMenu from "../teacherMenu/TeacherMenu";
import TeachersList from "../teacherList/TeachersList";

const Routes = () => {
  return (
    <section className="container">
      <Switch>
        {/* Sign In Page */}
        <Route exact path="/login" component={Login}/>

        {/* Teacher Menu */}
        <PrivateRoute exact path="/teacher" component={TeacherMenu} auth={}/>

        {/* TODO Links for teachers */}
        {/*<PrivateRoute exact path="/teacher/note" component={}/>*/}

        {/* Student Available Teachers */}
        <PrivateRoute exact path="/student" component={TeachersList} auth={}/>

        {/* Canvas will determine content by type and room */}
        <PrivateRoute exact path="/canvas/:room" component={Canvas} auth={}/>

        {/* TODO 404 */}
        {/*<Route component={NotFound} />*/}
      </Switch>
    </section>
  );
};

export default Routes;