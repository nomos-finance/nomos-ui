// import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { MewConnectConnector } from '@myetherwallet/mewconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

import { injected, NETWORK, SupportedNetworks } from '@/app/connectors'

export type AvailableWeb3Connectors =
    | 'browser'
    | 'ledger'
    | 'fortmatic'
    | 'wallet-connect'
    | 'wallet-link'
    | 'mew-wallet'
    | 'authereum'
    | 'torus'
    | 'gnosis-safe'
    | 'portis'

export enum LedgerDerivationPath {
    'Legacy' = "44'/60'/0'/x",
    'LedgerLive' = "44'/60'/x'/0/0"
}

const POLLING_INTERVAL = 12000
const APP_NAME = 'Aave'
const APP_LOGO_URL = 'https://aave.com/favicon.ico'

export interface ConnectorOptionalConfig {
    ledgerBaseDerivationPath: LedgerDerivationPath
    accountsOffset: number
    accountsLength: number
}

function raiseUnsupportedNetworkError(network: string, connectorName: string): void {
    throw new Error(`${network} is not supported by ${connectorName}`)
}

export function getWeb3Connector(connectorName: string, currentNetwork: string): AbstractConnector {
    const networkConfig = NETWORK[currentNetwork]
    const networkId = networkConfig.chainId

    switch (connectorName) {
        case 'browser':
            return injected
        // TODO
        // case 'ledger':
        //     return new LedgerConnector({
        //         chainId: networkId,
        //         url: networkConfig.privateJsonRPCUrl || networkConfig.publicJsonRPCUrl,
        //         pollingInterval: 12000,
        //         baseDerivationPath: connectorConfig.ledgerBaseDerivationPath,
        //         accountsOffset: connectorConfig.accountsOffset,
        //         accountsLength: connectorConfig.accountsLength
        //     })
        case 'wallet-link':
            return new WalletLinkConnector({
                appName: APP_NAME,
                appLogoUrl: APP_LOGO_URL,
                url: networkConfig.privateJsonRPCUrl || networkConfig.publicJsonRPCUrl
            })
        // TODO
        // case 'wallet-connect':
        //     return new WalletConnectConnector({
        //         rpc: supportedNetworks.reduce((acc, network) => {
        //             const config = NETWORK[network]
        //             acc[NETWORK[network].chainId] = config.privateJsonRPCUrl || config.publicJsonRPCUrl
        //             return acc
        //         }, {} as { [networkId: number]: string }),
        //         bridge: 'https://aave.bridge.walletconnect.org',
        //         qrcode: true,
        //         pollingInterval: POLLING_INTERVAL,
        //         preferredNetworkId: networkId
        //     })
        case 'fortmatic':
            return new FortmaticConnector({
                chainId: networkId,
                apiKey: ''
            })
        case 'mew-wallet':
            return new MewConnectConnector({
                url:
                    networkConfig.privateJsonRPCWSUrl ||
                    networkConfig.privateJsonRPCUrl ||
                    networkConfig.publicJsonRPCWSUrl ||
                    networkConfig.publicJsonRPCUrl,
                windowClosedError: true
            })
        // case 'authereum': {
        //     if (currentNetwork !== 'mainnet') {
        //         raiseUnsupportedNetworkError(currentNetwork, connectorName)
        //     }
        //     return new AuthereumConnector({
        //         chainId: networkId,
        //         config: {
        //             networkName: currentNetwork,
        //             rpcUri: networkConfig.privateJsonRPCUrl || networkConfig.publicJsonRPCUrl,
        //             apiKey: AUTHEREUM_API_KEY
        //         }
        //     })
        // }
        case 'torus':
            return new TorusConnector({
                chainId: networkId,
                initOptions: {
                    network: {
                        host: currentNetwork === NETWORK['polygon'].chainName ? 'matic' : currentNetwork
                    },
                    showTorusButton: false,
                    enableLogging: false,
                    enabledVerifiers: false
                }
            })
        // case 'portis': {
        //     if (!PORTIS_DAPP_ID) throw new Error('Portis DAPP id not specified')
        //     return new PortisConnector({
        //         dAppId: PORTIS_DAPP_ID,
        //         networks: [networkId]
        //     })
        // }
        // case 'gnosis-safe': {
        //     return new SafeAppConnector()
        // }
        default: {
            throw new Error(`unsupported connector name: ${connectorName}`)
        }
    }
}
export function disconnectWeb3Connector(): void {
    const currentProvider = localStorage.getItem('currentProvider') as string | undefined
    switch (currentProvider) {
        case 'wallet-connect': {
            localStorage.removeItem('walletconnect')
            break
        }
        case 'wallet-link': {
            localStorage.removeItem('__WalletLink__:https://www.walletlink.org:SessionId')
            localStorage.removeItem('__WalletLink__:https://www.walletlink.org:Addresses')
            break
        }
        case 'ledger': {
            localStorage.removeItem('ledgerPath')
            localStorage.removeItem('selectedAccount')
            break
        }
        case 'torus': {
            localStorage.removeItem('loglevel')
            localStorage.removeItem('loglevel:torus-embed')
            break
        }
    }
    localStorage.removeItem('currentProvider')
}
