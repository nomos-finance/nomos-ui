import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { Router } from 'qilin-sdk-v2'
import { useEffect, useMemo, useState } from 'react'

import { getABI } from '../utils/tool'
import useContractAddress from './useContractAddress'

export default (
    address: string | undefined
): [string | undefined, number | undefined, boolean, (newAddress?: string) => Promise<{ balance: string; decimals: number } | void>] => {
    const [balance, setBalance] = useState<string>()
    const [decimals, setDecimals] = useState<number>()
    const [loading, setLoading] = useState<boolean>(false)
    const [contractAddress] = useContractAddress()
    const { account } = useWeb3React()
    const [hash, setHash] = useState<string>()

    const fetch = async (newAddress?: string): Promise<{ balance: string; decimals: number } | void> => {
        if (newAddress) {
            setHash(newAddress)
        }
        if (hash && contractAddress && account) {
            setLoading(true)
            try {
                const r = new Router(hash, { abi: getABI(contractAddress, 'Pool') })
                await r.init()
                const b = await r.getContract().balanceOf(account)
                const d = await r.getContract().decimals()
                setBalance(new BigNumber(b.toString()).dividedBy(new BigNumber(10).pow(d)).toFixed())
                setDecimals(d)
                return {
                    balance: b,
                    decimals: d
                }
            } catch (error) {
                console.log(error)
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        if (address) {
            setHash(address)
        }
        return () => {
            setHash(undefined)
        }
    }, [address])

    useEffect(() => {
        fetch()
        return () => {
            setBalance(undefined)
        }
    }, [hash, contractAddress, account])

    return [balance, decimals, loading, fetch]
}
