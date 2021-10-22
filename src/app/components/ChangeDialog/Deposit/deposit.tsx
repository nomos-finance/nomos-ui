import './deposit.scss';
/*eslint-disable import/no-anonymous-default-export */
import { BigNumber } from 'ethers';
import { TransactionResponse } from '@ethersproject/abstract-provider';
import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal, Input } from 'antd';
import { useThemeContext } from '../../../theme';
import { ComputedReserveData, transactionType } from '@aave/protocol-js';
import useTxBuilder from '../../../hooks/useTxBuilder';
import { useWeb3React } from '@web3-react/core';
import { pow10, formatMoney, filterInput } from '../../../utils/tool';
import storage from '../../../utils/storage';

interface IProps {
  type: 'Save' | 'Cash';
  data?: ComputedReserveData;
  balance?: string;
}

export interface IDialog {
  show(openProps: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [params, setParams] = useState<IProps>();
  const [type, setType] = useState(params ? params.type : 'Save');
  const [show, setShow] = useState(false);
  const { currentThemeName } = useThemeContext();
  const { account, library: provider } = useWeb3React();

  const [lendingPool] = useTxBuilder();

  const [saveValidationMessage, setSaveValidationMessage] = useState('');
  const [saveAmount, setSaveAmount] = useState<string | number>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string | number>('');

  const hide = () => {
    setShow(false);
    setParams(undefined);
    setSaveAmount(0);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps: IProps) => {
      setParams(openProps);
      setShow(true);
    },
    hide,
  }));

  const handleSaveAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setSaveAmount(val);
    if (Number(val) <= 0) {
      setSaveValidationMessage('Amount must be > 0');
    } else if (Number(val) > Number(val) + Number(params?.balance)) {
      setSaveValidationMessage('Amount must be <= balance');
    } else {
      setSaveValidationMessage('');
    }
  };

  const handleSaveSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !saveAmount) return;
    const txs = await lendingPool.deposit({
      user: account,
      reserve: params.data.underlyingAsset,
      amount: `${saveAmount}`,
      referralCode: storage.get('referralCode') || undefined,
    });

    const approvalTx = txs.find((tx) => tx.txType === 'ERC20_APPROVAL');
    const actionTx = txs.find((tx) =>
      [
        'DLP_ACTION',
        'GOVERNANCE_ACTION',
        'STAKE_ACTION',
        'GOV_DELEGATION_ACTION',
        'REWARD_ACTION',
        'FAUCET_MINT',
      ].includes(tx.txType)
    );

    let extendedTxData: transactionType = {};

    if (approvalTx) {
      try {
        extendedTxData = await approvalTx.tx();
      } catch (e) {
        console.log('tx building error', e);
        return;
      }
    }
    if (actionTx) {
      try {
        extendedTxData = await actionTx.tx();
      } catch (e) {
        console.log('tx building error', e);
        return;
      }
    }

    const { from, ...txData } = extendedTxData;
    const signer = provider.getSigner(from);
    let txResponse: TransactionResponse | undefined;
    try {
      txResponse = await signer.sendTransaction({
        ...txData,
        value: txData.value ? BigNumber.from(txData.value) : undefined,
      });
    } catch (e) {
      console.error('send-ethereum-tx', e);
      return;
    }
    const txHash = txResponse?.hash;
    console.log(txHash);
    if (txResponse) {
      try {
        const txReceipt = await txResponse.wait(1);
        console.log(txReceipt);
      } catch (e) {
        // let error = 'network error has occurred, please check tx status in an explorer';
        // try {
        // let tx = await provider.getTransaction(txResponse.hash);
        // // @ts-ignore TODO: need think about "tx" type
        // const code = await provider.call(tx, tx.blockNumber);
        // error = hexToAscii(code.substr(138));
        // } catch (e) {
        //   console.log('network error', e);
        // }
      }
    }
  };

  const handleWithdrawAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setSaveAmount(val);
    if (Number(val) <= 0) {
      setSaveValidationMessage('Amount must be > 0');
    } else if (Number(val) > Number(val) + Number(params?.balance)) {
      setSaveValidationMessage('Amount must be <= balance');
    } else {
      setSaveValidationMessage('');
    }
  };

  const handleWithdrawSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !saveAmount) return;
    const txs = await lendingPool.deposit({
      user: account,
      reserve: params.data.underlyingAsset,
      amount: `${saveAmount}`,
      referralCode: storage.get('referralCode') || undefined,
    });

    const approvalTx = txs.find((tx) => tx.txType === 'ERC20_APPROVAL');
    const actionTx = txs.find((tx) =>
      [
        'DLP_ACTION',
        'GOVERNANCE_ACTION',
        'STAKE_ACTION',
        'GOV_DELEGATION_ACTION',
        'REWARD_ACTION',
        'FAUCET_MINT',
      ].includes(tx.txType)
    );

    let extendedTxData: transactionType = {};

    if (approvalTx) {
      try {
        extendedTxData = await approvalTx.tx();
      } catch (e) {
        console.log('tx building error', e);
        return;
      }
    }
    if (actionTx) {
      try {
        extendedTxData = await actionTx.tx();
      } catch (e) {
        console.log('tx building error', e);
        return;
      }
    }

    const { from, ...txData } = extendedTxData;
    const signer = provider.getSigner(from);
    let txResponse: TransactionResponse | undefined;
    try {
      txResponse = await signer.sendTransaction({
        ...txData,
        value: txData.value ? BigNumber.from(txData.value) : undefined,
      });
    } catch (e) {
      console.error('send-ethereum-tx', e);
      return;
    }
    const txHash = txResponse?.hash;
    console.log(txHash);
    if (txResponse) {
      try {
        const txReceipt = await txResponse.wait(1);
        console.log(txReceipt);
      } catch (e) {
        // let error = 'network error has occurred, please check tx status in an explorer';
        // try {
        // let tx = await provider.getTransaction(txResponse.hash);
        // // @ts-ignore TODO: need think about "tx" type
        // const code = await provider.call(tx, tx.blockNumber);
        // error = hexToAscii(code.substr(138));
        // } catch (e) {
        //   console.log('network error', e);
        // }
      }
    }
  };

  return (
    <Modal
      visible={show}
      onCancel={() => setShow(false)}
      footer={null}
      wrapClassName={classnames('customDialog', 'changeDialog', currentThemeName)}
      centered
      destroyOnClose={true}
      closable={false}
    >
      <div>{params?.data?.symbol}</div>
      <div className="tab">
        <div
          className={classnames('tabItem', { cur: type === 'Save' })}
          onClick={() => setType('Save')}
        >
          存款
        </div>
        <div
          className={classnames('tabItem', { cur: type === 'Cash' })}
          onClick={() => setType('Cash')}
        >
          取款
        </div>
      </div>
      {type === 'Save' ? (
        <div className="tabMain">
          <div className="balance">
            <div>
              <div>钱包余额</div>
              {formatMoney(pow10(params?.balance))}
              {params?.data?.symbol}
            </div>
            <div className={classnames('input', { error: !!saveValidationMessage })}>
              <div onClick={() => setSaveAmount(Number(pow10(params?.balance)))}>MAX</div>
              <Input
                // bordered={false}
                value={saveAmount}
                onChange={(event) => {
                  handleSaveAmountChange(event.target.value);
                }}
              />
              {saveAmount}
            </div>
          </div>
          <div>
            <div>健康因子</div>
          </div>
          <div>
            <div>存款收益</div>
            <div>
              <div>存款年利率</div>
              <div>
                {params?.data?.borrowingEnabled ? Number(params?.data?.liquidityRate) : -1}%
              </div>
            </div>
          </div>
          <div>
            <div>抵押品参数</div>
          </div>
          <div className="submit" onClick={() => handleSaveSubmit()}>
            提交
          </div>
        </div>
      ) : (
        <div className="tabMain">
          <div>
            <Input
              // bordered={false}
              value={withdrawAmount}
              onChange={(event) => {
                handleWithdrawAmountChange(event.target.value);
              }}
            />
          </div>
          <div className="submit" onClick={() => handleWithdrawSubmit()}>
            提交
          </div>
        </div>
      )}
    </Modal>
  );
});
