import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { connect } from 'react-redux';

import ListFace from '../shared/ListFace';
import ListLoader from './ListLoader';
import DeleteConfirmModal from './DeleteConfirmModal';

import s from './FaceList.module.css';

function FaceList({ visible, readOnly, faces, nextToken }) {
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
        <DeleteConfirmModal />

        <div className={s.facePile}>
          {faces && faces.map(f => (
            <ListFace key={f.id} id={f.id} editable={!readOnly} deletable={!readOnly} />
          ))}
          {faces && faces.length === 0 ?
            <span>No faces yet</span>
          : null}
        </div>

        { nextToken || !faces ?
          <ListLoader
            key={nextToken ? nextToken.id : '0'}
            nextToken={nextToken}
          />
        : null }
      </div>
    </CSSTransition>
  )
}

export default connect(
  state => ({
    readOnly: state.login.readOnly,
    loading: state.faceCollection.loading,
    faces: state.faceCollection.faces,
    nextToken: state.faceCollection.nextToken
  })
)(FaceList);
