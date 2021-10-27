import './swap.styl';
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

interface IProps {}

export interface IDialog {
  show(openProps?: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [lendingPool] = useTxBuilder();
  const { currentThemeName } = useThemeContext();
  const { account, library } = useWeb3React();
  const [params, setParams] = useState<IProps>();
  const [show, setShow] = useState(false);
  const [borrowValidationMessage, setBorrowValidationMessage] = useState('');
  const [repayValidationMessage, setRepayValidationMessage] = useState('');
  const [borrowAmount, setBorrowAmount] = useState<string | number>('');
  const [repayAmount, setRepayAmount] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [interestRateMode, setInterestRateMode] = useState('Stable');

  const hide = () => {
    setShow(false);
    setParams(undefined);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps?: IProps) => {
      setParams(openProps);
      setShow(true);
    },
    hide,
  }));

  const handleSubmit = async () => {
    //   if (!lendingPool || !params?.data || !account || !borrowAmount) return;
    //   try {
    //     setLoading(true);
    //     const txs = await lendingPool.borrow({
    //       interestRateMode: interestRateMode as any,
    //       user: account,
    //       reserve: params.data.underlyingAsset,
    //       amount: `${borrowAmount}`,
    //       referralCode: storage.get('referralCode') || undefined,
    //       debtTokenAddress:
    //         interestRateMode === 'Stable'
    //           ? params.data.stableDebtTokenAddress
    //           : params.data.variableDebtTokenAddress,
    //     });
    //     console.log(txs);
    //     await handleSend(txs, library);
    //     setLoading(false);
    //     hide();
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //     hide();
    //   }
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
      <div>兑换</div>
      <div>已抵押资产</div>
      <div>BTC</div>
      <div>目标抵押资产</div>
      <div>ETH</div>
      <div onClick={() => handleSubmit()}>提交</div>
    </Modal>
  );
});
