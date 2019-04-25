import React, { Component } from 'react';

const TOOTH_DEPTH = 4;

function xy(r, theta) {
  return [
    r * Math.cos(theta),
    r * Math.sin(theta)
  ];
}

function Gear({
  n
}) {
  const r = n * .8 * TOOTH_DEPTH;
  const dtheta = Math.PI * 2 / n;
  let p = [];
  for (let i = 0; i < n; i++) {
    const th = i * dtheta;
    p.push(
      xy(r + TOOTH_DEPTH, th + dtheta * .15),
      xy(r - TOOTH_DEPTH, th + dtheta * .3),
      xy(r - TOOTH_DEPTH, th + dtheta * .7),
      xy(r + TOOTH_DEPTH, th + dtheta * .85)
    )
  }

  const cr = r - TOOTH_DEPTH * 3;

  return (
    <path
        d={
          p.map((x, i) => (i === 0 ? 'M' : 'L') + x).join('') + 'Z' +
          `
            M ${-cr} 0
            a ${cr} ${cr} 0 1 0 ${cr * 2} 0
            a ${cr} ${cr} 0 1 0 ${-cr * 2 } 0
          `
        }
      />
  );
}





const SPEED = 1.8;

export default class ProcessingIcon extends Component {
  id = Math.random().toString().slice(2);

  state = {
    t: performance.now() * SPEED
  };

  componentDidMount() {
    this.loop();
  }

  componentWillUnmount() {
    this.finished = true;
  }

  loop = () => {
    if (this.finished) return;
    requestAnimationFrame(this.loop);

    this.setState({
      t: performance.now() * SPEED
    });
  }

  render() {
    const id = this.id;
    const { t } = this.state;

    return (
      <svg
        width={200}
        height={200}
        viewBox="0 0 200 200"
        {...this.props}
      >
        <clipPath id={`circle-${id}`}>
          <circle r={70} cx={100} cy={100} />
        </clipPath>
        <g clipPath={`url(#circle-${id})`} fill="#fff">
          <g transform={`translate(100 100) rotate(${t / 100})`}>
            <Gear n={15} />
          </g>
          <g transform={`translate(20 20) rotate(${-t / 100 * 15 / 20 + 7})`}>
            <Gear n={20} />
          </g>
          <g transform={`translate(200 -8) rotate(${-t / 200 + 7})`}>
            <Gear n={30} />
          </g>
          <g transform={`translate(227, 267) rotate(${-t / 100 * 15 / 50 + 7.5})`}>
            <Gear n={50} />
          </g>
          <g transform={`translate(44 151) rotate(${-t / 100 * 15 / 8 + 14})`}>
            <Gear n={8} />
          </g>
        </g>
        <circle
          cx={100}
          cy={100}
          r={80}
          fill="none"
          stroke="#fff"
          strokeWidth={4}
        />
      </svg>
    )
  }
}
