import React from 'react';
import { toast } from 'react-toastify';
import { withRouter, Redirect } from 'react-router';
import { AuthContext } from '../container/Auth';
import { useCallback } from 'react/cjs/react.development';
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';

const VerifyAccount = ({ history }) => {
  const auth = getAuth();
  const { currentUser } = useCallback(AuthContext);

  const verifyAccountEmail = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.location.search.split('&')[0].split('=')[1];
      if (!email) {
        window.location.assign('/login');
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.location.assign('/login');
        })
        .catch((error) => {
          toast(error.message);
        });
    }
  };

  return !currentUser || !currentUser.emailVerified ? (
    <div className='container-sm vh-100'>
      <div className='d-flex justify-content-center h-100 w-60 align-items-center'>
        <div
          className='d-flex align-items-center flex-column'
          style={{ width: '60%' }}
        >
          <h1 className='mb-5'>Click to verify your account</h1>
          <button className='btn btn-primary' onClick={verifyAccountEmail}>
            Verify
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to='/' />
  );
};

export default withRouter(VerifyAccount);
