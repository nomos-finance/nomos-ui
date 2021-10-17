import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { MewConnectConnector } from '@myetherwallet/mewconnect-connector';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { AuthereumConnector } from '@web3-react/authereum-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { TorusConnector } from '@web3-react/torus-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

interface INEXTWORK {
  [key: string]: {
    chainId: number;
    chainKey: string;
    chainName: string;
    publicJsonRPCUrl?: string;
    publicJsonRPCWSUrl?: string;
    privateJsonRPCUrl?: string;
    privateJsonRPCWSUrl?: string;
  };
}

export const NETWORK: INEXTWORK = {
  mainnet: {
    chainId: 1,
    chainKey: 'mainnet',
    chainName: 'Mainnet',
    publicJsonRPCUrl: 'https://eth-mainnet.alchemyapi.io/v2/demo',
    publicJsonRPCWSUrl: 'wss://eth-mainnet.alchemyapi.io/v2/demo',
  },
  ropsten: {
    chainId: 3,
    chainKey: 'ropsten',
    chainName: 'Ropsten',
  },
  rinkeby: {
    chainId: 4,
    chainKey: 'rinkeby',
    chainName: 'Rinkeby',
  },
  gorli: {
    chainId: 5,
    chainKey: 'gorli',
    chainName: 'Görli',
  },
  kovan: {
    chainId: 42,
    chainKey: 'kovan',
    chainName: 'Kovan',
    publicJsonRPCUrl: 'https://kovan.poa.network',
  },
  polygon: {
    chainId: 137,
    chainKey: 'polygon',
    chainName: 'Polygon',
    publicJsonRPCUrl: 'https://polygon-rpc.com',
    publicJsonRPCWSUrl: 'wss://polygon-rpc.com',
  },
  fork: {
    chainId: 1337,
    chainKey: 'fork',
    chainName: 'Fork',
    privateJsonRPCUrl: 'http://127.0.0.1:8545',
    privateJsonRPCWSUrl: 'ws://127.0.0.1:8545',
  },
  mumbai: {
    chainId: 80001,
    chainKey: 'mumbai',
    chainName: 'Mumbai',
    publicJsonRPCUrl: 'https://rpc-mumbai.matic.today',
    publicJsonRPCWSUrl: 'wss://rpc-mumbai.matic.today',
  },
  polygon_fork: {
    chainId: 1338,
    chainKey: 'polygon_fork',
    chainName: 'Polygon Fork',
  },
  avalanche: {
    chainId: 43114,
    chainKey: 'avalanche',
    chainName: 'Avalanche',
  },
  avalanche_fork: {
    chainId: 1337,
    chainKey: 'avalanche_fork',
    chainName: 'Avalanche Fork',
  },
  fuji: {
    chainId: 43113,
    chainKey: 'fuji',
    chainName: 'Fuji',
    publicJsonRPCUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    publicJsonRPCWSUrl: 'wss://api.avax-test.network/ext/bc/C/rpc',
  },
  arbitrum_one: {
    chainId: 42161,
    chainKey: 'arbitrum_one',
    chainName: 'Arbitrum One',
    publicJsonRPCUrl: 'https://arb1.arbitrum.io/rpc',
  },
  arbitrum_rinkeby: {
    chainId: 421611,
    publicJsonRPCUrl: 'https://rinkeby.arbitrum.io/rpc',
    chainKey: 'arbitrum_rinkeby',
    chainName: 'Arbitrum Rinkeby',
  },
};

export const SupportedNetworks = [
  NETWORK['mainnet'],
  NETWORK['polygon'],
  NETWORK['avalanche'],
  NETWORK['arbitrum_one'],
];

const supportedChainIds: Array<number> = [];

Object.values(NETWORK).forEach((item) => {
  supportedChainIds.push(item.chainId);
});

export const injected = new InjectedConnector({
  supportedChainIds,
});

export function getWeb3Connector(connectorName: string, currentNetwork: string): AbstractConnector {
  const networkConfig = NETWORK[currentNetwork];
  const networkId = networkConfig.chainId;

  switch (connectorName) {
    case 'browser':
      const supportedChainIds: Array<number> = [];

      Object.values(NETWORK).forEach((item) => {
        supportedChainIds.push(item.chainId);
      });
      return new InjectedConnector({
        supportedChainIds,
      });
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
      const APP_NAME = 'Aave';
      const APP_LOGO_URL = 'https://aave.com/favicon.ico';
      return new WalletLinkConnector({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        url: networkConfig?.privateJsonRPCUrl || networkConfig?.publicJsonRPCUrl || '',
      });
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
        apiKey: '',
      });
    case 'mew-wallet':
      return new MewConnectConnector({
        url:
          networkConfig.privateJsonRPCWSUrl ||
          networkConfig.privateJsonRPCUrl ||
          networkConfig.publicJsonRPCWSUrl ||
          networkConfig.publicJsonRPCUrl ||
          '',
        windowClosedError: true,
      });
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
            host: currentNetwork === NETWORK['polygon'].chainName ? 'matic' : currentNetwork,
          },
          showTorusButton: false,
          enableLogging: false,
          enabledVerifiers: false,
        },
      });
    // case 'portis': {
    //     if (!PORTIS_DAPP_ID) throw new Error('Portis DAPP id not specified')
    //     return new PortisConnector({
    //         dAppId: PORTIS_DAPP_ID,
    //         networks: [networkId]
    //     })
    // }
    case 'gnosis-safe': {
      return new SafeAppConnector();
    }
    default: {
      throw new Error(`unsupported connector name: ${connectorName}`);
    }
  }
}
