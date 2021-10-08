interface IAction<T> {
    payload: {
        data: T
    }
    error?: boolean
}

interface IActionList<T> {
    payload: {
        data: IList<T>
    }
    error?: boolean
}

interface IList<T> {
    index: number
    page_size: number
    total: number
    list: T
}

interface IListParams {
    index: number
    page_size: number
}

interface IPool {
    pair: string
    fee: number
    oracle: string
    asset: string
    direction: string
}

interface IPoolParams {
    trade_pair: string
    pool_address: string
}
