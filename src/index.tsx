import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import App from './App/Layout/App';
import reportWebVitals from './reportWebVitals';
import configureStore from './App/Store/configureStore';

function render(reduxStore: Store, element: HTMLElement) {
  ReactDOM.render(
    <Provider store={reduxStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
    element,
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  if (module.hot) {
    module.hot.accept('./App/Layout/App', () => setTimeout(render));
  }

  const store = configureStore();
  render(store, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
