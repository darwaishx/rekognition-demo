import React from 'react';
import { connect } from 'react-redux';
import { CSSTransition } from 'react-transition-group';

import AgeRangeMeter from './AgeRangeMeter';
import AttributeMeter from './AttributeMeter';
import ListFace from '../shared/ListFace';
import FaceThumbnail from '../shared/FaceThumbnail';

import { setSelectedFace, selectNextFace, selectPrevFace, setMatchThreshold } from '../../actions/search';

import cs from 'classnames';
import s from './FaceDetails.module.css';

const ATTRIBUTES = [
  'Smile',
  'Eyeglasses',
  'Sunglasses',
  'Beard',
  'Mustache',
  'EyesOpen',
  'MouthOpen'
];

const EMOTIONS = [
  'HAPPY',
  'SAD',
  'ANGRY',
  'CONFUSED',
  'DISGUSTED',
  'SURPRISED',
  'CALM'
]


function FaceDetails({
  in: transitionIn,
  selectIndex,
  faces,
  matchThreshold,
  setMatchThreshold,
  face,
  showAnalysis,
  showSearch,
}) {
  const { matches } = face;
  const filteredMatches = (matches || []).filter(m => m.similarity >= matchThreshold);
  return (
    <CSSTransition
      timeout={600}
      classNames={{
        enter: s.enter,
        enterActive: s.enterActive,
        exit: s.exit,
        exitActive: s.exitActive
      }}
      in={transitionIn}
      unmountOnExit
    >
      <div className={s.base}>
        <section>
          <header>
            <h2>Detected Faces</h2>
          </header>

          <div className={cs(s.facelist, s.small)}>
            { faces.map((f, idx) => (
              <div key={idx} className={s.selectableFace} onClick={() => selectIndex(idx)}>
                <FaceThumbnail
                  imageId={'_search'}
                  faceIndex={idx}
                  selected={f === face}
                />
              </div>
            )) }
          </div>
        </section>

        {showAnalysis ?
          <section>
            <header>
              <h2>Face Analysis</h2>
            </header>

            <div className={s.attrColumns}>
              <div className={s.emotions}>
                <AgeRangeMeter
                  min={face.AgeRange.Low}
                  max={face.AgeRange.High}
                />

                <AttributeMeter
                  name="Gender"
                  value={face.Gender.Value}
                  confidence={face.Gender.Confidence}
                />

                {EMOTIONS.map(e => (
                  <AttributeMeter
                    key={e}
                    name={e}
                    value={null}
                    confidence={face.Emotions.find(x => x.Type === e).Confidence}
                    yellow
                  />
                ))}
              </div>
              <div className={s.attributes}>
                {ATTRIBUTES.map(a => (
                  <AttributeMeter
                    key={a}
                    name={a}
                    value={face[a].Value}
                    confidence={face[a].Confidence}
                  />
                ))}
              </div>
            </div>
          </section>
        : null }

        {showSearch ?
          <section className={s.matchingFaces}>
            <header>
              <h2>Face Recognition</h2>
            </header>

            <div className={s.thresholdSlider}>
              <span>
                Match threshold:
              </span>
              <input
                type="range"
                min={60 * 60}
                max={100 * 100}
                step={1}
                value={matchThreshold * matchThreshold}
                onChange={e => setMatchThreshold(Math.sqrt(e.target.valueAsNumber))}
              />
              <span>
                {matchThreshold.toFixed(1)}%
              </span>
            </div>

            {matches ?
              <div className={s.facelist}>
                {filteredMatches.map(m => (
                  <div key={m.id}>
                    <ListFace id={m.id} size="1em" />
                    <span>{m.similarity.toFixed(1) + '%'}</span>
                  </div>
                ))}
                {filteredMatches.length === 0 ?
                  <span className={s.noFaces}>No matching faces found</span>
                : null}
              </div>
            : null}
          </section>
        : null}
      </div>
    </CSSTransition>
  );
}

export default connect(
  (state) => ({
    faces: state.searcher.faces,
    face: state.searcher.faces[state.searcher.selectedFace],
    canTraverseFaces: state.searcher.faces &&
                      state.searcher.faces.length > 1 &&
                      state.searcher.selectedFace !== null,
    matchThreshold: state.searcher.matchThreshold,
  }),
  dispatch => ({
    selectIndex: (idx) => dispatch(setSelectedFace(idx)),
    prevFace: () => dispatch(selectPrevFace()),
    nextFace: () => dispatch(selectNextFace()),
    setMatchThreshold: v => dispatch(setMatchThreshold(v))
  })
)(FaceDetails)
