import './loginDialog.styl'

import { useWeb3React } from '@web3-react/core'
import { Dropdown, Menu, Modal } from 'antd'
import classNames from 'classnames'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { NETWORK, SupportedNetworks } from '@/app/connectors'
// import moduleName from '@/app/contracts/getProvider'
import EventEmitter from '@/app/utils/events'
import { useThemeContext } from '@/theme'

// import { getWeb3Connector } from '../../connectors'
import copy from '../../utils/copy'
import storage from '../../utils/storage'
import { getShortenAddress } from '../../utils/tool'
import * as icons from './img'

export interface ILogoutDialog {
    show(): void
    hide(): void
}

export default (): JSX.Element | null => {
    const { currentThemeName } = useThemeContext()
    const [LogoutDialogOpen, setLogoutDialogOpen] = useState(false)
    const { account, activate, active, error, chainId } = useWeb3React()
    const [preferredNetwork, setPreferredNetwork] = useState<string>('Mainnet')
    const isImToken = !!window.imToken
    const wallets = [
        {
            title: 'MetaMask',
            description: 'MetaMask',
            providerName: 'browser',
            icon: icons.browserWallets
        },
        {
            title: 'Ledger',
            providerName: 'ledger',
            icon: icons.ledgerIcon,
            notSupported: preferredNetwork === 'polygon'
        },
        {
            title: 'MEW wallet',
            providerName: 'mew-wallet',
            icon: icons.MEWIcon,
            notSupported: preferredNetwork !== 'mainnet'
        },
        {
            title: 'Coinbase',
            providerName: 'wallet-link',
            icon: icons.coinbaseIcon
        },
        {
            title: 'Wallet Connect',
            providerName: 'wallet-connect',
            icon: icons.walletConnectIcon
        },
        {
            title: 'Torus',
            providerName: 'torus',
            icon: icons.torusIcon
        },
        {
            title: 'imToken',
            providerName: 'wallet-connect',
            icon: icons.imToken,
            notSupported: isImToken || preferredNetwork === 'polygon'
        }
    ]

    const preferredMenu = (
        <Menu>
            {SupportedNetworks.map(item => (
                <Menu.Item key={item.chainId} onClick={() => setPreferredNetwork(item.chainName)}>
                    {item.chainName}
                </Menu.Item>
            ))}
        </Menu>
    )

    EventEmitter.on('login', () => {
        setLogoutDialogOpen(true)
    })

    // const onLogin = () => {
    //     active(getWeb3Connector('', 'npm'))
    // }

    return (
        <Modal
            visible={LogoutDialogOpen}
            onCancel={() => setLogoutDialogOpen(false)}
            footer={null}
            wrapClassName={classNames('loginDialog', currentThemeName)}
            centered
            destroyOnClose={true}
            closable={false}
        >
            <div className="modalTitle">
                <div className="title">Account</div>
            </div>
            <div className="modalMain">
                <div>Select preferred network</div>
                <Dropdown overlay={preferredMenu}>
                    <div className="box">{preferredNetwork}</div>
                </Dropdown>
                <div className="wallet">
                    {wallets
                        .filter(wallet => !wallet.notSupported)
                        .map((item, index) => (
                            <div className="item" key={index}>
                                <img src={item.icon} alt="" />
                                {item.providerName}
                            </div>
                        ))}
                </div>
            </div>
        </Modal>
    )
}
