import './header.styl'

import { useWeb3React } from '@web3-react/core'
import { Dropdown, Menu } from 'antd'
import classnames from 'classnames'
import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'

import { useThemeContext } from '@/theme'

import { injected } from '../../connectors'
import { useEagerConnect, useInactiveListener } from '../../hooks/web3'
import storage from '../../utils/storage'
import { getShortenAddress } from '../../utils/tool'
import ErrorDialog, { IErrorDialog } from '../ErrorDialog'
import LogoutDialog, { ILogoutDialog } from '../LogoutDialog'
import useTopData from './hook/useTopData'

export default (): React.ReactElement => {
    const history = useHistory()
    const { pathname } = history.location
    const ErrorDialogRef = useRef<IErrorDialog>()
    const LogoutDialogRef = useRef<ILogoutDialog>()
    const { account, activate, active, error, chainId } = useWeb3React()
    const triedEager = useEagerConnect()
    // const [ethPrice, ethBlock] = useTopData()
    const onConnectClick = async (): Promise<void> => {
        await activate(injected)
        storage.set('isLogout', '')
    }
    const { changeTheme, currentThemeName } = useThemeContext()
    const [t, i18n] = useTranslation()

    const changLng = (l: string): void => {
        i18n.changeLanguage(l)
        history.replace(`?lng=${l}`)
    }

    useInactiveListener(!triedEager)

    useEffect(() => {
        if (error) {
            console.log(error)
            // ErrorDialogRef.current?.show()
        }
        return () => {}
    }, [error])

    useEffect(() => {
        if (!storage.get('isLogout')) {
            activate(injected)
        }
        return () => {}
    }, [])

    return (
        <header className={classnames('lt-header', currentThemeName)}>
            <div className="top">
                <div className="box">
                    <div className="right">
                        {active ? (
                            <div className="connect" onClick={() => LogoutDialogRef.current?.show()}>
                                <span>{getShortenAddress(account)}</span>
                            </div>
                        ) : (
                            <div className="connect" onClick={onConnectClick}>
                                <span>Connect wallet</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <div onClick={() => changeTheme('default')}>默认</div>
                        <div onClick={() => changeTheme('dark')}>暗黑</div>
                    </div>
                    <div>
                        <div onClick={() => changLng('zh_CN')}>中文简体</div>
                        <div onClick={() => changLng('en_US')}>English</div>
                    </div>
                </div>
            </div>
            {t('joinUsText')}
            <ErrorDialog ref={ErrorDialogRef} chainId={chainId} />
            <LogoutDialog ref={LogoutDialogRef} />
        </header>
    )
}
