import gql from 'graphql-tag'

import { client, IApolloQueryResult } from '../apollo/client'

export interface ISearchPoolByIdRes {
    id: string
    symbol: string
    name: string
}

interface ISearchPoolTokenRes {
    asAddress: ISearchPoolByIdRes[]
}

export const searchPoolByID = async (id: string): Promise<ISearchPoolTokenRes> => {
    const query = gql`
        query pools($id: String) {
            asAddress: pools(where: { id: $id }) {
                id
                symbol
                name
            }
        }
    `
    const res = await client.query<ISearchPoolTokenRes>({
        query,
        variables: {
            id
        }
    })
    return res.data
}

export interface ITokenHourPriceHistoryParams {
    address: string
    skip: number
    startTime: number
}

export interface ITokenHourPriceHistoryResItem {
    periodStartUnix: string
    high: string
    low: string
    open: string
    close: string
}

export interface ITokenHourPriceHistoryRes {
    tokenHourDatas: ITokenHourPriceHistoryResItem[]
}
export const tokenHourPriceHistory = async (data: ITokenHourPriceHistoryParams): Promise<IApolloQueryResult<ITokenHourPriceHistoryRes>> => {
    const query = gql`
        query poolHourDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
            poolHourDatas(
                first: 100
                skip: $skip
                where: { pool: $address, periodStartUnix_gt: $startTime }
                orderBy: periodStartUnix
                orderDirection: asc
            ) {
                periodStartUnix
                high
                low
                open
                close
            }
        }
    `
    const res = await client.query<ITokenHourPriceHistoryRes>({
        query,
        variables: {
            ...data
        },
        fetchPolicy: 'no-cache'
    })
    return res
}
