import { Contract, ContractInterface, providers, Signer } from 'ethers'

let provider: providers.JsonRpcProvider

const connect = async () => {
    return window.ethereum.request({ method: 'eth_requestAccounts' }).catch(error => {
        if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.error('Please connect to MetaMask.')
        } else {
            console.error(error)
        }
    })
}

const setProvider = async (): Promise<void> => {
    if (window.ethereum) {
        await connect()
        provider = new providers.Web3Provider(window.ethereum)
    } else if (window.web3) {
        provider = new providers.Web3Provider(window.web3.currentProvider)
    } else {
        throw "can't find default provider"
    }
}

const getProvider = (url?: string): Promise<providers.JsonRpcProvider> => {
    return new Promise(async (resolve, _reject) => {
        if (url) {
            resolve(new providers.JsonRpcProvider(url))
        } else if (provider) {
            resolve(provider)
        } else {
            await setProvider()
            resolve(provider)
        }
    })
}

function getSigner(provider, account): Signer {
    return provider.getSigner(account).connectUnchecked()
}

function getProviderOrSigner(provider, account): Signer {
    return account ? getSigner(provider, account) : provider
}

window.addEventListener('load', async () => {
    setProvider()
})

export default async (address: string, abi: ContractInterface, account?: string): Promise<Contract> => {
    if (account) return new Contract(address, abi, getProviderOrSigner(await getProvider(), account))
    return new Contract(address, abi, await getProvider())
}
