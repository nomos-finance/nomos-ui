import './errorDialog.styl'

import { useWeb3React } from '@web3-react/core'
import { Modal } from 'antd'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

export interface IErrorDialog {
    show(): void
    hide(): void
}

interface IProps {
    chainId: number | undefined
}

export default forwardRef((props: IProps, ref) => {
    const [errorDialogOpen, setErrorDialogOpen] = useState(false)
    // const { chainId } = useWeb3React()
    // useEffect(() => {
    //     if (chainId && chainId !== 1) {
    //         setErrorDialogOpen(true)
    //     } else if (chainId && chainId === 1 && errorDialogOpen) {
    //         setErrorDialogOpen(false)
    //     }
    // }, [chainId])

    useImperativeHandle(ref, () => ({
        show: () => {
            setErrorDialogOpen(true)
        },
        hide: () => {
            setErrorDialogOpen(false)
        }
    }))

    return (
        <>
            <Modal
                visible={errorDialogOpen}
                onCancel={() => setErrorDialogOpen(false)}
                footer={null}
                wrapClassName="errorDialog"
                centered
                destroyOnClose={true}
                closable={false}
            >
                <div className="modalTitle">
                    <em onClick={() => setErrorDialogOpen(false)}>x</em>
                </div>
                <div className="modalMain error">
                    <div className="title">Connect network</div>
                    <div className="subTitle">To start using qilin</div>
                    <div className="text">Please switch to Ethereum Mainnet</div>
                    {props.chainId !== 1 ? (
                        <div className="more">
                            <a href="https://docs.qilin.fi/user-manual/operation-guide-for-perpetual-contract">Learn more</a>
                        </div>
                    ) : null}
                </div>
            </Modal>
        </>
    )
})
