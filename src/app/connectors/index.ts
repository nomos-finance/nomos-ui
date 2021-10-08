import { InjectedConnector } from '@web3-react/injected-connector'

export enum SupportedChainId {
    MAINNET = 1,
    ROPSTEN = 3,
    RINKEBY = 4,
    GOERLI = 5,
    KOVAN = 42
}

export const NETWORK_PREFIX: { [chainId in SupportedChainId | number]: string } = {
    [SupportedChainId.MAINNET]: 'mainnet',
    [SupportedChainId.RINKEBY]: 'rinkeby',
    [SupportedChainId.ROPSTEN]: 'ropsten',
    [SupportedChainId.GOERLI]: 'gorli',
    [SupportedChainId.KOVAN]: 'kovan'
}

export const NETWORK_LABELS: { [chainId in SupportedChainId | number]: string } = {
    [SupportedChainId.MAINNET]: 'Mainnet',
    [SupportedChainId.RINKEBY]: 'Rinkeby',
    [SupportedChainId.ROPSTEN]: 'Ropsten',
    [SupportedChainId.GOERLI]: 'Görli',
    [SupportedChainId.KOVAN]: 'Kovan'
}

const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
    SupportedChainId.MAINNET,
    SupportedChainId.KOVAN,
    SupportedChainId.GOERLI,
    SupportedChainId.RINKEBY,
    SupportedChainId.ROPSTEN
]

export const injected = new InjectedConnector({
    supportedChainIds: SUPPORTED_CHAIN_IDS
    // supportedChainIds: [1, 3, 4, 5, 42, 56, 101, 1337]
})
