import React from 'react';
import { render } from 'react-dom';
import App from './containers/App'
import {log} from '@/log'
import './normalize.css';
import './functions.css';
import './app.css';
import './flexible';
import {setOrUpdate as setOrUpdateShare} from 'nw-share';

const rootElement = document.getElementById('app')
const renderApp = Component =>
    render(
        <Component />,
        rootElement
    );

renderApp(App);
if (module.hot) {
    module.hot.accept();
}
