import React from 'react';
import { connect } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';

import FaceDetails from './FaceDetails';
import ImageFacesPreview from './ImageFacesPreview';

import s from './SearchingImage.module.css';

function SearchingImage({ selectedFace, showAnalysis, showSearch }) {
  return (
    <div className={s.base}>
      <ImageFacesPreview s
        showMarkers={showAnalysis}
        highlightAllFaces={!showAnalysis && !showSearch}
        canSelect={showAnalysis || showSearch}
      />

      {showAnalysis || showSearch ?
        <TransitionGroup>
          {selectedFace !== null ?
            <FaceDetails showAnalysis={showAnalysis} showSearch={showSearch} />
          : null}
        </TransitionGroup>
      : null}
    </div>
  )
}

export default connect(
  (state) => ({
    selectedFace: state.searcher.selectedFace
  })
)(SearchingImage);
