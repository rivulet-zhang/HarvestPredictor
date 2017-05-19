import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { loadInitialData } from './actions';

import App from './app/index';
import reducers from './reducers';

import { Router, Route, BrowserRouter } from 'react-router-dom';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

export const store = createStoreWithMiddleware(reducers)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Route path='/' component={App} onEnter={store.dispatch(loadInitialData())}/>
    </BrowserRouter>
  </Provider>
  , document.body.appendChild(document.createElement('div')));
