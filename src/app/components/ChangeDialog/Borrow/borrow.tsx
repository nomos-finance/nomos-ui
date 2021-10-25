import './borrow.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal, Input, Button } from 'antd';
import { useThemeContext } from '../../../theme';

import { ComputedReserveData } from '@aave/protocol-js';
import useTxBuilder from '../../../hooks/useTxBuilder';
import { handleSend } from '../helper/txHelper';
import { useWeb3React } from '@web3-react/core';
import { pow10, formatMoney, filterInput } from '../../../utils/tool';
import storage from '../../../utils/storage';

interface IProps {
  type: 'Borrow' | 'Repay';
  data?: ComputedReserveData;
}

export interface IDialog {
  show(openProps: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [lendingPool] = useTxBuilder();
  const { currentThemeName } = useThemeContext();
  const { account, library } = useWeb3React();
  const [params, setParams] = useState<IProps>();
  const [type, setType] = useState(params ? params.type : 'Borrow');
  const [show, setShow] = useState(false);
  const [borrowValidationMessage, setBorrowValidationMessage] = useState('');
  const [repayValidationMessage, setRepayValidationMessage] = useState('');
  const [borrowAmount, setBorrowAmount] = useState<string | number>('');
  const [repayAmount, setRepayAmount] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [interestRateMode, setInterestRateMode] = useState('Stable');

  const hide = () => {
    setType(params ? params.type : 'Borrow');
    setShow(false);
    setParams(undefined);
    setBorrowAmount('');
    setRepayAmount('');
    setBorrowValidationMessage('');
    setRepayValidationMessage('');
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps: IProps) => {
      setParams(openProps);
      setShow(true);
    },
    hide,
  }));

  const handleBorrowAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setBorrowAmount(val);
    // if (Number(val) <= 0) {
    //   setBorrowValidationMessage('Amount must be > 0');
    // } else if (Number(val) > Number(val) + Number(params?.balance)) {
    //   setBorrowValidationMessage('Amount must be <= balance');
    // } else {
    //   setBorrowValidationMessage('');
    // }
  };

  const handleBorrowSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !borrowAmount) return;
    try {
      setLoading(true);
      const txs = await lendingPool.borrow({
        interestRateMode: interestRateMode as any,
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${borrowAmount}`,
        referralCode: storage.get('referralCode') || undefined,
        debtTokenAddress:
          interestRateMode === 'Stable'
            ? params.data.stableDebtTokenAddress
            : params.data.variableDebtTokenAddress,
      });
      console.log(txs);
      await handleSend(txs, library);
      setLoading(false);
      hide();
    } catch (error) {
      console.log(error);
      setLoading(false);
      hide();
    }
  };

  const handleRepayAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setRepayAmount(val);
    // if (Number(val) <= 0) {
    //   setRepayValidationMessage('Amount must be > 0');
    // } else if (Number(val) > Number(val) + Number(params?.balance)) {
    //   setRepayValidationMessage('Amount must be <= balance');
    // } else {
    //   setRepayValidationMessage('');
    // }
  };

  const handleRepaySubmit = async () => {
    if (!lendingPool || !params?.data || !account || !repayAmount) return;
    try {
      setLoading(true);
      const txs = await lendingPool.repay({
        interestRateMode: interestRateMode as any,
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${repayAmount}`, // TODO: MAX
      });
      console.log({
        interestRateMode: interestRateMode as any,
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${repayAmount}`, // TODO: MAX
      });
      await handleSend(txs, library);
      setLoading(false);
      hide();
    } catch (error) {
      console.log(error);
      setLoading(false);
      hide();
    }
  };

  return (
    <Modal
      visible={show}
      onCancel={() => hide()}
      footer={null}
      wrapClassName={classnames('customDialog', 'changeDialog', currentThemeName)}
      centered
      destroyOnClose={true}
      closable={false}
    >
      <div className="tab">
        <div
          className={classnames('tabItem', { cur: type === 'Borrow' })}
          onClick={() => setType('Borrow')}
        >
          贷款
        </div>
        <div
          className={classnames('tabItem', { cur: type === 'Repay' })}
          onClick={() => setType('Repay')}
        >
          还款
        </div>
      </div>
      {type === 'Borrow' ? (
        <div className="tabMain">
          <div>
            <div onClick={() => setInterestRateMode('Variable')}>可变利率</div>
            <div onClick={() => setInterestRateMode('Stable')}>稳定利率</div>
          </div>
          <div>可贷款数量</div>
          <div>
            <Input
              // bordered={false}
              value={borrowAmount}
              onChange={(event) => {
                handleBorrowAmountChange(event.target.value);
              }}
            />
          </div>
          <div>健康因子</div>
          <div>存款收益</div>
          <div>抵押品参数</div>
          <Button loading={loading} className="submit" onClick={() => handleBorrowSubmit()}>
            提交
          </Button>
        </div>
      ) : (
        <div className="tabMain">
          <div>
            <div onClick={() => setInterestRateMode('Variable')}>可变利率</div>
            <div onClick={() => setInterestRateMode('Stable')}>稳定利率</div>
          </div>
          <div>已贷款数量</div>
          <div>
            <Input
              // bordered={false}
              value={repayAmount}
              onChange={(event) => {
                handleRepayAmountChange(event.target.value);
              }}
            />
          </div>
          <div>健康因子</div>
          <div>存款收益</div>
          <div>抵押品参数1111</div>
          <Button loading={loading} className="submit" onClick={() => handleRepaySubmit()}>
            提交
          </Button>
        </div>
      )}
    </Modal>
  );
});
