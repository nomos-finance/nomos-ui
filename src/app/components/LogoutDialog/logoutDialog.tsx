import './logoutDialog.styl';
import { useWeb3React } from '@web3-react/core';
import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import storage from '../../utils/storage';
import { getShortenAddress } from '../../utils/tool';
import { useThemeContext } from '../../theme';
import classNames from 'classnames';
import { disconnectWeb3Connector } from '../../connector';
import { IRootState } from '../../reducers/RootState';
import { setAccount } from '../../actions/baseAction';

export interface IDialog {
  show(): void;
  hide(): void;
}

const LongDialog = forwardRef((props, ref) => {
  const { currentThemeName } = useThemeContext();
  const [LogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { deactivate } = useWeb3React();
  const { account } = useSelector((store: IRootState) => store.base);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    show: () => {
      setLogoutDialogOpen(true);
    },
    hide: () => {
      setLogoutDialogOpen(false);
    },
  }));

  return (
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
            <div className="address">{account ? getShortenAddress(account) : null}</div>
          </div>
        </div>
      </div>
      <div className="ModalBtn">
        <div
          className="btn"
          onClick={() => {
            deactivate();
            disconnectWeb3Connector();
            storage.set('isLogout', true);
            storage.set('account', '');
            dispatch(setAccount(''));
            setLogoutDialogOpen(false);
          }}
        >
          Disconnect
        </div>
      </div>
    </Modal>
  );
});

export default LongDialog;
