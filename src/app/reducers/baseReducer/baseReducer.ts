import produce from 'immer'

import { IContractAddressResponse } from '../../services/baseServer'
import { ITradeEthPriceResponse, ITradeLatestBlockResponse } from '../../services/tradeServer'
import { errorHandle } from '../../utils'

export enum BASE {
    SET_VIEW_WIDTH = 'SET_VIEW_WIDTH',
    POST_TRADE_ETH_PRICE = 'POST_TRADE_ETH_PRICE',
    POST_TRADE_BLOCK = 'POST_TRADE_BLOCK',
    POST_CONTRACT_ADDRESS = 'POST_CONTRACT_ADDRESS'
}

export interface IBaseState {
    viewWidth: number
    ethPrice: number
    ethBlock: number
    contractAddress: IContractAddressResponse
}

export const baseState: IBaseState = {
    viewWidth: document.body.clientWidth,
    ethPrice: 0,
    ethBlock: 0,
    contractAddress: []
}

export default {
    [BASE.SET_VIEW_WIDTH]: {
        next: produce((draft: IBaseState, action: { payload: number }) => {
            draft.viewWidth = action.payload
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.POST_TRADE_ETH_PRICE]: {
        next: produce((draft: IBaseState, action: IAction<ITradeEthPriceResponse>) => {
            draft.ethPrice = 1 / action.payload.data.price.price_base_eth
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.POST_TRADE_BLOCK]: {
        next: produce((draft: IBaseState, action: IAction<ITradeLatestBlockResponse>) => {
            draft.ethBlock = action.payload.data.latest_block
        }),
        throw: (state, action) => errorHandle(state, action)
    },
    [BASE.POST_CONTRACT_ADDRESS]: {
        next: produce((draft: IBaseState, action: IAction<{ pool_address: IContractAddressResponse }>) => {
            draft.contractAddress = action.payload.data
        }),
        throw: (state, action) => errorHandle(state, action)
    }
}
