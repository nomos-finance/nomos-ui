import './assets/index.scss';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import Modal from 'react-modal';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';

import * as serviceWorker from './serviceWorker';

import { ThemeProvider } from '@aave/aave-ui-kit';
import { LanguageProvider } from './libs/language-provider';
import { Web3Provider } from './libs/web3-data-provider';
import WrappedApolloProvider from './libs/apollo-config';
import { ReferralHandler } from './libs/referral-handler';
import { MenuProvider } from './libs/menu';
import { ProtocolDataProvider } from './libs/protocol-data-provider';
import { TxBuilderProvider } from './libs/tx-provider';

import App from './App';
import StaticPoolDataProviderWrapper from './components/PoolDataProviderWrapper';
import ErrorBoundary from './components/ErrorBoundary';

import globalStyle from './globalStyle';
import { WalletBalanceProvider } from './libs/wallet-balance-provider/WalletBalanceProvider';
import { getDefaultNetworkName, getSupportedNetworks } from './config';
import { UnlockWalletPreloader } from './components/UnlockWalletPreloader';
import ConnectWalletModal from './components/ConnectWalletModal';
import { PermissionProvider } from './libs/use-permissions/usePermissions';
import { DynamicPoolDataProvider } from './libs/pool-data-provider';
import { ConnectionStatusProvider } from './libs/connection-status-provider';

// app
import { ThemeProvider as ThemeProvider2 } from './app/theme';

Modal.setAppElement('#root');

ReactDOM.render(
  <ThemeProvider2>
    <HashRouter>
      <ReferralHandler>
        <LanguageProvider>
          <ThemeProvider>
            <ProtocolDataProvider>
              <WrappedApolloProvider>
                <ConnectionStatusProvider>
                  <MenuProvider>
                    <Web3ReactProvider
                      getLibrary={(provider) => new ethers.providers.Web3Provider(provider)}
                    >
                      <ErrorBoundary>
                        <Web3Provider
                          defaultNetwork={getDefaultNetworkName()}
                          supportedNetworks={getSupportedNetworks()}
                          preloader={UnlockWalletPreloader}
                          connectWalletModal={ConnectWalletModal}
                        >
                          <PermissionProvider>
                            <WalletBalanceProvider>
                              <StaticPoolDataProviderWrapper>
                                <DynamicPoolDataProvider>
                                  <TxBuilderProvider>
                                    <App />
                                  </TxBuilderProvider>
                                </DynamicPoolDataProvider>
                              </StaticPoolDataProviderWrapper>
                            </WalletBalanceProvider>
                          </PermissionProvider>
                        </Web3Provider>
                      </ErrorBoundary>
                    </Web3ReactProvider>
                  </MenuProvider>
                </ConnectionStatusProvider>
              </WrappedApolloProvider>
            </ProtocolDataProvider>
          </ThemeProvider>
        </LanguageProvider>
      </ReferralHandler>
    </HashRouter>

    <style jsx={true} global={true}>
      {globalStyle}
    </style>
  </ThemeProvider2>,
  document.getElementById('root')
);

serviceWorker.unregister();
