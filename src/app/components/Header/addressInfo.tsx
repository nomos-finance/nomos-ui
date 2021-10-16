import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';
import { DropdownWrapper, rgba, textCenterEllipsis, useThemeContext } from '@aave/aave-ui-kit';
import { Network } from '@aave/protocol-js';

import { mapChainIdToName, useUserWalletDataContext } from '../../../libs/web3-data-provider';
import { useMenuContext } from '../../../libs/menu';
import ConnectButton from './connectButton';

export default function AddressInfo() {
  const { currentTheme } = useThemeContext();
  const { chainId } = useWeb3React();
  const {
    currentAccount,
    disconnectWallet,
    displaySwitchAccountModal,
    currentProviderName,
    availableAccounts,
  } = useUserWalletDataContext();
  const { closeMobileMenu } = useMenuContext();

  const [visible, setVisible] = useState(false);
  const networkName = chainId && mapChainIdToName(chainId);

  const formattedNetworkName =
    networkName === Network.polygon || networkName === Network.avalanche
      ? networkName
      : networkName === Network.mainnet || networkName === Network.fork
      ? `Ethereum Mainnet`
      : `${networkName} Test Network`;

  return (
    <div className="AddressInfo">
      {currentAccount ? (
        <DropdownWrapper
          visible={visible}
          setVisible={setVisible}
          horizontalPosition="right"
          verticalPosition="bottom"
          className="AddressInfo__dropdownWrapper"
          buttonComponent={
            <button
              className={classNames('AddressInfo__button', { AddressInfo__buttonActive: visible })}
              onClick={() => setVisible(!visible)}
              type="button"
            >
              <p>{formattedNetworkName}</p>
              <span>{textCenterEllipsis(currentAccount, 4, 4)}</span>
            </button>
          }
        >
          <div className="AddressInfo__content">
            <div className="AddressInfo__content-caption">
              <p className="AddressInfo__content-network">
                <i />
                <span>{networkName}</span>
              </p>
              <p className="AddressInfo__content-address">{currentAccount}</p>
            </div>

            {(currentProviderName?.includes('ledger') || availableAccounts.length > 1) && (
              <button
                className="AddressInfo__contentButton"
                type="button"
                onClick={() => displaySwitchAccountModal(true)}
              >
                <span>修改地址</span>
              </button>
            )}

            <button
              className="AddressInfo__contentButton"
              type="button"
              onClick={() => {
                disconnectWallet();
                closeMobileMenu();
              }}
            >
              <span>断开</span>
            </button>
          </div>
        </DropdownWrapper>
      ) : (
        <ConnectButton size="small" />
      )}
    </div>
  );
}
