import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';

import { searchFace, clearSearcher } from '../../actions/search';

import FilePicker from '../shared/FilePicker';
import SearchingImage from './SearchingImage';

import s from './Searcher.module.css';

function Searcher({
  visible,
  image,
  onImage,
  clearSearcher,
  showAnalysis = false,
  showSearch = false
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
      onExited={clearSearcher}
    >
      <div className={s.base}>
        {image
          ? <SearchingImage showAnalysis={showAnalysis} showSearch={showSearch} />
          : <FilePicker onImage={onImage} />
        }
      </div>
    </CSSTransition>
  )
}

export default connect(
  state => ({
    image: state.searcher.image
  }),
  dispatch => ({
    onImage: img => dispatch(searchFace(img[0])),
    clearSearcher: () => dispatch(clearSearcher())
  })
)(Searcher)
