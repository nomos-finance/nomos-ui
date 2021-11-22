import './loginDialog.styl';

import { useWeb3React } from '@web3-react/core';
import { Dropdown, Menu, Modal, Input } from 'antd';
import classNames from 'classnames';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';

import { NETWORK, SupportedNetworks, getFortmaticKeyByNetwork } from '../../config';
import { useThemeContext } from '../../theme';

import { getWeb3Connector } from '../../connector';
import * as icons from './img';
import storage from '../../utils/storage';
import useInactiveListener from './hooks/useInactiveListener';

import { setNetwork, setProviderName, setAccount } from '../../actions/baseAction';
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

const isEthereumObjectOnWindow = (global: WindowWithEthereum) =>
  global.ethereum && typeof global.ethereum === 'object';

const getWeb3ProviderFromBrowser = (): ethers.providers.Web3Provider | undefined => {
  const global = window as WindowWithEthereum;
  return isEthereumObjectOnWindow(global) ? global.ethereum : global.web3 ? global.web3 : undefined;
};

export default forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { currentThemeName } = useThemeContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { account, activate } = useWeb3React();
  const [preferredNetwork, setPreferredNetwork] = useState<string>(SupportedNetworks[0].chainKey);
  const providerName = storage.get('providerName');
  const network = storage.get('network');
  const storedAccount = storage.get('account');
  const isImToken = !!window.imToken;
  const browserWalletProvider = getWeb3ProviderFromBrowser();
  const [selectProviderName, setSelectProviderName] = useState<string>();

  const wallets: Wallet[] = [
    {
      title: isImToken ? 'imToken' : 'Browser',
      description: '(MetaMask, Trustwallet, Enjin)',
      providerName: 'browser',
      icon: isImToken ? icons.imToken : icons.browserWallets,
      disabled: !browserWalletProvider,
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
      notSupported:
        preferredNetwork === NETWORK.polygon.chainKey ||
        preferredNetwork === NETWORK.avalanche.chainKey,
    },
    {
      title: 'MEW wallet',
      providerName: 'mew-wallet',
      icon: icons.MEWIcon,
      notSupported: preferredNetwork !== NETWORK.mainnet.chainKey,
    },
    {
      title: 'Coinbase',
      providerName: 'wallet-link',
      icon: icons.coinbaseIcon,
      notSupported: preferredNetwork === NETWORK.avalanche.chainKey,
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
      notSupported: preferredNetwork === NETWORK.avalanche.chainKey,
    },
    {
      title: 'Fortmatic',
      providerName: 'fortmatic',
      icon: icons.formaticIcon,
      notSupported:
        !getFortmaticKeyByNetwork(preferredNetwork) ||
        preferredNetwork === NETWORK.polygon.chainKey ||
        preferredNetwork === NETWORK.avalanche.chainKey,
    },
    {
      title: 'imToken',
      providerName: 'wallet-connect',
      icon: icons.imToken,
      notSupported:
        isImToken ||
        preferredNetwork === NETWORK.polygon.chainKey ||
        preferredNetwork === NETWORK.avalanche.chainKey,
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
    try {
      await activate(getWeb3Connector(providerName, network));
      storage.set('providerName', providerName);
      storage.set('network', network);
      storage.set('isLogout', '');
      setDialogOpen(false);
      dispatch(setNetwork(network));
      dispatch(setProviderName(network));
    } catch (error) {
      console.log(error);
    }
  };

  const onSelectSupperNetwork = (network: string): void => {
    dispatch(setProviderName(network));
    storage.set('providerName', providerName);
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
      dispatch(setAccount(account));
    } else if (storedAccount) {
      storage.set('account', account);
      dispatch(setAccount(storedAccount));
    }
    return () => {
      storage.set('account', '');
      dispatch(setAccount(''));
    };
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
      width={800}
    >
      <div className="modalTitle">
        <div className="title">Connect your wallet</div>
      </div>
      <div className="modalMain">
        <div className="walletHeader">
          <div className="title">Select preferred network</div>
          <Dropdown overlay={preferredMenu}>
            <div
              className="select"
              onClick={() => onSelectSupperNetwork(NETWORK[preferredNetwork].chainName)}
            >
              {NETWORK[preferredNetwork].chainName}
            </div>
          </Dropdown>
        </div>
        <div className="wallet">
          {wallets
            .filter((wallet) => !wallet.notSupported)
            .map((item, index) => (
              <div
                className="item"
                key={index}
                onClick={() => setSelectProviderName(item.providerName)}
              >
                <div>
                  <img src={item.icon} alt="" />
                  {item.title}
                </div>
              </div>
            ))}
        </div>
        <div className="foot">
          <div className="form">
            <div className="label">子协议ID</div>
            <div className="input">
              <Input bordered={false} />
              <div> *使用子协议可获得额外奖励</div>
            </div>
          </div>
          {selectProviderName && (
            <div className="btn" onClick={() => onLogin(selectProviderName, preferredNetwork)}>
              连接
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
});
