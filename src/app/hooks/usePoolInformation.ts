import { useEffect, useState } from 'react'

import { IPoolInformationParams, IPoolInformationResponse, poolInformation } from '../services/poolServer'

export default (data: IPoolInformationParams): [IPoolInformationResponse | undefined, boolean] => {
    const [loading, setLoading] = useState(false)
    const [info, setInfo] = useState<IPoolInformationResponse>()

    const loadData = async (): Promise<void> => {
        setLoading(true)
        const res = await poolInformation(data)
        if (res.data && res.data?.list.length) {
            setInfo(res.data.list[0])
        }
        setLoading(false)
    }

    useEffect(() => {
        if (data.pool_address || (data.pool && data.pool.fee && data.pool.pair)) {
            loadData()
        }
        return () => {
            setInfo(undefined)
        }
    }, [data.pool_address, data.pool])

    return [info, loading]
}
