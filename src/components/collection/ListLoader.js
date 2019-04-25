import React, { Component } from 'react';
import { connect } from 'react-redux';

import Spinner from '../shared/Spinner';

import { fetchFaces } from '../../actions/faceCollection';

import s from './ListLoader.module.css';

class ListLoader extends Component {
  componentDidMount() {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.props.fetchMore();
      }
    });
    io.observe(this.el);
  }

  render() {
    return (
      <div className={s.base}>
        <div className={s.ioTarget} ref={r => this.el = r} />
        <Spinner color="light" shouldSpin />
      </div>
    )
  }
}

export default connect(
  state => ({}),
  (dispatch, { nextToken }) => ({
    fetchMore: () => dispatch(fetchFaces(nextToken))
  })
)(ListLoader)
