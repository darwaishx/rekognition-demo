import React from 'react';
import { connect } from 'react-redux';

import getCanSubmitUpload from '../../selectors/getCanSubmitUpload';

import { clearFaceList } from '../../actions/faceCollection';
import { submitUpload } from '../../actions/uploader';
import { updateHash } from '../../actions/routing';

import UploadingImage from './UploadingImage';
import Button from '../shared/Button';

import s from './UploadImagesList.module.css';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function UploadImagesList({ images, submitting, canSubmit, submit }) {
  return (
    <div className={s.base}>
      <div className={s.images}>
        {images.map(i => <UploadingImage key={i} id={i} />)}
      </div>

      <div className={s.footer}>
        <Button disabled={!canSubmit} onClick={submit}>{submitting ? 'Adding...' : 'Add faces to collection'}</Button>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    images: Object.keys(state.uploads),
    canSubmit: getCanSubmitUpload(state),
    submitting: state.uploader.state === 'PENDING'
  }),
  dispatch => ({
    submit: () => dispatch(submitUpload())
        .then(() => dispatch(clearFaceList()))
        .then(() => delay(500))
        .then(() => dispatch(updateHash('collection')))
  })
)(UploadImagesList)
