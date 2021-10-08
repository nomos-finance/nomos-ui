import { Router } from 'qilin-sdk-v2'
import { useEffect, useState } from 'react'

import { getABI, getContractAddress } from '../utils/tool'
import useContractAddress from './useContractAddress'

export default (): [Router | undefined, string | undefined] => {
    const [contractAddress] = useContractAddress()
    const [router, setRouter] = useState<Router>()
    const [address, setAddress] = useState<string>()

    useEffect(() => {
        if (contractAddress) {
            const fetch = async (): Promise<void> => {
                const routerAbi = getABI(contractAddress, 'Router')
                const routerAddress = getContractAddress(contractAddress, 'Router')
                if (routerAbi && routerAddress) {
                    const r = new Router(routerAddress, { abi: routerAbi })
                    await r.init()
                    setRouter(r)
                    setAddress(routerAddress)
                }
            }
            fetch()
        }
        return () => {
            setRouter(undefined)
        }
    }, [contractAddress])

    return [router, address]
}
