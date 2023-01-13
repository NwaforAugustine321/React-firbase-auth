import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router';
import { AuthContext } from '../container/Auth.js';
import { toast } from 'react-toastify';
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
  const [reload, setReload] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);

  useEffect(() => {
    setRecaptchaVerifier(
      new RecaptchaVerifier(
        'recaptcha-container-id',
        {
          size: 'invisible',
          callback: function (response) {},
        },
        auth
      )
    );
    setReload(false);
  }, [reload, auth]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    try {
      await signInWithEmailAndPassword(
        auth,
        email.value.toLowerCase(),
        password.value
      );
      handleOtpSession(currentUser);
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

          history.push(`/otp/${id}/login`);
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
      }
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

      history.push(`/otp/${id}/signup`);
      recaptchaVerifier.clear();
      setReload(true);
    } catch (error) {
      toast(error.message);
    }
  };

  const handleRedirect = () => {
    history.push('/signup');
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
                Login
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
