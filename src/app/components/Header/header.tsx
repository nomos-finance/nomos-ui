/*eslint-disable import/no-anonymous-default-export */
import './header.styl';

import classnames from 'classnames';
import React, { useRef, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import { Popover } from 'antd';
import { useTranslation } from 'react-i18next';

import LoginDialog from '../LoginDialog';
import LogoutDialog, { IDialog as ILogoutDialog } from '../LogoutDialog';
import { useThemeContext } from '../../theme';
import { getShortenAddress } from '../../utils/tool';
import Icon from '../../../assets/icons';
import Dark from './img/dark.png';
import Default from './img/default.png';
import { disconnectWeb3Connector } from '../../connector';
import storage from '../../utils/storage';

import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from 'app/reducers/RootState';
import { setAccount, setLoginDialogShow } from 'app/actions/baseAction';

export default (): React.ReactElement => {
  const [t] = useTranslation();
  const history = useHistory();
  const LogoutDialogRef = useRef<ILogoutDialog>();
  const { changeTheme, currentThemeName } = useThemeContext();
  const { account, network } = useSelector((store: IRootState) => store.base);
  const { deactivate } = useWeb3React();
  const dispatch = useDispatch();
  const [popoverVisible, setPopoverVisible] = useState(false);

  const content = (
    <div>
      <div className="network">{network}</div>
      <div className="account">{account}</div>
      <div className="protocol">子协议: 2121212</div>
      <div
        className="disconnect"
        onClick={() => {
          deactivate();
          disconnectWeb3Connector();
          storage.set('isLogout', true);
          storage.set('account', '');
          dispatch(setAccount(''));
        }}
      >
        Disconnect
      </div>
    </div>
  );

  return (
    <header className="lt-header">
      <div className="notice">
        <span>
          <Icon name="notice" />
          {t('header.notification')}
          ：出于安全考虑，MDX的抵押率为零，不可用于抵押。BAGS不可用于存借，即将下线。
        </span>
      </div>
      <div
        className={classnames('theme', currentThemeName)}
        onClick={() => changeTheme(currentThemeName === 'default' ? 'dark' : 'default')}
      >
        {currentThemeName === 'default' ? <img src={Default} alt="" /> : <img src={Dark} alt="" />}
      </div>
      <div className="account">
        {account ? (
          <Popover
            placement="bottomLeft"
            content={content}
            trigger="click"
            overlayClassName={classnames('headerUserMenu', currentThemeName)}
            onVisibleChange={(v) => setPopoverVisible(v)}
          >
            <div className="user">
              <div>{network}</div>
              <div>{getShortenAddress(account)}</div>
              <span className={classnames('arrow', { up: popoverVisible })}>
                <Icon name="arrow" />
              </span>
            </div>
          </Popover>
        ) : (
          <div
            className="connect"
            onClick={() => {
              dispatch(setLoginDialogShow(true));
            }}
          >
            <span>{t('header.connectWallet')}</span>
          </div>
        )}
      </div>
      <LoginDialog />
      <LogoutDialog ref={LogoutDialogRef} />
    </header>
  );
};
