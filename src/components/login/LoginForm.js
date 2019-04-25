import React from 'react';
import { connect } from 'react-redux';

import { actions as loginActions } from '../../loginProvider';

import Button from '../shared/Button';

function LoginForm({ submitLogin }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        submitLogin(
          e.target.querySelector('[name="username"]').value,
          e.target.querySelector('[name="password"]').value
        )
      }}
    >
      <label>
        <span>Username:</span>
        <input type="text" name="username" />
      </label>
      <label>
        <span>Password:</span>
        <input type="password" name="password" />
      </label>

      <Button type="submit">Login</Button>
    </form>
  )
}

export default connect(
  state => ({
    // TODO errors
  }),
  dispatch => ({
    submitLogin: (username, password) => dispatch(loginActions.submitLogin(username, password))
  })
)(LoginForm);
