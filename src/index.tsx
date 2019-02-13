import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';

import { reducer, epics, Action, State } from './state';
import './index.css';
import App from './components/App';

// Service
import { WorkloadService } from './state/workloads/services';
const workloadService: WorkloadService = new WorkloadService();

// @ts-ignore: use Redux devtools if installed in browser
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware<Action, Action, State>({
  dependencies: { workloadService }
});
const store = createStore(reducer, composeEnhancers(applyMiddleware(epicMiddleware)));
epicMiddleware.run(epics);



ReactDOM.render(
  (
    <Provider store={store}>
      <App />
    </Provider>
  ),
  document.getElementById('root'),
);
