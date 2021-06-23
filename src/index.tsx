import ReactDOM from 'react-dom';

import { App } from './App';
import { stylizeConsole } from './utils/console';
import config from './config';
import { Provider } from 'react-redux';
import store from './redux/store';
import Web3Connector from './contexts/Web3Connector';
import ContractsContext from './contexts/ContractsContext';

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
