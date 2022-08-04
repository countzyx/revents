import React from 'react';
import { createRoot } from 'react-dom/client';
import 'fomantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-calendar/dist/Calendar.css';
import './index.css';
import { Provider } from 'react-redux';
import { Store } from '@reduxjs/toolkit';
import { HistoryRouter } from 'redux-first-history/rr6';
import App from './App/Layout/App';
import reportWebVitals from './reportWebVitals';
import store, { history } from './App/Store/store';
import ScrollToTop from './App/Layout/ScrollToTop';

const render = (reduxStore: Store, container: HTMLElement) => {
  const root = createRoot(container);
  root.render(
    <Provider store={reduxStore}>
      <HistoryRouter history={history}>
        <ScrollToTop />
        <App />
      </HistoryRouter>
    </Provider>,
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  if (module.hot) {
    module.hot.accept('./App/Layout/App', () => setTimeout(render));
  }

  render(store, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
