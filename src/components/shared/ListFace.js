import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import fetcher from '../fetcher';

import { fetchFace, setDeleteConfirmFace, setFaceName } from '../../actions/faceCollection';

import Face from './Face';

function ListFace({ id, ...rest }) {
  const [ imageId, faceIndex ] = id.split('::');
  return (
    <Face
      imageId={imageId}
      faceIndex={faceIndex}
      {...rest}
    />
  );
}

export default compose(
  fetcher(({ id }) => fetchFace(id)),
  connect(
    null,
    (dispatch, { id }) => ({
      onSetName: name => dispatch(setFaceName(id, name)),
      onDelete: () => dispatch(setDeleteConfirmFace(id))
    })
  )
)(ListFace)
