/*eslint-disable import/no-anonymous-default-export */
import './header.scss';

import classnames from 'classnames';
import React, { useRef } from 'react';
import { useWeb3React } from '@web3-react/core';

import AddressInfo from './addressInfo';
import LoginDialog, { IDialog as ILoginDialog } from '../LoginDialog';
import { useThemeContext } from '../../theme';
import Tips from './img/tips.svg';
import { getShortenAddress } from '../../utils/tool';

export default (): React.ReactElement => {
  const LoginDialogRef = useRef<ILoginDialog>();
  const { account, active } = useWeb3React();
  const { changeTheme, currentThemeName } = useThemeContext();

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
      />
      <div className="account">
        <div
          className="connect unLogin"
          // onClick={() =>
          //   active ? LogoutDialogRef.current?.show() : LoginDialogRef.current?.show()
          // }
          onClick={() => LoginDialogRef.current?.show()}
        >
          <span>{active ? getShortenAddress(account) : 'Connect wallet'}</span>
        </div>
      </div>
      <AddressInfo />
      <LoginDialog ref={LoginDialogRef} />
    </header>
  );
};
