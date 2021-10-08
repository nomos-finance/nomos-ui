import { IPromise, request } from '../utils/request'

export type IRewardLiquidationPoolsResponseItem = {
    pool: {
        pair: string
        fee: number
        oracle: string
        direction: string
        pool_token: string
        trade_token: string
    }
    pool_address: string
    total_liquidated_position: string
    total_liquidated_reward: string
    total_positions_amount: string
    pool_decimals: number
    pool_asset: string
    trade_decimals: number
    trade_asset: string
}
export type IRewardLiquidationPoolsResponse = IList<IRewardLiquidationPoolsResponseItem[]>

export function rewardLiquidationPools(data: IListParams): IPromise<IRewardLiquidationPoolsResponse> {
    return request(`/reward_liquidation_pools`, {
        method: 'POST',
        data
    })
}

export interface IRewardLiquidationPositionsParams extends IListParams {
    pool_address: string
}

export type IRewardLiquidationPositionsResponseItem = {
    pool_address: string
    open_price: string
    trade_token: string
    pool_token: string
    pool_direction: string
    margin: string
    position: string
    direction: string
    level: string
    rebase_accumulated_long: string
    rebase_accumulated_short: string
    open_rebase: string
    p_id: string
    token_id: string
    cur_price: string
    earn: string
    close_type: string
    rewards: string
    pool_decimals: number
    pool_asset: string
    trade_decimals: number
    trade_asset: string
}

export interface IRewardLiquidationPositionsResponse extends IList<IRewardLiquidationPositionsResponseItem[]> {
    total_value_liquidation_reward: number
}

export function rewardLiquidationPositions(data: IRewardLiquidationPositionsParams): IPromise<IRewardLiquidationPositionsResponse> {
    return request(`/reward_liquidation_positions`, {
        method: 'POST',
        data
    })
}

export type IRewardRebaseRewardsResponseItem = {
    id: number
    pool: IPool
    pool_address: string
    funding_rate: string
    count_down: string
    reward: string
    status: string
}

export type IRewardRebaseRewardsResponse = IList<IRewardRebaseRewardsResponseItem[]>

export function rewardRebaseRewards(data: IListParams): IPromise<IRewardRebaseRewardsResponse> {
    return request(`/reward_rebase_rewards`, {
        method: 'POST',
        data
    })
}

export type IRewardTradeRewardResponse = {
    pool: IPool
    total_value_reward: number
    total_value_rebase_reward: number
    total_value_liquidattion_reward: number
}

type IRewardTradeRewardParams = {
    pool_address: string
}

export function rewardTradeReward(data: IRewardTradeRewardParams): IPromise<IRewardTradeRewardResponse> {
    return request(`/reward_trade_reward`, {
        method: 'POST',
        data
    })
}
