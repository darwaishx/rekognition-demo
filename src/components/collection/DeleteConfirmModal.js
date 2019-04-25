import React from 'react';
import { connect } from 'react-redux';

import Button from '../shared/Button';

import { setDeleteConfirmFace, deleteFace } from '../../actions/faceCollection';

import cs from 'classnames';
import s from './DeleteConfirmModal.module.css';

function DeleteConfirmModal({
  showing,
  onCancel,
  onConfirm
}) {
  return (
    <div className={cs(s.base, showing && s.showing)}>
      <div className={s.overlay} onClick={onCancel} />
      <div className={s.inner}>
        <header>
          <h2>Confirm removal</h2>
        </header>
        <main>
          Are you sure you want to remove this face from the collection?
        </main>
        <footer>
          <Button onClick={onCancel}>Cancel</Button>
          <Button danger onClick={onConfirm}>Remove</Button>
        </footer>
      </div>
    </div>
  )
}

export default connect(
  state => ({
    showing: !!state.faceCollection.deletingFace
  }),
  dispatch => ({
    onCancel: () => dispatch(setDeleteConfirmFace(null)),
    onConfirm: () => dispatch(deleteFace())
  })
)(DeleteConfirmModal);
