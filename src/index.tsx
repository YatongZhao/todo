import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Data } from './Data';
import { StoreProvider } from './store/store';
import { autorun } from 'mobx';

const _data = window.localStorage.getItem('data');
let source = [];
if (_data) {
  source = JSON.parse(_data);
}
const data = new Data(source);
autorun(() => {
  window.localStorage.setItem('data', JSON.stringify(data.actionSources));
});


ReactDOM.render(
  // <React.StrictMode>
    <StoreProvider value={data}>
      <App />
    </StoreProvider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
