import React from 'react';
import { connect } from 'react-redux';

import getFaceName from '../../selectors/getFaceName';
import getUploaderName from '../../selectors/getUploaderName';

import FaceThumbnail from './FaceThumbnail';

import s from './Face.module.css';

// TODO firing both of these causes duplicate saves

function formSubmit(setter) {
  return e => {
    e.preventDefault();
    const inp = e.target.querySelector('textarea')
    setter(inp.value);
    inp.blur();
  };
}

function inputBlur(setter) {
  return e => {
    const inp = e.target
    setter(inp.value);
    inp.blur();
  }
}

function Face({
  imageId,
  faceIndex,
  size = 125,
  pending,
  name,
  editable,
  deletable,
  onDelete = () => {},
  onSetName = () => {}
}) {
  return (
    <div
      className={s.base}
      style={{ fontSize: size }}
    >
      <FaceThumbnail imageId={imageId} faceIndex={faceIndex} size={size} pending={pending} />

      {deletable
        ? <button className={s.deleteButton} onClick={onDelete} title="Remove this face from the collection" />
      : null}

      {editable
        ? <form onSubmit={formSubmit(onSetName)}>
            <textarea
              key={name}
              defaultValue={name}
              spellCheck={false}
              placeholder={'Unknown'}
              onBlur={inputBlur(onSetName)}
              onClick={e => e.stopPropagation()}
            />
          </form>
        : <span className={s.label}>{name || 'Unknown'}</span>
      }
    </div>
  )
}


export default connect(
  (state, { imageId, faceIndex, uploading }) => ({
    name: uploading ? getUploaderName(state, imageId, faceIndex) : getFaceName(state, imageId, faceIndex)
  })
)(Face);
