import { combineReducers } from 'redux';

import routing from './routing';
import login from './login';
import uploads from './uploads';
import analysis from './analysis';
import uploader from './uploader';
import faces from './faces';
import faceCollection from './faceCollection';
import searcher from './searcher';

export default combineReducers({
  routing,
  login,
  uploads,
  faces,
  analysis,
  uploader,
  searcher,
  faceCollection
});
