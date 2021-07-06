/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import List from '../pages/List';

function Routes() {
  return (
    <Router>
      <Switch>
        <PublicRoute exact path="/">
          <List />
        </PublicRoute>
      </Switch>
    </Router>
  );
}
export default Routes;

// Define public Route

function PublicRoute({ children, ...rest }) {
  const login = localStorage.getItem('login') === 'true';
  return (
    <Route
      {...rest}
      render={({ location }) =>
        login ? (
          <Redirect
            to={{
              pathname: '/Dashboard',
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
}

// Define Private Route
function PrivateRoute({ children, ...rest }) {
  const login = localStorage.getItem('login') === 'true';
  return (
    <Route
      {...rest}
      render={({ location }) =>
        login ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
