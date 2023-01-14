import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import { useDispatch } from 'react-redux';
import { AuthContext } from '../container/Auth';
import { updateUser } from '../store/store';
import React, { useContext, useState, useEffect } from 'react';

import {
  getAuth,
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  multiFactor,
  getMultiFactorResolver,
  PhoneMultiFactorGenerator,
} from 'firebase/auth';

const Login = ({ history }) => {
  const auth = getAuth();
  const dispatch = useDispatch();

  const [reload, setReload] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    setRecaptchaVerifier(
      new RecaptchaVerifier(
        'recaptcha-container-id',
        {
          size: 'invisible',
          callback: function(response) {},
        },
        auth
      )
    );
    setReload(false);
  }, [reload, auth]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsFetching(true);
    const { email, password } = event.target.elements;

    try {
      await signInWithEmailAndPassword(
        auth,
        email.value.toLowerCase(),
        password.value
      );
      handleOtpSession(currentUser);
      setIsFetching(false);
    } catch (error) {
      if (error.code === 'auth/multi-factor-auth-required') {
        const resolver = getMultiFactorResolver(auth, error);

        if (
          resolver.hints[0].factorId === PhoneMultiFactorGenerator.FACTOR_ID
        ) {
          const phoneAuthProvider = new PhoneAuthProvider(auth);

          const phoneInfoOptions = {
            multiFactorHint: resolver.hints[0],
            session: resolver.session,
          };

          const id = await phoneAuthProvider.verifyPhoneNumber(
            phoneInfoOptions,
            recaptchaVerifier
          );

          dispatch(
            updateUser({
              status: 'OPT-PROCESSING',
              user: {
                displayName: '',
                email: '',
                emailVerified: '',
              },
            })
          );

          window.location.assign(`/otp/${id}/login`);

          window.localStorage.setItem(
            'sessionErrorResolver',
            JSON.stringify(error)
          );

          recaptchaVerifier.clear();
        } else {
          // Unsupported second factor.
        }
      } else if (error.code === 'auth/wrong-password') {
        toast('Wrong password or email');
      } else {
        toast(error.message);
      }
      setIsFetching(false);
    }
  };

  const handleOtpSession = async (user) => {
    try {
      const multiFactorSession = await multiFactor(user).getSession();
      const phoneAuthProvider = new PhoneAuthProvider(auth);

      const phoneInfoOptions = {
        phoneNumber: '+23407031045066',
        session: multiFactorSession,
      };

      const id = await phoneAuthProvider.verifyPhoneNumber(
        phoneInfoOptions,
        recaptchaVerifier
      );

      dispatch(
        updateUser({
          status: 'OPT-PROCESSING',
          user: {
            displayName: '',
            email: '',
            emailVerified: '',
          },
        })
      );
      window.location.assign(`/otp/${id}/signup`);
      recaptchaVerifier.clear();
      setReload(true);
    } catch (error) {
      toast(error.message);
    }
  };

  const handleRedirect = () => {
    window.location.assign(`/signup`);
  };

  return (
    <div className='container-sm vh-100'>
      <div className='d-flex justify-content-center h-100 w-60 align-items-center'>
        <div
          className='d-flex align-items-center flex-column'
          style={{ width: '60%' }}
        >
          <h1 className='mb-5'>Login</h1>

          <form onSubmit={handleLogin} style={{ width: '60%' }}>
            <label htmlFor='email' className='form-label mw-100 d-block mb-3'>
              Email
              <input
                type='email'
                id='email'
                className='form-control'
                placeholder='Email'
              />
            </label>

            <label
              htmlFor='password'
              className='form-label mw-100 d-block mb-3'
            >
              Password
              <input
                type='password'
                id='password'
                className='form-control'
                placeholder='Password'
              />
            </label>

            <div className='d-flex gap-1'>
              <button
                type='submit'
                className='btn btn-primary'
                id='login_button'
              >
                {isFetching ? (
                  <div className='spinner-border' role='status'></div>
                ) : (
                  'Login'
                )}
              </button>
              <button
                type='button'
                onClick={() => {
                  handleRedirect();
                }}
                className='btn btn-primary'
              >
                SignUp
              </button>
            </div>
          </form>
          <div id='recaptcha-container-id'></div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
