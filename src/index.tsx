import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import ContractsContext from './contexts/ContractsContext';
import Web3Connector from './contexts/Web3Connector';
import store from './redux/store';
import { stylizeConsole } from './utils/console';
import { App } from './App';
import config from './config';

import './styles/index.scss';

stylizeConsole({ showConsoleLog: config.SHOW_CONSOLE_LOGS });

ReactDOM.render(
  <Provider store={store}>
    <Web3Connector>
      <ContractsContext>
        <App />
      </ContractsContext>
    </Web3Connector>
  </Provider>,
  document.getElementById('root'),
);
