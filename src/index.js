import './utils/intersectionObserver-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './components/App';

import store from './store';
import { init as initLoginProvider } from './loginProvider';

import { updateHash } from './actions/routing';

window.addEventListener('hashchange', () => {
  store.dispatch(updateHash(window.location.hash.replace(/^#/, '')))
});

store.subscribe(() => {
  const { hash } = store.getState().routing;
  if (window.location.hash.replace(/^#/, '') !== hash) {
    window.history.pushState({}, document.title, '#' + hash);
  }
});

initLoginProvider();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);





let doc = document;

function div() {
  return doc.createElement('div');
}

function scrollbarSize() {
  var d = div();
  d.setAttribute('style', 'width:400px;height:400px;overflow-y:scroll;position:absolute;top:200px;left:200px;');
  d.appendChild(div());
  doc.body.appendChild(d);
  var w1 = d.offsetWidth;
  var w2 = d.firstChild.offsetWidth;

  doc.body.removeChild(d);
  return w1 - w2;
}

if (scrollbarSize() > 0) {
  document.body.classList.add('styled-scrollbars');
}
