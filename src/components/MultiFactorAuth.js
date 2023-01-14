import React from 'react';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router';
import { useParams } from 'react-router';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/store';
import { useSelector } from 'react-redux';
import {
  PhoneAuthProvider,
  multiFactor,
  PhoneMultiFactorGenerator,
  getMultiFactorResolver,
  getAuth,
} from 'firebase/auth';

const AccountOTPVerification = ({ history }) => {
  const auth = getAuth();
  const params = useParams();
  const { vfid, type } = params;
  const userAuth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

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
          auth,
          JSON.parse(window.localStorage.getItem('sessionErrorResolver'))
        );
        await resolver.resolveSignIn(multiFactorAssertion);
        dispatch(
          updateUser({
            status: 'ACTIVE',
            user: {
              displayName: auth.currentUser.displayName,
              email: auth.currentUser.email,
              emailVerified: auth.currentUser.emailVerified,
            },
          })
        );
        history.push('/');
      } else {
        await multiFactor(auth.currentUser).enroll(
          multiFactorAssertion,
          userAuth.user.displayName
        );
        dispatch(
          updateUser({
            status: 'ACTIVE',
            user: {
              displayName: auth.currentUser.displayName,
              email: auth.currentUser.email,
              emailVerified: auth.currentUser.emailVerified,
            },
          })
        );
        history.push('/');
      }
    } catch (error) {
      toast(error.message);
    }
  };

  return (
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
