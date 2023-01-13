import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerifyAccount from './components/VerifyEmail';
import AccountOTPVerification from './components/MultiFactorAuth';
import { AuthProvider } from './container/Auth';
import PrivateRoute from './routes/PrivateRoute';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <PrivateRoute exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={SignUp} />
          <Route
            exact
            path='/otp/:vfid/:type'
            component={AccountOTPVerification}
          />
          <Route exact path='/verify*' component={VerifyAccount} />
        </div>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
