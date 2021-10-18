import './loginDialog.styl';

import { useWeb3React } from '@web3-react/core';
import { Dropdown, Menu, Modal } from 'antd';
import classNames from 'classnames';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

import { NETWORK, SupportedNetworks } from '../../connectors';
import { useThemeContext } from '../../theme';

import { getWeb3Connector } from '../../connectors';
import * as icons from './img';
import storage from '../../utils/storage';
import useInactiveListener from './hooks/useInactiveListener';
export interface IDialog {
  show(): void;
  hide(): void;
}

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
  | 'portis';

export interface Wallet {
  title: string;
  description?: string;
  providerName: AvailableWeb3Connectors;
  icon: string;
  disabled?: boolean;
  notSupported?: boolean;
  errorMessage?: string;
}

export default forwardRef((props, ref) => {
  const { currentThemeName } = useThemeContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { account, activate, active, error, chainId } = useWeb3React();
  const [preferredNetwork, setPreferredNetwork] = useState<string>('mainnet');
  const providerName = storage.get('providerName');
  const network = storage.get('network');
  const isImToken = !!window.imToken;

  const wallets: Wallet[] = [
    {
      title: isImToken ? 'imToken' : 'Browser',
      description: '(MetaMask, Trustwallet, Enjin)',
      providerName: 'browser',
      icon: isImToken ? icons.imToken : icons.browserWallets,
      // disabled: !browserWalletProvider,
      // errorMessage: intl.formatMessage(messages.noBrowserBrowserWallet),
    },
    {
      title: 'Portis',
      providerName: 'portis',
      icon: icons.portisIcon,
      // notSupported: !PORTIS_DAPP_ID || preferredNetwork === Network.avalanche,
    },
    {
      title: 'Ledger',
      providerName: 'ledger',
      icon: icons.ledgerIcon,
      // notSupported: preferredNetwork === Network.polygon || preferredNetwork === Network.avalanche,
    },
    {
      title: 'MEW wallet',
      providerName: 'mew-wallet',
      icon: icons.MEWIcon,
      // notSupported: preferredNetwork !== Network.mainnet,
    },
    {
      title: 'Coinbase',
      providerName: 'wallet-link',
      icon: icons.coinbaseIcon,
      // notSupported: preferredNetwork === Network.avalanche,
    },
    {
      title: 'Authereum',
      providerName: 'authereum',
      icon: icons.authereumIcon,
      // notSupported: !AUTHEREUM_API_KEY || preferredNetwork !== Network.mainnet,
    },
    {
      title: 'Wallet Connect',
      providerName: 'wallet-connect',
      icon: icons.walletConnectIcon,
    },
    {
      title: 'Torus',
      providerName: 'torus',
      icon: icons.torusIcon,
      // notSupported: preferredNetwork === Network.avalanche,
    },
    {
      title: 'Fortmatic',
      providerName: 'fortmatic',
      icon: icons.formaticIcon,
      // notSupported:
      //   !getFortmaticKeyByNetwork(preferredNetwork) ||
      //   preferredNetwork === Network.polygon ||
      //   preferredNetwork === Network.avalanche,
    },
    {
      title: 'imToken',
      providerName: 'wallet-connect',
      icon: icons.imToken,
      // notSupported:
      //   isImToken || preferredNetwork === Network.polygon || preferredNetwork === Network.avalanche,
    },
  ];

  const preferredMenu = (
    <Menu>
      {SupportedNetworks.map((item) => (
        <Menu.Item key={item.chainId} onClick={() => setPreferredNetwork(item.chainKey)}>
          {item.chainName}
        </Menu.Item>
      ))}
    </Menu>
  );

  const onLogin = async (providerName: string, network: string): Promise<void> => {
    await activate(getWeb3Connector(providerName, network));
    storage.set('providerName', providerName);
    storage.set('network', network);
    storage.set('isLogout', '');
    setDialogOpen(false);
  };

  useImperativeHandle(ref, () => ({
    show: () => {
      setDialogOpen(true);
    },
    hide: () => {
      setDialogOpen(false);
    },
  }));

  useInactiveListener(
    providerName ? getWeb3Connector(providerName, network) : undefined,
    !storage.get('account')
  );

  useEffect(() => {
    if (account) {
      storage.set('account', account);
    }
  }, [account]);

  useEffect(() => {
    if (!storage.get('isLogout') && providerName && network) {
      activate(getWeb3Connector(providerName, network));
    }
    return () => {};
  }, []);

  return (
    <Modal
      visible={dialogOpen}
      onCancel={() => setDialogOpen(false)}
      footer={null}
      wrapClassName={classNames('customDialog', 'loginDialog', currentThemeName)}
      centered
      destroyOnClose={true}
      closable={false}
    >
      <div className="modalTitle">
        <div className="title">Account</div>
      </div>
      <div className="modalMain">
        <div>Select preferred network</div>
        <Dropdown overlay={preferredMenu}>
          <div className="box">{NETWORK[preferredNetwork].chainName}</div>
        </Dropdown>
        <div className="wallet">
          {wallets
            .filter((wallet) => !wallet.notSupported)
            .map((item, index) => (
              <div
                className="item"
                key={index}
                onClick={() => onLogin(item.providerName, preferredNetwork)}
              >
                <img src={item.icon} alt="" />
                {item.title}
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
});
