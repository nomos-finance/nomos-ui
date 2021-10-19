import { Action, createAction } from 'redux-actions';

import { BASE } from '../reducers/baseReducer/baseReducer';

export const setViewWidth = (data: number): Action<number> =>
  createAction(BASE.SET_VIEW_WIDTH, () => data)();
export const setNetwork = (data: string): Action<string> =>
  createAction(BASE.SET_NETWORK, () => data)();
export const setProviderName = (data: string): Action<string> =>
  createAction(BASE.SET_PROVIDER_NAME, () => data)();
