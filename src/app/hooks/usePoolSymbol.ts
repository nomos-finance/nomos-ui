import { Router } from 'qilin-sdk-v2'
import { useEffect, useState } from 'react'

import { getABI } from '../utils/tool'
import useContractAddress from './useContractAddress'

export default (address: string | undefined): [string | undefined, boolean, (newAddress?: string) => Promise<string | void>] => {
    const [symbol, setSymbol] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)
    const [contractAddress] = useContractAddress()

    const fetch = async (newAddress?: string): Promise<void> => {
        if (newAddress) {
            address = newAddress
        }
        if (address && address.length === 42 && !isNaN(Number(address)) && contractAddress) {
            setLoading(true)
            try {
                const r = new Router(newAddress || address, { abi: getABI(contractAddress, 'Pool') })
                await r.init()
                const s = await r.getContract().symbol()
                setSymbol(s)
                return s
            } catch (error) {
                console.log('Invalid token address')
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        fetch()
        return () => {
            setSymbol(undefined)
        }
    }, [address, contractAddress])

    return [symbol, loading, fetch]
}
