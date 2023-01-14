import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import React, { useCallback, useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  sendSignInLinkToEmail,
} from 'firebase/auth';

const SignUp = ({ history }) => {
  const [isFetching, setIsFetching] = useState(false);

  const handleSignUp = useCallback(async (event) => {
    event.preventDefault();
    setIsFetching(true);

    const { email, password, userName } = event.target.elements;

    try {
      await createUserWithEmailAndPassword(
        getAuth(),
        email.value.toLowerCase(),
        password.value
      ).then(async (response) => {
        await updateProfile(response.user, {
          displayName: userName.value,
        });

        const actionCodeSettings = {
          url: `https://react-firebase-auth-task.vercel.app/verify?email=${email.value.toLowerCase()}`,
          handleCodeInApp: true,
        };

        sendSignInLinkToEmail(
          getAuth(),
          email.value.toLowerCase(),
          actionCodeSettings
        )
          .then(() => {
            toast('Verification email sent');
          })
          .catch((error) => {
            toast(error.message);
             setIsFetching(false);
          });
      });
      setIsFetching(false);
    } catch (error) {
      toast(error.message);
    }
  }, []);

  return (
    <div className='container-sm vh-100'>
      <div className='d-flex justify-content-center h-100 w-60 align-items-center'>
        <div
          className='d-flex align-items-center flex-column'
          style={{ width: '60%' }}
        >
          <h1 className='mb-5'>Sign up</h1>

          <form onSubmit={handleSignUp} style={{ width: '60%' }}>
            <div
              className='d-flex gap-2 justify-content-between'
              style={{ width: '100%' }}
            >
              <label
                htmlFor='userName'
                className='form-label d-block mb-3'
                style={{ width: '50%' }}
              >
                UserName
                <input
                  type='text'
                  id='userName'
                  className='form-control'
                  placeholder='UserName'
                />
              </label>

              <label
                htmlFor='email'
                className='form-label  d-block mb-3'
                style={{ width: '50%' }}
              >
                Email
                <input
                  type='email'
                  id='email'
                  className='form-control'
                  placeholder='Email'
                />
              </label>
            </div>

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

            <button
              type='submit'
              className='btn btn-primary'
              id='signup-button'
            >
              {isFetching ? (
                <div className='spinner-border' role='status'></div>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(SignUp);
