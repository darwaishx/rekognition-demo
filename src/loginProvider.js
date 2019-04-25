import { AuthenticationDetails, CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';
import { AWS_REGION, COGNITO_ID_POOL, COGNITO_USER_POOL, COGNITO_CLIENT_ID } from './config.json';
import AWS, { setCredentials } from './aws/aws';

import cached from './utils/cached';

import store from './store';

const pool = new CognitoUserPool({
  UserPoolId: COGNITO_USER_POOL,
  ClientId: COGNITO_CLIENT_ID
});

let user;

const userCallbackMap = {
  onSuccess(result) {
    getCredentials();
  },

  onFailure(err) {
    console.error(err);
    store.dispatch(setLoginState('NOT_LOGGED_IN'));
    store.dispatch(setLoginError(err.message));
  },

  newPasswordRequired(userAttributes, requiredAttributes) {
    store.dispatch(setLoginState('RESET_PASSWORD'));
  }
}




// ACTIONS

function logOut() {
  return async dispatch => {
    user.signOut();
    localStorage.clear();
    await cached.clearAll();

    dispatch(setLoginState('NOT_LOGGED_IN'));

    // TODO ugly hack: reload the whole page.
    // because otherwise the aws service clients are still around
    window.location.reload();
  }
}

function setLoginError(message) {
  return {
    type: 'SET_LOGIN_ERROR',
    message
  };
}

function setLoginState(state) {
  return {
    type: 'SET_LOGIN_STATE',
    state
  };
}

function setReadOnly(state) {
  return {
    type: 'SET_READ_ONLY',
    readOnly: state
  }
}

function submitLogin(username, password) {
  return dispatch => {
    dispatch(setLoginError(null));
    dispatch(setLoginState('SUBMITTING'));

    if (!user) {
      user = new CognitoUser({
        Username: username,
        Pool: pool
      });
    }

    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    user.authenticateUser(authDetails, userCallbackMap)
  }
}

function submitPasswordReset(newPassword) {
  return dispatch => {
    dispatch(setLoginState('SUBMITTING'));

    user.completeNewPasswordChallenge(newPassword, {}, userCallbackMap)
  }
}





// Helpers and other bits

function getSession(cb) {
  if (!user) {
    user = pool.getCurrentUser();
  }

  if (!user) {
    store.dispatch(setLoginState('NOT_LOGGED_IN'));
    return;
  }

  user.getSession((err, res) => {
    if (err || !res.isValid()) {
      store.dispatch(setLoginState('NOT_LOGGED_IN'));
      return;
    }

    cb(null, res);
  });
}

// TODO handle refreshes
function getCredentials() {
  store.dispatch(setLoginState('LOADING'));

  getSession((err, res) => {
    const idToken = res.getIdToken();

    const params = {
      IdentityPoolId: COGNITO_ID_POOL,
      Logins: {
        [`cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL}`]: idToken.getJwtToken()
      }
    };

    console.log(idToken.payload);

    const groups = idToken.payload['cognito:groups'] || [];

    // TODO assert groups?

    store.dispatch(setReadOnly(!groups.includes('admin')))

    const creds = new AWS.CognitoIdentityCredentials(params, { region: AWS_REGION });
    setCredentials(creds);

    creds.get((err) => {
      if (err) console.error(err);
      // TODO handle err;
      store.dispatch(setLoginState('LOGGED_IN'));
    });
  });
}


export {
  getCredentials as init
};

export const actions = {
  submitLogin,
  submitPasswordReset,
  logOut
};
