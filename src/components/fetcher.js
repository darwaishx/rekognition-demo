import React, { Component } from 'react';
import { connect } from 'react-redux';

export default fetcher => WrappedComponent => {
  class FetcherComponent extends Component {
    componentDidMount() {
      this.fetch();
    }

    componentDidUpdate() {
      // this.fetch(); // TODO caching?
    }

    fetch() {
      const action = fetcher(this.props);
      this.props.dispatch(action);
    }

    render() {
      const { dispatch, ...rest } = this.props;
      return <WrappedComponent {...rest} />
    }
  }

  return connect()(FetcherComponent);
}
