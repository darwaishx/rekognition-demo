import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import ProgressIcon from './ProgressIcon';

import cs from 'classnames';
import styles from './ProgressCircle.module.css';

class ProgressCircle extends Component {

  static propTypes = {
    progress: PropTypes.number.isRequired,
    resolved: PropTypes.bool,
    rejected: PropTypes.bool,
    retryable: PropTypes.bool,
    retryCount: PropTypes.number,
    onClick: PropTypes.func,
    radius: PropTypes.number,
    strokeWidth: PropTypes.number,
  };

  static defaultProps = {
    radius: 12,
    strokeWidth: 2,
  };

  get center() {
    const { radius, strokeWidth } = this.props;
    return radius + strokeWidth;
  }

  render() {
    const { onClick, strokeWidth } = this.props;
    const diameter = 2 * this.center;

    return (
      <div className={styles.base}>
        <svg
          className={cs({ [styles.clickable]: Boolean(onClick) })}
          width={diameter}
          height={diameter}
          onClick={onClick}
        >
          <g strokeWidth={strokeWidth}>
            {this.renderProgressMeter()}
            {this.renderIcon()}
          </g>
        </svg>
      </div>
    );
  }

  renderProgressMeter() {
    const { radius, progress, retryCount } = this.props;
    const center = this.center;
    const circumference = 2 * Math.PI * radius;

    return (
      <circle
        transform={`translate(${center} ${center}) rotate(-90) translate(${-center} ${-center})`}
        key={retryCount}
        r={radius}
        cx={center} cy={center}
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
      />
    );
  }

  renderIcon() {
    const { radius, resolved, rejected, retryable } = this.props;
    const center = this.center;

    let Component;
    if (resolved) Component = ProgressIcon.Tick;
    if (rejected) Component = retryable ? ProgressIcon.Retry : ProgressIcon.Cross;

    return (
      <TransitionGroup component={'g'}>
        {Component && <Component radius={radius} center={center} />}
      </TransitionGroup>
    );
  }
}

export default ProgressCircle;
