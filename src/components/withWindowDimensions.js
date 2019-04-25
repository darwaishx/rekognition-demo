import React, { Component } from 'react';

export default function withWindowDimensions(WrappedComponent) {
  class DimensionsComponent extends Component {
    state = {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    }

    componentDidMount() {
      window.addEventListener('resize', this.windowSized)
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.windowSized);
    }

    windowSized = () => {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      })
    }

    render() {
      return <WrappedComponent {...this.state} {...this.props} />
    }
  }

  return DimensionsComponent;
}
