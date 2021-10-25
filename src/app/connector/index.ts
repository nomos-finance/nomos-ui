import { AbstractConnector } from '@web3-react/abstract-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { LedgerConnector } from '../../web3-data-provider/web3-providers/connectors/ledger-connector';
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletConnectConnector } from '../../web3-data-provider/web3-providers/connectors/wallet-connect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { AuthereumConnector } from '@web3-react/authereum-connector';
import { TorusConnector } from '@web3-react/torus-connector';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';

import { MewConnectConnector } from '@myetherwallet/mewconnect-connector';
import { PortisConnector } from '../../web3-data-provider/web3-providers/connectors/portis-connector';

import { supportedChainIds, SupportedNetworks, NETWORK } from '../config';

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
    case 'wallet-connect':
      return new WalletConnectConnector({
        rpc: SupportedNetworks.reduce((acc, item) => {
          const rpc = item.publicJsonRPCUrl || item.privateJsonRPCUrl;
          if (rpc) {
            acc[item.chainId] = rpc;
          }
          return acc;
        }, {} as { [networkId: number]: string }),
        bridge: 'https://aave.bridge.walletconnect.org',
        qrcode: true,
        pollingInterval: 12000,
        preferredNetworkId: networkId,
      });
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
    case 'authereum': {
      if (currentNetwork !== 'mainnet') {
        new Error(`${currentNetwork} is not supported by ${connectorName}`);
      }
      return new AuthereumConnector({
        chainId: networkId,
        config: {
          networkName: currentNetwork,
          rpcUri: networkConfig.privateJsonRPCUrl || networkConfig.publicJsonRPCUrl,
          apiKey: undefined,
        },
      });
    }
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
      if (!process.env?.REACT_APP_PORTIS_DAPP_ID) throw new Error('Portis DAPP id not specified');
      return new PortisConnector({
        dAppId: process.env?.REACT_APP_PORTIS_DAPP_ID,
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

export function disconnectWeb3Connector(): void {
  const currentProvider = localStorage.getItem('currentProvider') as string | undefined;
  switch (currentProvider) {
    case 'wallet-connect': {
      localStorage.removeItem('walletconnect');
      break;
    }
    case 'wallet-link': {
      localStorage.removeItem('__WalletLink__:https://www.walletlink.org:SessionId');
      localStorage.removeItem('__WalletLink__:https://www.walletlink.org:Addresses');
      break;
    }
    case 'ledger': {
      localStorage.removeItem('ledgerPath');
      localStorage.removeItem('selectedAccount');
      break;
    }
    case 'torus': {
      localStorage.removeItem('loglevel');
      localStorage.removeItem('loglevel:torus-embed');
      break;
    }
  }
  localStorage.removeItem('currentProvider');
}
