import React from 'react';
import { connect } from 'react-redux';
import { updateHash } from '../../actions/routing';
import getHeaderTitle from '../../selectors/getHeaderTitle';
import { actions as loginActions } from '../../loginProvider';

import Button from './Button';

import s from './HeaderBar.module.css';

function HeaderBar({
  route,
  title,
  readOnly,
  logout
}) {
  return (
    <div className={s.base}>
      { route === ''
        ? <div className={s.logo} />
        : <Button Component="a" href="#">&larr; Back</Button>
      }
      { route === 'collection' ?
        <div className={s.homeButtons}>
          { !readOnly ?
            <Button Component="a" href="#upload">Add to Collection&hellip;</Button>
          : null }
          <Button Component="a" href="#recognize">Recognize Faces</Button>
        </div>
      : null }
      { title ? <span className={s.title}>{title}</span> : null}

      { route === '' ?
        <Button onClick={logout}>Log out</Button>
      : null}
    </div>
  )
}


export default connect(
  state => ({
    route: state.routing.hash,
    title: getHeaderTitle(state),
    readOnly: state.login.readOnly
  }),
  dispatch => ({
    goHome: () => dispatch(updateHash('')),
    logout: () => dispatch(loginActions.logOut())
  })
)(HeaderBar)
