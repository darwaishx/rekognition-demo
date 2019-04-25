import React from 'react';
import { connect } from 'react-redux';

import getImageUrl from '../../selectors/getImageUrl';
import getDetectedFaces from '../../selectors/getDetectedFaces';
import getAnalysisState from '../../selectors/getAnalysisState';
import getUploadProgress from '../../selectors/getUploadProgress';
import getUploadState from '../../selectors/getUploadState';

import DetectedFacePreview from './DetectedFacePreview';
import ProgressCircle from './ProgressCircle';

import s from './UploadingImage.module.css';

function UploadingImage({ id, image, faces, uploadState, uploadProgress, state }) {
  return (
    <div className={s.base}>
      <div className={s.image}>
        <div className={s.overlay}/>
        <ProgressCircle
          progress={uploadProgress}
          resolved={uploadState === 'FINISHED'}
          retryable={true}
        />
        <img
          src={image}
        />
      </div>

      <div className={s.right}>
        <h3>Detected faces</h3>
        {uploadState !== 'FINISHED' ?
          <span>Uploading&hellip;</span>
        : null}
        {state === 'ANALYZING' ?
          <span>Finding faces&hellip;</span>
        : null}
        {state === 'DONE' ?
          <div className={s.faces}>
            {/*state*/}
            {faces.map(fidx => (
              <DetectedFacePreview
                key={fidx}
                imageId={id}
                faceIndex={fidx}
              />
            ))}
            {faces.length === 0 ?
              <span className={s.noFaces}>No faces detected</span>
            : null}
          </div>
        : null}
      </div>
    </div>
  )
}

export default connect(
  (state, {id}) => ({
    image: getImageUrl(state, id),
    faces: getDetectedFaces(state, id),
    uploadState: getUploadState(state, id),
    uploadProgress: getUploadProgress(state, id),
    state: getAnalysisState(state, id)
  })
)(UploadingImage)
