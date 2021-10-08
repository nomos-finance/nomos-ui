import { IPromise, request } from '../utils/request'

export interface Pool {
    pair: string
    fee: string
    direction: string
}
export interface ITradeHeadParams {
    pool_address: string
}
export interface ITradeHeadResponseItem {
    id: number
    trade_pair: string
    pool_address: string
    funding_rate: string
    count_down: string
    reward: string
    status: string
    pool: Pool
    pool_token: string
    uni_pool: string
    trade_token: string
    volume_24h: string
    price: string
    pool_symbol: string
    trade_symbol: string
}

export type ITradeHeadResponse = IList<ITradeHeadResponseItem[]>

export function tradeHead(data: ITradeHeadParams): IPromise<ITradeHeadResponse> {
    return request(`/trade_head`, {
        method: 'POST',
        data
    })
}

export interface ITradeHeadRebaseResponse {
    rebase_waite_time: number
    rebase_funding_rate: number
    long_short: number
    rebase_rewards: number
}

export function tradeHeadRebase(data: IPoolParams): IPromise<ITradeHeadRebaseResponse> {
    return request(`/trade_head_rebase`, {
        method: 'POST',
        data
    })
}

export interface ITradeTradesParams extends IListParams, IPoolParams {}

export interface ITradeTradesResponseItem {
    id: number
    price: string
    side: string
    size: string
    time_: string
    account: string
    type: string
}

export interface ITradeTradesResponse extends IList<ITradeTradesResponseItem[]> {
    pool: IPool
    pool_address: string
}

export function tradeTrades(data: ITradeTradesParams): IPromise<ITradeTradesResponse> {
    return request(`/trade_trades`, {
        method: 'POST',
        data
    })
}

export interface ITradeOpenedPositionsParams {
    user_address: string
    pool_address: string
}

export interface ITradeOpenedPositionsResponseItem {
    open_price: string
    side: string
    size: string
    account: string
    margin: string
    liq_price: string
    pnl: string
    p_id: string
    token_id: string
    funding_fee: string
    level: string
    service_fee: string
    close_type: string
    status: string
    close_block_height: string
}

export interface ITradeOpenedPositionsResponse extends IList<ITradeOpenedPositionsResponseItem[]> {
    pool: IPool
}

export function tradeOpenedPositions(data: ITradeOpenedPositionsParams): IPromise<ITradeOpenedPositionsResponse> {
    return request(`/trade_opened_positions`, {
        method: 'POST',
        data
    })
}

export type ITradeClosedPositionsParams = ITradeOpenedPositionsParams

export interface ITradeClosedPositionsResponseItem {
    id: number
    side: string
    level: number
    margin: number
    size: number
    open_price: number
    liq_price: number
    funding_fee: number
    pnl: number
    close_price: number
    service_fee: number
    status: string
    close_type: string
}

export interface ITradeClosedPositionsResponse extends IList<ITradeClosedPositionsResponseItem[]> {
    pool: IPool
}

export function tradeClosedPositions(data: ITradeClosedPositionsParams): IPromise<ITradeClosedPositionsResponse> {
    return request(`/trade_closed_positions`, {
        method: 'POST',
        data
    })
}

export type ITradePriceParams = {
    trade_pair: string
    time: string
    total: number
}

export type ITradePriceResponseItem = {
    time: string
    open: number
    high: number
    low: number
    close: number
}
export type ITradePriceResponse = IList<ITradePriceResponseItem[]>

export function tradePrice(data: ITradePriceParams): IPromise<ITradePriceResponse> {
    return request(`/trade_price`, {
        method: 'POST',
        data
    })
}

export type ITradeLatestBlockResponse = {
    latest_block: number
}

export function tradeLatestBlock(): IPromise<ITradeLatestBlockResponse> {
    return request(`/trade_latest_block`, {
        method: 'POST'
    })
}

export type ITradeEthPriceResponse = {
    eth_price: number
}
export function tradeEthPrice(): IPromise<ITradeEthPriceResponse> {
    return request(`/trade_eth_price`, {
        method: 'POST'
    })
}
export interface ITradeTokenAddressParams {
    token_id: string
    token_symbol: string
}
export interface ITradeTokenAddressResponse {
    data: Array<ITradeTokenAddressParams>
}
export function getTokenMessage(data: ITradeTokenAddressParams): IPromise<ITradeTokenAddressResponse> {
    return request(`/tokens_price`, {
        method: 'POST',
        data
    })
}
