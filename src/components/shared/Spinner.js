import React from 'react';
// import PropTypes from 'prop-types'

// TODO Transition me pls

import cs from 'classnames';
import styles from './Spinner.module.css';

function Spinner({
  shouldSpin = false,
  color = 'dark',
  size,
  className
}) {
  let style = {};

  if (size) {
    style = {
      width: size,
      height: size,
      marginLeft: `${-size * 0.5}px`,
      marginTop: `${-size * 0.5}px`,
    };
  }

  return (shouldSpin ?
        <div
          className={cs(className, styles.spinner, { [styles.light]: color === 'light' })}
          style={style}
        />
        : null
  );
}

export default Spinner;
