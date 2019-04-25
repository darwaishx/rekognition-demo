import React from 'react';

import cs from 'classnames';
import s from './AgeRangeMeter.module.css';

export default function AgeRangeMeter({ min, max }) {
  return (
    <div className={cs(s.base)}>
      <h3>Age range: <strong>{min} &ndash; {max}</strong></h3>

      <div className={s.meter}>
        <div className={s.range} style={{
          left: min + '%',
          right: (100 - max) + '%'
        }} />
      </div>
    </div>
  );
}
