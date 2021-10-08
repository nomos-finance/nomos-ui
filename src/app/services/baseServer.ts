import { IPromise, request } from '../utils/request'

export interface ISearchPoolParams extends IListParams, IPoolParams {
    oracle: number
    tvl: number
    apy: number
    earnging_profit_24h: number
}

export type ISearchPoolResponseItem = {
    pool_pair: string
    pool_address: string
    oracle: string
    tvl: number
    apy: number
    earnging_profit_24h: number
}

export type ISearchPoolResponse = IList<ISearchPoolResponseItem[]>

export function searchPool(data: ISearchPoolParams): IPromise<ISearchPoolResponse> {
    return request('/search_pool_pair', {
        method: 'POST',
        data
    })
}

export type IContractAddressResponse = {
    contract_name: string
    address: string
    abi: any
}[]

export function contractAddress(): IPromise<IContractAddressResponse> {
    return request('/contract_address', {
        method: 'POST'
    })
}

// export type ILiquidationParams = {
//     user_address: string
// }
// export type ILiquidationResponseItem = {
//     trade_pair: string
//     margin: number
//     type: number
//     reward: number
// }

// export type ILiquidationResponse = IList<ILiquidationResponseItem[]>

// export function liquidation(data: ILiquidationParams): IPromise<ILiquidationResponse> {
//     return request('/liquidation', {
//         method: 'POST',
//         data
//     })
// }
