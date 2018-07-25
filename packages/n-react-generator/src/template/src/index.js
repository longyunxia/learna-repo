import React from 'react';
import {render} from 'react-dom';
import App from './containers/App'
import './normalize.css';
import './functions.css';
import './app.css';
import './flexible';

const rootElement = document.getElementById('app')
const renderApp = Component =>
  render(
    <Component/>,
    rootElement
  );

renderApp(App);
if (module.hot) {
  module.hot.accept();
}
