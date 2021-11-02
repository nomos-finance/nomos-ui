import produce from 'immer';

import { errorHandle } from '../../utils';
import storage from '../../utils/storage';

export enum BASE {
  SET_VIEW_WIDTH = 'SET_VIEW_WIDTH',
  SET_NETWORK = 'SET_NETWORK',
  SET_PROVIDER_NAME = 'SET_PROVIDER_NAME',
  SET_ACCOUNT = 'SET_ACCOUNT',
}

export interface IBaseState {
  viewWidth: number;
  network: string;
  providerName: string;
  account: string;
}

export const baseState: IBaseState = {
  viewWidth: document.body.clientWidth,
  network: storage.get('network'),
  providerName: storage.get('providerName'),
  account: storage.get('account'),
};

const reducer = {
  [BASE.SET_VIEW_WIDTH]: {
    next: produce((draft: IBaseState, action: { payload: number }) => {
      draft.viewWidth = action.payload;
    }),
    throw: (state: any, action: any) => errorHandle(state, action),
  },
  [BASE.SET_NETWORK]: {
    next: produce((draft: IBaseState, action: { payload: string }) => {
      draft.network = action.payload;
    }),
    throw: (state: any, action: any) => errorHandle(state, action),
  },
  [BASE.SET_PROVIDER_NAME]: {
    next: produce((draft: IBaseState, action: { payload: string }) => {
      draft.providerName = action.payload;
    }),
    throw: (state: any, action: any) => errorHandle(state, action),
  },
  [BASE.SET_ACCOUNT]: {
    next: produce((draft: IBaseState, action: { payload: string }) => {
      draft.account = action.payload;
    }),
    throw: (state: any, action: any) => errorHandle(state, action),
  },
};

export default reducer;
