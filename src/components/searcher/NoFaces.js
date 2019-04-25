import React from 'react';
import { connect } from 'react-redux';

import { clearSearcher } from '../../actions/search';

import Button from '../shared/Button';

import s from './NoFaces.module.css';

function NoFaces({
  reset
}) {
  return (
    <div className={s.base}>
      <span>No faces detected</span>
      <Button onClick={reset}>Try a different image</Button>
    </div>
  )
}

export default connect(
  null,
  dispatch => ({
    reset: () => dispatch(clearSearcher())
  })
)(NoFaces);
