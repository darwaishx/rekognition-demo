import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Transition } from 'react-transition-group';

class ProgressIcon extends Component {
  static propTypes = {
    radius: PropTypes.number.isRequired,
    center: PropTypes.number.isRequired,
    transitionDuration: PropTypes.number,
  };

  static defaultProps = {
    transitionDuration: 250
  };

  animateIn(callback) {
    setTimeout(() => {
      if (this.ref && this.ref.style) this.ref.style.strokeDashoffset = 0;
    }, 0);
  }

  render() {
    return (
      <Transition
        in={this.props.in}
        timeout={this.props.transitionDuration}
        onEnter={() => this.animateIn()}
      >
        {state => this._render()}
      </Transition>
    )
  }
}

class Tick extends ProgressIcon {
  _render() {
    const { radius, center } = this.props;

    const segment = 1 / 3 * radius;
    const side = segment * Math.sqrt(2) / 2;
    const length = this.length = 3 * segment;

    return (
      <path
        key={'tick'}
        ref={el => (this.ref = el)}
        strokeDasharray={length}
        strokeDashoffset={length}
        d={[
          `M${center - 3 * side / 2},${center}`,
          `l${side},${side}`,
          `l${side * 2},${-side * 2}`,
        ].join('')}
      />
    );
  }
}

class Cross extends ProgressIcon {
  _render() {
    const { radius, center } = this.props;

    const segment = 1 / 3 * radius;
    const side = segment * Math.sqrt(2) / 2;
    const length = this.length = 6 * segment;

    return (
      <path
        key={'cross'}
        ref={el => (this.ref = el)}
        strokeDasharray={length}
        strokeDashoffset={length}
        d={[
          `M${center - side},${center - side}`,
          `L${center + side},${center + side}`,
          `L${center},${center}`,
          `L${center + side},${center - side}`,
          `L${center - side},${center + side}`,
        ].join('')}
      />
    );
  }
}

class Retry extends ProgressIcon {
  _render() {
    const { radius, center } = this.props;
    const c = center;
    const r = radius / 2.5;
    const a = 2; // Arrow head
    const length = this.length = (3 / 2 * Math.PI * r) + (3 * a) + (2 * a * Math.sqrt(2));
    return (
      <path
        key={'retry'}
        ref={el => (this.ref = el)}
        strokeDasharray={length}
        strokeDashoffset={length}
        d={[
          `M${c + r},${c}`,
          `A${r},${r},0,1,1,${c},${c - r}`,
          `h${+a}`,
          `l${-a},${-a}`,
          `l0,${2 * a}`,
          `l${+a},${-a}`,
        ].join('')}
      />
    );
  }
}

ProgressIcon.Tick = Tick;
ProgressIcon.Cross = Cross;
ProgressIcon.Retry = Retry;
export default ProgressIcon;
