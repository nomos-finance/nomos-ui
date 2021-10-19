/*eslint-disable import/no-anonymous-default-export */
import './header.scss';

import classnames from 'classnames';
import React, { useRef, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Dropdown, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

// import AddressInfo from './addressInfo';
import LoginDialog, { IDialog as ILoginDialog } from '../LoginDialog';
import LogoutDialog, { IDialog as ILogoutDialog } from '../LogoutDialog';
import { useThemeContext } from '../../theme';
import Tips from './img/tips.svg';
import { getShortenAddress } from '../../utils/tool';
import storage from '../../utils/storage';

export default (): React.ReactElement => {
  const history = useHistory();
  const LoginDialogRef = useRef<ILoginDialog>();
  const LogoutDialogRef = useRef<ILogoutDialog>();
  const { active, account, chainId } = useWeb3React();
  const storedAccount = storage.get('account');
  const [currentAccount, setCurrentAccount] = useState<string>();
  const { changeTheme, currentThemeName } = useThemeContext();
  const [t, i18n] = useTranslation();

  const changLng = (l: string): void => {
    i18n.changeLanguage(l);
    history.replace(`?lng=${l}`);
  };

  useEffect(() => {
    if (account) {
      setCurrentAccount(account);
    } else if (storedAccount) {
      setCurrentAccount(storedAccount);
    }
    return () => {
      setCurrentAccount(undefined);
    };
  }, [account]);

  return (
    <header className={classnames('lt-header', currentThemeName)}>
      <div className="notice">
        <span>
          <img className="icon" src={Tips} alt="" />
          温馨提示：出于安全考虑，MDX的抵押率为零，不可用于抵押。BAGS不可用于存借，即将下线。
        </span>
      </div>
      <div
        className={classnames('theme', currentThemeName)}
        onClick={() => changeTheme(currentThemeName === 'default' ? 'dark' : 'default')}
      >
        {currentThemeName}
      </div>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="zh_CN">
              <div onClick={() => changLng('zh_CN')}>中文简体</div>
            </Menu.Item>
            <Menu.Item key="en_US">
              <div onClick={() => changLng('en_US')}>English</div>
            </Menu.Item>
          </Menu>
        }
      >
        <div className="box">{i18n.language === 'zh_CN' ? 'English' : '中文'}</div>
      </Dropdown>
      <div className="account">
        <div
          className="connect unLogin"
          onClick={() =>
            currentAccount ? LogoutDialogRef.current?.show() : LoginDialogRef.current?.show()
          }
        >
          <span>{currentAccount ? getShortenAddress(currentAccount) : 'Connect wallet'}</span>
        </div>
      </div>
      <LoginDialog ref={LoginDialogRef} />
      <LogoutDialog ref={LogoutDialogRef} />
    </header>
  );
};
