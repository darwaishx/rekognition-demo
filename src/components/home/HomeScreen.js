import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';
import { updateHash } from '../../actions/routing';
import Button from '../shared/Button';

import s from './HomeScreen.module.css';

function HomeScreen({
  visible
}) {
  return (
    <CSSTransition
      classNames={{
        enter: s.enter,
        enterActive: s.enterActive,
        exit: s.exit,
        exitActive: s.exitActive
      }}
      in={visible}
      timeout={200}
      unmountOnExit
    >
      <div className={s.base}>
        <h1>Face Detection, Analysis, and Recognition Demo</h1>
        <h3>Powered by Amazon Rekognition</h3>

        <div className={s.options}>
          <a href="#detect">
            <div className={s.icon}>
              <img src={require('../../img/icon_detect_01.svg')} />
            </div>
            Detect Faces
          </a>
          <a href="#analyze">
            <div className={s.icon}>
              <img src={require('../../img/icon_analyse_01.svg')} />
            </div>
            Analyze Faces
          </a>
          <a href="#recognize">
            <div className={s.icon}>
              <img src={require('../../img/icon_search_01.svg')} />
            </div>
            Recognize Faces
          </a>
          <a href="#collection">
            <div className={s.icon}>
              <img src={require('../../img/icon_browse_01.svg')} />
            </div>
            View Collection
          </a>
        </div>
      </div>
    </CSSTransition>
  )
}

export default connect(
  state => ({ }),
)(HomeScreen)
