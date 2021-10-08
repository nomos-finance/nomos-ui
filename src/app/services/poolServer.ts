import { IPromise, request } from '../utils/request'

export type IPoolAllPoolsResponseItem = {
    pool: {
        pair: string
        oracle: string
        fee: number
        direction: string
        liquidity_pool: string
    }
    pool_address: string
    pool_token: string
    tvl?: string
    volume_24h?: string
    sum_size?: string
    sum_margin?: string
    price?: string
    open_interest?: string
    pool_asset: string
    pool_decimals: number
}
export type IPoolAllPoolsResponse = IList<IPoolAllPoolsResponseItem[]>

export function poolAllPools(data: IListParams): IPromise<IPoolAllPoolsResponse> {
    return request(`/pool_all_pools`, {
        method: 'POST',
        data
    })
}

export type IPoolCreatePoolParametersResponse = {
    tokens: string[]
    FeeTier: number[]
    poolAsset: string[]
}

export function poolCreatePoolParameters(): IPromise<IPoolCreatePoolParametersResponse> {
    return request(`/pool_create_pool_parameters`, {
        method: 'POST'
    })
}

export interface IPoolInformationParams {
    pool_address?: string
    pool?: {
        pair: string
        fee: string
        oracle?: string
        direction: string
        asset?: string
    }
}

export type IPoolInformationResponse = {
    pool: {
        pair: string
        fee: number
        oracle: string
        direction: string
    }
    trade_token: string
    pool_token: string
    uni_pool: string
    pool_address: string
    long: string
    short: string
    block_time: string
    block_height: string
    pending_liquidation: string
    sum_size: string
    sum_margin: string
    closing_ratio: string
    margin_ratio: number
    liq_ratio: number
    imbalance_threshold: number
    rebase_coefficient: string
    dynamic_algorithmic_slippage: number
    min_initial_margin: string
    service_rate: number
    leverage: Array<number>
}

export function poolInformation(data: IPoolInformationParams): IPromise<{ list: IPoolInformationResponse[] }> {
    return request(`/pool_information`, {
        method: 'POST',
        data
    })
}

export interface IPoolTransactionsLiquidityParams extends IListParams {
    pool_address: string
}

export type IPoolTransactionsLiquidityResponseItem = {
    account: string
    type: string
    amount: string
    block_height: string
    time?: string
}

export interface IPoolTransactionsLiquidityResponse extends IList<IPoolTransactionsLiquidityResponseItem[]> {
    pool: IPool
}

export function poolTransactionsLiquidity(data: IPoolTransactionsLiquidityParams): IPromise<IPoolTransactionsLiquidityResponse> {
    return request(`/pool_transactions_liquidity`, {
        method: 'POST',
        data
    })
}

export interface IPoolModifyNeedInfoParams {
    user_address: string
    pool_address: string
}

export interface IPoolModifyNeedInfoResponse {
    pool: IPool
    pool_address: string
    pool_current: {
        tvl: string
        earnings_profit_24h: string
        volume_24h: string
        apy: string
    }
    my_liquidity: {
        liquidity: string
        share_pool: string
        ls_token_amount: string
    }
}

export function poolModifyNeedInfo(data: IPoolModifyNeedInfoParams): IPromise<IPoolModifyNeedInfoResponse> {
    return request(`/pool_modify_need_info`, {
        method: 'POST',
        data
    })
}

export interface IPoolMyLiquidityParams extends IListParams {
    user_address: string
}

export type IPoolMyLiquidityResponseItem = {
    pool: {
        pair: string
        fee: number
        oracle: string
        direction: string
        pool_address: string
        pool_token: string
    }
    user_address: string
    pool_liquidity: string
    my_liquidity: string
    my_liquidity_shared: string
    pool_decimals: number
    pool_asset: string
}

export type IPoolMyLiquidityResponse = IList<IPoolMyLiquidityResponseItem[]>

export function poolMyLiquidity(data: IPoolMyLiquidityParams): IPromise<IPoolMyLiquidityResponse> {
    return request(`/pool_my_liquidity`, {
        method: 'POST',
        data
    })
}

export interface ITokensAddressParams {
    token_id?: string
    token_symbol?: string
}

export interface ITokensAddressResponseItem {
    token_symbol: string
    token_id: string
}
export interface ITokensAddressResponse {
    pg_status: string
    pg_error: string
    data: ITokensAddressResponseItem[]
}

export function tokensAddress(data: ITokensAddressParams): IPromise<ITokensAddressResponse> {
    return request(`/tokens_address`, {
        method: 'POST',
        data
    })
}
