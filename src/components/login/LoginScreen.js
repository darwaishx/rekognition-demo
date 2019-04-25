import React from 'react';
import { connect } from 'react-redux';

import LoginForm from './LoginForm';
import PasswordResetForm from './PasswordResetForm';
import Spinner from '../shared/Spinner';

import s from './LoginScreen.module.css';

function LoginScreen({ loginState }) {
  return (
    <div className={s.base}>
      {loginState === 'NOT_LOGGED_IN' ?
        <LoginForm />
      : null}

      {loginState === 'RESET_PASSWORD' ?
        <PasswordResetForm />
      : null}

      <Spinner color="light" shouldSpin={loginState === 'SUBMITTING' || loginState === 'LOADING'} />
    </div>
  )
}

export default connect(
  state => ({
    loginState: state.login.state
  })
)(LoginScreen)
