import { Action, createAction } from 'redux-actions';

import { BASE } from '../reducers/baseReducer/baseReducer';

export const setViewWidth = (data: number): Action<number> =>
  createAction(BASE.SET_VIEW_WIDTH, () => data)();
