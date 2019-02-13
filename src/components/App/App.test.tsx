import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const store: any = {
    subscribe: jest.fn(),
    dispatch: jest.fn(),
    getState: jest.fn().mockReturnValue({ workloads: {} }),
  }
  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    , div);
  ReactDOM.unmountComponentAtNode(div);
});
