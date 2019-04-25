import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { setSelectedFace } from '../../actions/search';

import withWindowDimensions from '../withWindowDimensions';

import SelectedFaceHighlighter from './SelectedFaceHighlighter';
import ProcessingIcon from '../shared/ProcessingIcon';
import NoFaces from './NoFaces';

import getUrlForBlob from '../../utils/getUrlForBlob';

import cs from 'classnames';
import s from './ImageFacesPreview.module.css';

function expandBox({ top, left, width, height }) {
  return {
    top: top - height * 2,
    left: left - width * 2,
    width: width * 5,
    height: height * 5
  };
}

function ImageFacesPreview({
  imageData,
  faces,
  selectedFace,
  selectFace,
  windowWidth,
  windowHeight,
  shadowUrl,
  showMarkers,
  highlightAllFaces
}) {
  const WIDTH = windowWidth;
  const HEIGHT = windowHeight;

  // TODO do nice transform-origin for this?
  function transformForFace(idx) {

    let bbox;
    let availableWidth;
    const availableHeight = windowHeight - 60;

    if (idx === null) {
      bbox = {
        top: -imageData.height / 10,
        left: -imageData.width / 10,
        width: imageData.width * 1.2,
        height: imageData.height * 1.2
      }

      availableWidth = WIDTH;
    } else {
      const face = faces[idx];
      bbox = expandBox({
        top: face.BoundingBox.Top * imageData.height,
        left: face.BoundingBox.Left * imageData.width,
        width: face.BoundingBox.Width * imageData.width,
        height: face.BoundingBox.Height * imageData.height
      });

      availableWidth = Math.max(0, WIDTH - (WIDTH < 1600 ? 800 : WIDTH / 2));
    }

    const cx = bbox.left + bbox.width / 2;
    const cy = bbox.top + bbox.height / 2;

    const scale = Math.max(
      Math.min(
        availableWidth / (imageData.width * 1.2),
        availableHeight / (imageData.height * 1.2)
      ),
      // TODO something in here to prevent it getting tooo big
      Math.min(
        2,
        availableWidth / bbox.width,
        availableHeight / bbox.height,
      )
    );

    return `translate(${availableWidth / 2}px, ${availableHeight / 2 + 60}px) scale(${scale}) translate(${-cx}px, ${-cy}px)`;
  }

  return (
    <div className={s.base}>
      {imageData ? <>
        <svg
          width={WIDTH}
          height={HEIGHT}
        >
          <defs>
            {faces ? <>
              {faces.map(f => f.BoundingBox).map(bb => {
                const w = bb.Width * imageData.width;
                const h = bb.Height * imageData.height;
                const r = Math.sqrt(w * w + h * h) / 2;
                const x = (bb.Left + bb.Width / 2) * imageData.width;
                const y = (bb.Top + bb.Height / 2) * imageData.height;

                return { x, y, r };
              }).map((b, idx) => (
                <circle
                  id={`face-${idx}`}
                  key={idx}
                  cx={b.x}
                  cy={b.y}
                  r={b.r}
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              <clipPath id="faceClip">
                {faces.map((f, idx) => (
                  <use key={idx} xlinkHref={`#face-${idx}`} />
                ))}
              </clipPath>
            </> : null}

            {/* TODO this svg filter is super duper inefficient. Maybe we can pre-render one? */}
            <filter id="shadow">
              <feDropShadow dx="0" dy="3" stdDeviation="5" />
            </filter>
          </defs>

          <rect
            fill="#30414D"
            fillOpacity={0.2}
            x={0}
            y={0}
            width={WIDTH}
            height={HEIGHT}
            // onClick={() => {
            //   selectFace(null)
            // }}
          />

          <g className={s.panner} style={{transform: transformForFace(selectedFace)}}>

            <image
              x={-imageData.width *.05}
              y={-imageData.height * .05}
              xlinkHref={shadowUrl}
            />

            <image
              width={imageData.width}
              height={imageData.height}
              xlinkHref={imageData.url}
              // filter="url(#shadow)"
            />

            <rect
              fill="none"
              stroke={"#000"}
              strokeWidth={1}
              x={0}
              y={0}
              width={imageData.width}
              height={imageData.height}
              vectorEffect="non-scaling-stroke"
            />

            <rect
              fill="#30414D"
              fillOpacity={0.6}
              x={0}
              y={0}
              width={imageData.width}
              height={imageData.height}
              // onClick={() => {
              //   selectFace(null)
              // }}
            />

            {faces ? <>
              <image
                width={imageData.width}
                height={imageData.height}
                xlinkHref={imageData.url}
                clipPath="url(#faceClip)"
              />

              <g>
                {faces.map((f, idx) => (
                  <use
                    key={idx}
                    xlinkHref={`#face-${idx}`}
                    onClick={() => {
                      selectFace(idx);
                    }}
                    className={cs(
                      s.face,
                      idx === selectedFace && s.selected
                    )}
                  />
                ))}
              </g>

              {selectedFace !== null && showMarkers ?
                <SelectedFaceHighlighter selectedFace={selectedFace} />
              : null}

              {highlightAllFaces && faces ?
                faces.map((_, i) => (
                  <SelectedFaceHighlighter key={i} selectedFace={i} />
                ))
              : null}
            </> : null}
          </g>
        </svg>

        {faces && faces.length === 0 ?
          <NoFaces />
        : null}
        {!faces ?
          <ProcessingIcon className={s.processing} />
        : null}
      </> : null}
    </div>
  )
}

export default compose(
  withWindowDimensions,
  connect(
    (state, { canSelect }) => ({
      imageData: state.searcher.imageData,
      shadowUrl: state.searcher.shadowData && getUrlForBlob(state.searcher.shadowData),
      state: state.searcher.state,
      faces: state.searcher.faces,
      selectedFace: canSelect ? state.searcher.selectedFace : null
    }),
    dispatch => ({
      selectFace: idx => dispatch(setSelectedFace(idx))
    })
  )
)(ImageFacesPreview);
