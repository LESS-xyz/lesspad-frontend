import { combineReducers } from 'redux';

import modal from './modal';
import status from './status';
import table from './table';
import user from './user';
import wallet from './wallet';

export default combineReducers({
  user,
  wallet,
  modal,
  status,
  table,
});
