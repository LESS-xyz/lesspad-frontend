import { combineReducers } from 'redux';

import modal from './modal';
import status from './status';
import user from './user';
import wallet from './wallet';
import pool from './pool';

export default combineReducers({
  user,
  wallet,
  modal,
  status,
  pool,
});
