import ReactDOM from 'react-dom';

import { App } from './App';
import { stylizeConsole } from './utils/console';
import config from './config';

import './styles/index.scss';

stylizeConsole({ showConsoleLog: config.SHOW_CONSOLE_LOGS });

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
