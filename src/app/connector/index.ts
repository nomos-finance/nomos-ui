import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { LedgerConnector } from '../../libs/web3-data-provider/web3-providers/connectors/ledger-connector';
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletConnectConnector } from '../../libs/web3-data-provider/web3-providers/connectors/wallet-connect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { AuthereumConnector } from '@web3-react/authereum-connector';
import { TorusConnector } from '@web3-react/torus-connector';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';

import { MewConnectConnector } from '@myetherwallet/mewconnect-connector';
import { PortisConnector } from '../../libs/web3-data-provider/web3-providers/connectors/portis-connector';

import { supportedChainIds, NETWORK } from '../config';

export enum LedgerDerivationPath {
  'Legacy' = "44'/60'/0'/x",
  'LedgerLive' = "44'/60'/x'/0/0",
}

export interface ConnectorOptionalConfig {
  ledgerBaseDerivationPath: LedgerDerivationPath;
  accountsOffset: number;
  accountsLength: number;
}

export function getWeb3Connector(
  connectorName: string,
  currentNetwork: string,
  connectorConfig?: ConnectorOptionalConfig
): AbstractConnector {
  const networkConfig = NETWORK[currentNetwork];
  const networkId = networkConfig.chainId;

  switch (connectorName) {
    case 'browser':
      return new InjectedConnector({
        supportedChainIds,
      });
    case 'ledger':
      return new LedgerConnector({
        chainId: networkId,
        url: networkConfig.privateJsonRPCUrl || networkConfig.publicJsonRPCUrl || '',
        pollingInterval: 12000,
        baseDerivationPath: connectorConfig?.ledgerBaseDerivationPath,
        accountsOffset: connectorConfig?.accountsOffset,
        accountsLength: connectorConfig ? connectorConfig?.accountsLength : 0,
      });
    case 'wallet-link':
      const APP_NAME = 'Aave';
      const APP_LOGO_URL = 'https://aave.com/favicon.ico';
      return new WalletLinkConnector({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        url: networkConfig?.privateJsonRPCUrl || networkConfig?.publicJsonRPCUrl || '',
      });
    // case 'wallet-connect':
    //   return new WalletConnectConnector({
    //     rpc: supportedNetworks.reduce((acc, network) => {
    //       const config = NETWORK[network];
    //       acc[NETWORK[network].chainId] = config.privateJsonRPCUrl || config.publicJsonRPCUrl;
    //       return acc;
    //     }, {} as { [networkId: number]: string }),
    //     bridge: 'https://aave.bridge.walletconnect.org',
    //     qrcode: true,
    //     pollingInterval: POLLING_INTERVAL,
    //     preferredNetworkId: networkId,
    //   });
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
    case 'portis': {
      if (!process.env.REACT_APP_PORTIS_DAPP_ID) throw new Error('Portis DAPP id not specified');
      return new PortisConnector({
        dAppId: process.env.REACT_APP_PORTIS_DAPP_ID,
        networks: [networkId],
      });
    }
    case 'gnosis-safe': {
      return new SafeAppConnector();
    }
    default: {
      throw new Error(`unsupported connector name: ${connectorName}`);
    }
  }
}
