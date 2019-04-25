import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';

import { uploadImages } from '../../actions/uploads';
import { clearUploader } from '../../actions/uploader';

import UploadImagesList from './UploadImagesList';
import FilePicker from '../shared/FilePicker';

import s from './Uploader.module.css';

function Uploader({ hasImages, visible, onImage, clearUploader }) {
  return (
    <CSSTransition
      classNames={{
        enter: s.enter,
        enterActive: s.enterActive,
        exit: s.exit,
        exitActive: s.exitActive
      }}
      in={visible}
      timeout={200}
      onExited={clearUploader}
      unmountOnExit
    >
      <div className={s.base}>
        {hasImages
          ? <UploadImagesList />
          : <FilePicker multi csv onImage={onImage} />
        }
      </div>
    </CSSTransition>
  )
}

// TODO clear on hide

export default connect(
  state => ({
    hasImages: Object.keys(state.uploads).length > 0
  }),
  dispatch => ({
    onImage: images => dispatch(uploadImages(images)),
    clearUploader: () => dispatch(clearUploader())
  })
)(Uploader)
