import React from 'react';

import cs from 'classnames';
import s from './AttributeMeter.module.css';

const titles = {
  _face: 'Is a face',
  Smile: 'Is smiling',
  Eyeglasses: 'Wearing glasses',
  Sunglasses: 'Wearing sunglasses',
  Gender: 'Apparent gender',
  Beard: 'Has a beard',
  Mustache: 'Has a mustache',
  EyesOpen: 'Eyes are open',
  MouthOpen: 'Mouth is open'
}

const values = {
  Smile: [ true, false ],
  Eyeglasses: [ true, false ],
  Sunglasses: [ true, false ],
  Gender: [ 'Male', 'Female' ],
  Beard: [ true, false ],
  Mustache: [ true, false ],
  EyesOpen: [ true, false ],
  MouthOpen: [ true, false ]
}

const valueNames = {
  true: 'Yes',
  false: 'No',
  Male: 'Male',
  Female: 'Female'
};

function niceTitle(name, value) {
  const t = titles[name];
  return t || name.toLowerCase().replace(/^./, x => x.toUpperCase());
}

function Meter({ label, selected, confidence }) {
  confidence = selected ? confidence : 0;
  return (
    <div className={cs(s.meter, !selected && s.fade)} title={confidence.toFixed(1) + '%'}>
      {label !== undefined ?
        <span>{valueNames[label]}</span>
      : null}
      <div className={s.meterTrack}>
        <div className={s.confidenceValue} style={{ width: confidence + '%'}} />
      </div>
    </div>
  );
}

export default function AttributeMeter({ name, value, confidence, yellow }) {
  return (
    <div className={cs(s.base, yellow && s.yellow)}>
      <h3>{niceTitle(name)}</h3>

      {values[name]
        ? values[name].map(x => <Meter key={x} label={x} selected={x === value} confidence={confidence} />)
        : <Meter selected confidence={confidence} />
      }
    </div>
  );
}
