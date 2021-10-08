import { Action, createAction } from 'redux-actions'

import { BASE } from '../reducers/baseReducer/baseReducer'
import { contractAddress, IContractAddressResponse } from '../services/baseServer'
import { ITradeEthPriceResponse, ITradeLatestBlockResponse, tradeEthPrice, tradeLatestBlock } from '../services/tradeServer'
import { IPromise } from '../utils/request'

export const setViewWidth = (data: number): Action<number> => createAction(BASE.SET_VIEW_WIDTH, () => data)()
export const postTradeEthPrice = (): Action<IPromise<ITradeEthPriceResponse>> => createAction(BASE.POST_TRADE_ETH_PRICE, () => tradeEthPrice())()
export const postTradeLatestBlock = (): Action<IPromise<ITradeLatestBlockResponse>> => createAction(BASE.POST_TRADE_BLOCK, () => tradeLatestBlock())()
export const postContractAddress = (): Action<IPromise<IContractAddressResponse>> =>
    createAction(BASE.POST_CONTRACT_ADDRESS, () => contractAddress())()
