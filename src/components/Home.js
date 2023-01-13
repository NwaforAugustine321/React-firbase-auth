import React from 'react';
import app from '../firbaseConfig';
import { useContext } from 'react';
import { AuthContext } from '../container/Auth';

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className='container-sm vh-100'>
      <div className='d-flex justify-content-center h-100 w-60 align-items-center'>
        <div
          className='d-flex align-items-center flex-column'
          style={{ width: '60%' }}
        >
          <h1>Home</h1>

          <form style={{ width: '60%' }}>
            <fieldset disabled className='mb-3'>
              <input
                disable={true}
                type='text'
                className='form-control mb-3'
                placeholder={currentUser.displayName}
              />

              <input
                disable={true}
                type='email'
                className='form-control'
                placeholder={currentUser.email}
              />
            </fieldset>

            <button
              className='btn btn-primary'
              onClick={() => app.auth().signOut()}
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
