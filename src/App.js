import React from 'react';
import { store } from './store/store';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import VerifyAccount from './components/VerifyEmail';
import { Provider } from 'react-redux';
import { AuthProvider } from './container/Auth';
import PrivateRoute from './routes/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import AccountOTPVerification from './components/MultiFactorAuth';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <PrivateRoute exact path='/' component={Home} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/signup' component={SignUp} />
          <Route
            exact
            path='/otp/:vfid/:type'
            component={AccountOTPVerification}
          />
          <Route exact path='/verify*' component={VerifyAccount} />
        </Router>
        <ToastContainer />
      </AuthProvider>
    </Provider>
  );
};

export default App;
