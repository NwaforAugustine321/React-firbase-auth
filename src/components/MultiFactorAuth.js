import React from 'react';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { withRouter } from 'react-router';
import { useParams } from 'react-router';
import { AuthContext } from '../container/Auth';
import {
  PhoneAuthProvider,
  multiFactor,
  PhoneMultiFactorGenerator,
  getMultiFactorResolver,
  getAuth,
} from 'firebase/auth';
import { Redirect } from 'react-router';

const AccountOTPVerification = ({ history }) => {
  const params = useParams();
  const { vfid, type } = params;
  const { currentUser } = useContext(AuthContext);

  const handleOTp = (event) => {
    event.preventDefault();
    const { code } = event.target.elements;
    verifyOtp(code);
  };

  const verifyOtp = async (code) => {
    try {
      const cred = PhoneAuthProvider.credential(vfid, code.value);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

      if (type === 'login') {
        const resolver = getMultiFactorResolver(
          getAuth(),
          JSON.parse(window.localStorage.getItem('sessionErrorResolver'))
        );
        await resolver.resolveSignIn(multiFactorAssertion);
        window.location.assign('/');
      } else {
        await multiFactor(currentUser).enroll(
          multiFactorAssertion,
          currentUser.displayName
        );
        window.location.assign('/');
      }
    } catch (error) {
      toast(error.message);
    }
  };

  return !currentUser || !currentUser.emailVerified ? (
    <Redirect to='/login' />
  ) : (
    <div className='container-sm vh-100'>
      <div className='d-flex justify-content-center h-100 w-60 align-items-center'>
        <div
          className='d-flex align-items-center flex-column'
          style={{ width: '60%' }}
        >
          <h1>Verify Account</h1>

          <form style={{ width: '60%' }} onSubmit={handleOTp}>
            <input
              type='text'
              className='form-control mb-3'
              id='code'
              placeholder={'otp-code'}
            />

            <button className='btn btn-primary' id='verify' type='submit'>
              Verify
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(AccountOTPVerification);
