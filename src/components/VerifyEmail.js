import React from 'react';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';

const VerifyAccount = ({ history }) => {
  const auth = getAuth();

  const verifyAccountEmail = () => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.location.search.split('&')[0].split('=')[1];
      if (!email) {
        history.push('/login');
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          history.push('/login');
        })
        .catch((error) => {
          toast(error.message);
        });
    }
  };

  return (
    <div className='container-sm vh-100'>
      <div className='d-flex justify-content-center h-100 w-60 align-items-center inner-container'>
        <div
          className='d-flex align-items-center flex-column inner-container'
          style={{ width: '60%' }}
        >
          <h1 className='mb-5'>Click to verify your account</h1>
          <button className='btn btn-primary' onClick={verifyAccountEmail}>
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

export default withRouter(VerifyAccount);
