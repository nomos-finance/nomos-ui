import './header.styl'

import { useWeb3React } from '@web3-react/core'
import { Dropdown, Menu } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'

import { useThemeContext } from '@/theme'

import { useEagerConnect, useInactiveListener } from '../../hooks/web3'
import storage from '../../utils/storage'
import { getShortenAddress } from '../../utils/tool'
import ErrorDialog, { IErrorDialog } from '../ErrorDialog'
import LoginDialog, { IDialog as ILoginDialog } from '../LoginDialog'
import LogoutDialog, { ILogoutDialog } from '../LogoutDialog'

export default (): React.ReactElement => {
    const history = useHistory()
    const ErrorDialogRef = useRef<IErrorDialog>()
    const LogoutDialogRef = useRef<ILogoutDialog>()
    const LoginDialogRef = useRef<ILoginDialog>()

    const { account, activate, active, error, chainId } = useWeb3React()
    const triedEager = useEagerConnect()
    const { changeTheme, currentThemeName } = useThemeContext()
    const [t, i18n] = useTranslation()

    const changLng = (l: string): void => {
        i18n.changeLanguage(l)
        history.replace(`?lng=${l}`)
    }

    useInactiveListener(!triedEager)

    return (
        <header className={classnames('lt-header', currentThemeName)}>
            <div className="notice">温馨提示：出于安全考虑，MDX的抵押率为零，不可用于抵押。BAGS不可用于存借，即将下线。</div>
            <div className={classnames('theme', currentThemeName)} onClick={() => changeTheme(currentThemeName === 'default' ? 'dark' : 'default')} />
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
                <div className="connect unLogin" onClick={() => (active ? LogoutDialogRef.current?.show() : LoginDialogRef.current?.show())}>
                    <span>{active ? getShortenAddress(account) : 'Connect wallet'}</span>
                </div>
            </div>
            <ErrorDialog ref={ErrorDialogRef} chainId={chainId} />
            <LogoutDialog ref={LogoutDialogRef} />
            <LoginDialog ref={LoginDialogRef} />
        </header>
    )
}
