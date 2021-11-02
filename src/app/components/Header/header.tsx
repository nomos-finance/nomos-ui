/*eslint-disable import/no-anonymous-default-export */
import './header.styl';

import classnames from 'classnames';
import React, { useRef, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';

import LoginDialog, { IDialog as ILoginDialog } from '../LoginDialog';
import LogoutDialog, { IDialog as ILogoutDialog } from '../LogoutDialog';
import { useThemeContext } from '../../theme';
import { getShortenAddress } from '../../utils/tool';
import Icon from '../../../assets/icons';
import Dark from './img/dark.svg';
import Default from './img/default.svg';

export default (): React.ReactElement => {
  const history = useHistory();
  const LoginDialogRef = useRef<ILoginDialog>();
  const LogoutDialogRef = useRef<ILogoutDialog>();
  const { changeTheme, currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);

  return (
    <header className="lt-header">
      <div className="notice">
        <span>
          <Icon name="notice" />
          温馨提示：出于安全考虑，MDX的抵押率为零，不可用于抵押。BAGS不可用于存借，即将下线。
        </span>
      </div>
      <div
        className={classnames('theme', currentThemeName)}
        onClick={() => changeTheme(currentThemeName === 'default' ? 'dark' : 'default')}
      >
        {currentThemeName === 'default' ? <img src={Default} alt="" /> : <img src={Dark} alt="" />}
      </div>
      <div className="account">
        <div
          className="connect unLogin"
          onClick={() => {
            return account ? LogoutDialogRef.current?.show() : LoginDialogRef.current?.show();
          }}
        >
          <span>{account ? getShortenAddress(account) : 'Connect wallet'}</span>
        </div>
      </div>
      <LoginDialog ref={LoginDialogRef} />
      <LogoutDialog ref={LogoutDialogRef} />
    </header>
  );
};
