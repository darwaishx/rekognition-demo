import React, { Component } from 'react';
import { connect } from 'react-redux';

import Face from '../shared/Face';

import getFaceState from '../../selectors/getFaceState';
import getFaceIsSelected from '../../selectors/getFaceIsSelected';

import { setFaceIndexSelected, setFaceIndexDeselected, setFaceName } from '../../actions/uploader'

import cs from 'classnames';
import s from './DetectedFacePreview.module.css';

class DetectedFacePreview extends Component {
  render() {
    const { imageId, faceIndex, state, selected, select, deselect, setName } = this.props;

    return (
      <div
        className={cs(s.base, selected && s.selected)}
        onClick={selected ? deselect : select}
      >
        <svg
          className={cs(s.toggle, selected && s.selected)}
          viewBox="0 0 24 24"
        >
          <path
            d="M6,12 L10,16 L18,8"
          />
        </svg>

        <Face
          imageId={imageId}
          faceIndex={faceIndex}
          pending={state !== 'READY'}
          editable
          uploading
          onSetName={setName}
        />
      </div>
    )
  }
}

export default connect(
  (state, { imageId, faceIndex }) => ({
    state: getFaceState(state, imageId, faceIndex),
    selected: getFaceIsSelected(state, imageId, faceIndex)
  }),
  (dispatch, { imageId, faceIndex }) => ({
    select: () => dispatch(setFaceIndexSelected(imageId, faceIndex)),
    deselect: () => dispatch(setFaceIndexDeselected(imageId, faceIndex)),
    setName: (name) => dispatch(setFaceName(imageId, faceIndex, name))
  })
)(DetectedFacePreview);
