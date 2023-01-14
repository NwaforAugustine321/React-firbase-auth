import React from 'react';
import { useStore } from 'react-redux';
import { getAuth } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/store';

const Home = () => {
  const dispatch = useDispatch();
  const userAuth = useStore().getState();

  const currentUser = userAuth.auth.user;

  return (
    <div className='container-sm vh-100'>
      <div className='d-flex justify-content-center h-100 w-60 align-items-center'>
        <div
          className='d-flex align-items-center flex-column'
          style={{ width: '60%' }}
        >
          <h1>Home</h1>

          <form style={{ width: '60%' }}>
            <fieldset className='mb-3' disabled={true}>
              <input
                disabled={true}
                type='text'
                className='form-control mb-3'
                placeholder={currentUser.displayName}
              />

              <input
                disabled={true}
                type='email'
                className='form-control'
                placeholder={currentUser.email}
              />
            </fieldset>

            <button
              className='btn btn-primary'
              type='button'
              onClick={() => {
                dispatch(
                  updateUser({
                    status: 'UnAuthorize',
                    user: {
                      displayName: '',
                      email: '',
                      emailVerified: '',
                    },
                  })
                );
                getAuth().signOut();
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
