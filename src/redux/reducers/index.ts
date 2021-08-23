import { combineReducers } from 'redux';

import cache from './cache';
import library from './library';
import modal from './modal';
import pool from './pool';
import status from './status';
import user from './user';
import wallet from './wallet';

export default combineReducers({
  user,
  wallet,
  modal,
  status,
  pool,
  library,
  cache,
});
