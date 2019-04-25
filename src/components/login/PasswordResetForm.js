import React from 'react';
import { connect } from 'react-redux';

import { actions as loginActions } from '../../loginProvider';

import Button from '../shared/Button';

function PasswordResetForm({ submitPasswordReset }) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        submitPasswordReset(
          e.target.querySelector('[name="password"]').value
        )
      }}
    >
      <p>Create a password for your account</p>

      <label>
        <span>New password:</span>
        <input type="password" name="password" />
      </label>

      <label>
        <span>Confirm new password:</span>
        <input type="password" name="confirm_password" />
      </label>

      <Button type="submit">Set password</Button>
    </form>
  )
}

export default connect(
  state => ({
    // TODO errors
  }),
  dispatch => ({
    submitPasswordReset: (username, password) => dispatch(loginActions.submitPasswordReset(username, password))
  })
)(PasswordResetForm);
