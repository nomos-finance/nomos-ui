import { useWeb3React } from '@web3-react/core';
import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

import storage from '../../utils/storage';
import { getShortenAddress } from '../../utils/tool';
import { useThemeContext } from '../../theme';
import classNames from 'classnames';

export interface IDialog {
  show(): void;
  hide(): void;
}

const LongDialog = forwardRef((props, ref) => {
  const { currentThemeName } = useThemeContext();
  const [LogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { account, deactivate, chainId } = useWeb3React();

  useImperativeHandle(ref, () => ({
    show: () => {
      setLogoutDialogOpen(true);
    },
    hide: () => {
      setLogoutDialogOpen(false);
    },
  }));

  return account ? (
    <>
      <Modal
        visible={LogoutDialogOpen}
        onCancel={() => setLogoutDialogOpen(false)}
        footer={null}
        wrapClassName={classNames('customDialog', 'logoutDialog', currentThemeName)}
        centered
        destroyOnClose={true}
        closable={false}
      >
        <div className="modalTitle">
          <div className="title">Account</div>
          <em onClick={() => setLogoutDialogOpen(false)}>x</em>
        </div>
        <div className="modalMain">
          <div className="content">
            <div className="account">
              <div className="address">{getShortenAddress(account)}</div>
            </div>
          </div>
        </div>
        <div className="ModalBtn">
          <div
            className="btn"
            onClick={() => {
              deactivate();
              storage.set('isLogout', true);
              storage.set('account', '');
              setLogoutDialogOpen(false);
            }}
          >
            Disconnect
          </div>
        </div>
      </Modal>
    </>
  ) : null;
});

export default LongDialog;
