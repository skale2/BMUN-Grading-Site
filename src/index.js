import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Base from './components/Base'
import GradeList from './components/GradeList';
import GradeDetail from './components/GradeDetail';
import DelegationList from './components/DelegationList';
import DelegationDetail from './components/DelegationDetail';

import "./css/index.css";
import Welcome from './components/Welcome';

import backend from "./backend";

ReactDOM.render(
  <main>
    <BrowserRouter>
      <Switch>
        <Route path="/welcome" render={() => 
          !backend.isSignedIn ? <Welcome /> : 
            <Redirect to='/grade' />
        }/>
        <Route 
          path="/grade/:delegation"
          render={({ match: { params: { delegation } }, location: { pathname } }) => 
            !backend.isSignedIn ? 
              <Redirect to={{ pathname: "/welcome", state: { from: pathname } }} /> 
            : 
              <Base page="grade"> 
                <GradeDetail delegation={delegation}/>
              </Base>
          }
        />
        <Route 
          path="/grade"
          render={({ location: { pathname } }) => 
            !backend.isSignedIn ? 
              <Redirect to={{ pathname: "/welcome", state: { from: pathname } }} /> 
            : 
              <Base page="grade"> 
                <GradeList/>
              </Base>
          }
        />
        <Route 
          path="/delegations/:delegation"
          render={({ match : { params: { delegation } }, location: { pathname } }) => 
            !backend.isSignedIn ? 
              <Redirect to={{ pathname: "/welcome", state: { from: pathname } }} /> 
            : 
              <Base page="delegations"> 
                <DelegationDetail delegation={delegation}/> 
              </Base>
          }
        />
        <Route 
          path="/delegations"
          render={({ location: { pathname } }) => 
            !backend.isSignedIn ? 
              <Redirect to={{ pathname: "/welcome", state: { from: pathname } }} /> 
            : 
              <Base page="delegations"> 
                <DelegationList/> 
              </Base>
          }
        />
        <Route exact path="/" render={() => 
          !backend.isSignedIn ? <Welcome /> : 
            <Redirect to='/grade' />
        }/>
      </Switch>
    </BrowserRouter>
  </main>,
  document.getElementById('root')
);
