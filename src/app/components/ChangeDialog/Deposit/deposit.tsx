import './deposit.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { useEffect, forwardRef, useState, useImperativeHandle } from 'react';
import { Modal, Input } from 'antd';
import { useThemeContext } from '../../../theme';
import { ComputedReserveData } from '@aave/protocol-js';
import useLendingPoolContract from '../../../hooks/useLendingPoolContract';
import useTxBuilder from '../../../hooks/useTxBuilder';
import { useWeb3React } from '@web3-react/core';
import { pow10, formatMoney, original } from '../../../utils/tool';
import storage from '../../../utils/storage';

import {
  EthTransactionData,
  sendEthTransaction,
  TxStatusType,
} from '../../../helpers/send-ethereum-tx';

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
  const [contract] = useLendingPoolContract();
  const { account, library: provider } = useWeb3React();

  const [lendingPool] = useTxBuilder();

  const [saveValidationMessage, setSaveValidationMessage] = useState('');
  const [saveAmount, setSaveAmount] = useState<string | number>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string | number>('');

  const [uncheckedApproveTxData, setApproveTxData] = useState({} as EthTransactionData);
  const [uncheckedActionTxData, setActionTxData] = useState({} as EthTransactionData);
  const [customGasPrice, setCustomGasPrice] = useState<string | null>(null);

  const approveTxData = uncheckedApproveTxData.unsignedData
    ? (uncheckedApproveTxData as EthTransactionData & {
        unsignedData: EthTransactionData;
      })
    : undefined;
  const actionTxData = uncheckedActionTxData.unsignedData
    ? (uncheckedActionTxData as EthTransactionData & {
        unsignedData: EthTransactionData;
      })
    : undefined;

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

  const handleSaveSubmit = async () => {
    if (!lendingPool || !params?.data || !account) return;
    console.log(params.data.underlyingAsset, original(saveAmount, 18), account, '0');
    const txs = await lendingPool.deposit({
      user: account,
      reserve: params.data.underlyingAsset,
      amount: original(saveAmount, 18),
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

    console.log(approvalTx, txs);

    if (approvalTx) {
      setApproveTxData({
        txType: approvalTx.txType,
        unsignedData: approvalTx.tx,
        gas: approvalTx.gas,
        name: '',
      });
    }
    if (actionTx) {
      setActionTxData({
        txType: actionTx.txType,
        unsignedData: actionTx.tx,
        gas: actionTx.gas,
        name: '',
      });
    }

    // try {
    //   await (contract as any).deposit(
    //     params.data.underlyingAsset,
    //     original(saveAmount, 18),
    //     account,
    //     '0'
    //     // storage.get('referralCode') || 0
    //   );
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    console.log(uncheckedApproveTxData.unsignedData);
    if (uncheckedApproveTxData.unsignedData) {
      sendEthTransaction(
        uncheckedApproveTxData.unsignedData,
        provider,
        setApproveTxData,
        customGasPrice,
        {
          onConfirmation: () => {},
        }
      );
    }
    return () => {};
  }, [uncheckedApproveTxData]);

  useEffect(() => {
    if (uncheckedActionTxData.unsignedData) {
      sendEthTransaction(
        uncheckedActionTxData.unsignedData,
        provider,
        setActionTxData,
        customGasPrice,
        {
          onExecution: () => {},
          onConfirmation: () => {},
        }
      );
    }
    return () => {};
  }, [uncheckedActionTxData]);

  const handleSaveAmountChange = (amount: string): void => {
    const val = amount
      .replace('-', '')
      .replace(/^\.+|[^\d.]/g, '')
      .replace(/^0\d+\./g, '0.')
      .replace(/\.{2,}/, '')
      .replace(/^0(\d)/, '$1')
      .replace(/^(\-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3');
    setSaveAmount(val);
    if (Number(val) <= 0) {
      setSaveValidationMessage('Amount must be > 0');
    } else if (Number(val) > Number(val) + Number(params?.balance)) {
      setSaveValidationMessage('Amount must be <= balance');
    } else {
      setSaveValidationMessage('');
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
          <div>xx</div>
          <div className="submit" onClick={() => handleSaveSubmit()}>
            提交
          </div>
        </div>
      )}
    </Modal>
  );
});
