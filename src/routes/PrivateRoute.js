import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const userAuth = useSelector((state) => state.auth);

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        userAuth.status === 'ACTIVE' && userAuth.user.emailVerified ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'/login'} />
        )
      }
    />
  );
};

export default PrivateRoute;
