import React, { Component } from 'react';
import { connect } from 'react-redux';

import getFaceThumbnail from '../../selectors/getFaceThumbnail';

import Spinner from './Spinner';

import cs from 'classnames';
import s from './FaceThumbnail.module.css';

class FaceThumbnail extends Component {
  render() {
    const { selected, thumbnail, pending } = this.props;
    // TODO spinner based on image load state
    return (
      <div className={cs(s.base, selected && s.selected)}>
        <div className={cs(s.overlay, (!thumbnail || pending) && s.visible)}>
          <Spinner color="light" shouldSpin={!thumbnail || pending} />
        </div>
        {thumbnail ?
          <div
            className={s.inner}
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
        : null}
      </div>
    )
  }
}

export default connect(
  (state, { imageId, faceIndex }) => ({
    thumbnail: getFaceThumbnail(state, imageId, faceIndex)
  })
)(FaceThumbnail);
