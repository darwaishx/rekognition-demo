import React from 'react';
import { connect } from 'react-redux';

import LoginScreen from './login/LoginScreen';

import HomeScreen from './home/HomeScreen';
import Uploader from './uploader/Uploader';
import Searcher from './searcher/Searcher';
import FaceList from './collection/FaceList';

import HeaderBar from './shared/HeaderBar';

function App({ route, loggedIn, readOnly }) {
  return (
    <div>
      { loggedIn ? <>
        <HeaderBar />

        <HomeScreen visible={route === ''} />
        <Uploader visible={route === 'upload' && !readOnly} />
        <FaceList visible={route === 'collection'} />
        <Searcher visible={route === 'detect'} />
        <Searcher visible={route === 'analyze'} showAnalysis />
        <Searcher visible={route === 'recognize'} showSearch />
      </> : <LoginScreen /> }
    </div>
  );
}

export default connect(
  state => ({
    loggedIn: state.login.state === 'LOGGED_IN',
    readOnly: state.login.readOnly,
    route: state.routing.hash
  })
)(App)
