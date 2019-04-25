import React from 'react';
import { connect } from 'react-redux';



function Outline({ markers, landmarks, toImageCoords, ...rest }) {
  const getMarker = x => landmarks.find(l => l.Type === x);
  const getPoints = t => {
    const { x, y } = toImageCoords(getMarker(t));
    return [ x, y ];
  }

  return (
    <path
      d={markers.map(getPoints).map((p, i) => i === 0 ? 'M' + p : 'L' + p).join(' ')}
      vectorEffect="non-scaling-stroke"
      {...rest}
    />
  )
}


function SelectedFaceHighlighter({ face, width, height }) {
  const toImageCoords = ({ X, Y }) => ({ x: X * width, y: Y * height });

  return (
    <g>
      <Outline
        landmarks={face.Landmarks}
        toImageCoords={toImageCoords}
        markers={[
          'upperJawlineLeft',
          'midJawlineLeft',
          'chinBottom',
          'midJawlineRight',
          'upperJawlineRight'
        ]}
        fill="none"
        stroke="#00f"
        strokeWidth={2}
      />
      <Outline
        landmarks={face.Landmarks}
        toImageCoords={toImageCoords}
        markers={[
          'mouthLeft',
          'mouthRight'
        ]}
        fill="none"
        stroke="#00f"
        strokeWidth={2}
      />
      <Outline
        landmarks={face.Landmarks}
        toImageCoords={toImageCoords}
        markers={[
          'noseLeft',
          'nose',
          'noseRight'
        ]}
        fill="none"
        stroke="#00f"
        strokeWidth={2}
      />
      <Outline
        landmarks={face.Landmarks}
        toImageCoords={toImageCoords}
        markers={[
          'leftEyeBrowLeft',
          'leftEyeBrowUp',
          'leftEyeBrowRight'
        ]}
        fill="none"
        stroke="#00f"
        strokeWidth={2}
      />
      <Outline
        landmarks={face.Landmarks}
        toImageCoords={toImageCoords}
        markers={[
          'rightEyeBrowLeft',
          'rightEyeBrowUp',
          'rightEyeBrowRight'
        ]}
        fill="none"
        stroke="#00f"
        strokeWidth={2}
      />
{/*
      {face.Landmarks.map(l => (
        <rect key={l.Type} width={3} height={3} fill="#f00" {...toImageCoords(l)} />
      ))}
*/}
    </g>
  )
}

export default connect(
  (state, { selectedFace }) => ({
    width: state.searcher.imageData.width,
    height: state.searcher.imageData.height,
    face: state.searcher.faces[selectedFace]
  })
)(SelectedFaceHighlighter)
