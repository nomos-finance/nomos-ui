import { useWeb3React } from '@web3-react/core'
import * as ethers from 'ethers'
import { Router, toBigNum } from 'qilin-sdk-v2'
import { useEffect, useMemo, useState } from 'react'

import { getABI } from '../utils/tool'
import useContractAddress from './useContractAddress'

export default (address: string | undefined): [ethers.ethers.Contract | undefined, boolean] => {
    const [res, setRes] = useState<ethers.ethers.Contract>()
    const [loading, setLoading] = useState<boolean>(false)
    const [contractAddress] = useContractAddress()
    const { account } = useWeb3React()

    useEffect(() => {
        if (address && contractAddress && account) {
            const fetch = async (): Promise<void> => {
                setLoading(true)
                try {
                    const r = new Router(address, { abi: getABI(contractAddress, 'Pool') })
                    await r.init()
                    const c = await r.getContract()
                    setRes(c as any)
                } catch (error) {
                    console.log(error)
                }
                setLoading(false)
            }
            fetch()
        }
        return () => {
            setRes(undefined)
        }
    }, [address, contractAddress, account])

    return useMemo(() => [res, loading], [res])
}
