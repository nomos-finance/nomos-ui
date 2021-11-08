import './borrow.styl';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useThemeContext } from '../../../theme';

import {
  ComputedReserveData,
  valueToBigNumber,
  BigNumber,
  UserSummaryData,
  ComputedUserReserve,
} from '@aave/protocol-js';
import useTxBuilder from '../../../hooks/useTxBuilder';
import { handleSend } from '../helper/txHelper';
import { useWeb3React } from '@web3-react/core';
import { formatDecimal, pow10, formatMoney, filterInput } from '../../../utils/tool';
import storage from '../../../utils/storage';
import SymbolIcon from '../../SymbolIcon';

interface IProps {
  type: 'Borrow' | 'Repay';
  data?: ComputedReserveData;
  user?: UserSummaryData;
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
  const [maxAmountToBorrow, setMaxAmountToBorrow] = useState<number>(0);
  const [userAssetInfo, setUserAssetInfo] = useState<ComputedUserReserve>();
  const [isMax, setMax] = useState(false);

  const hide = () => {
    setType(params ? params.type : 'Borrow');
    setShow(false);
    setParams(undefined);
    setBorrowAmount('');
    setRepayAmount('');
    setBorrowValidationMessage('');
    setRepayValidationMessage('');
    setLoading(false);
    setMax(false);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps: IProps) => {
      setParams(openProps);
      setShow(true);
    },
    hide,
  }));

  useEffect(() => {
    if (!params || !params.data || !params.user || !account) return;
    const maxUserAmountToBorrow = valueToBigNumber(params.user?.availableBorrowsETH || 0).div(
      params.data.price.priceInEth
    );
    let maxAmountToBorrow = BigNumber.max(
      BigNumber.min(params.data.availableLiquidity, maxUserAmountToBorrow),
      0
    );
    if (
      maxAmountToBorrow.gt(0) &&
      params.user?.totalBorrowsETH !== '0' &&
      maxUserAmountToBorrow.lt(
        valueToBigNumber(params.data.availableLiquidity).multipliedBy('1.01')
      )
    ) {
      maxAmountToBorrow = maxAmountToBorrow.multipliedBy('0.99');
    }
    setMaxAmountToBorrow(+maxAmountToBorrow);
    if (params?.user?.reservesData && params?.data?.underlyingAsset) {
      const asset = params.user.reservesData.filter(
        (item) => item.reserve.underlyingAsset === params.data?.underlyingAsset
      );
      setUserAssetInfo(asset[0]);
    }
  }, [params, account]);

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
        amount: `${isMax ? '-1' : repayAmount}`,
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
      <div className="symbol">
        <SymbolIcon symbol={params?.data?.symbol} size={96} />
        <div className="text">{params?.data?.symbol}</div>
      </div>
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
          <div className="typeTab">
            <div
              className={classnames('typeTabItem', { cur: interestRateMode === 'Variable' })}
              onClick={() => setInterestRateMode('Variable')}
            >
              可变利率
            </div>
            <div
              className={classnames('typeTabItem', { cur: interestRateMode === 'Stable' })}
              onClick={() => setInterestRateMode('Stable')}
            >
              稳定利率
            </div>
          </div>
          <div className="block">
            <div className="balance">
              <span className="balanceLabel">可贷款数量</span>
              <i className="balanceNumber">{formatMoney(`${maxAmountToBorrow}`)}</i>
            </div>
            <div className="input">
              <div className="max" onClick={() => setBorrowAmount(maxAmountToBorrow)}>
                Max
              </div>
              <Input
                bordered={false}
                placeholder="请输入金额"
                value={borrowAmount}
                onChange={(event) => {
                  handleBorrowAmountChange(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="info">
            <div className="item">
              <div className="key">健康因子</div>
              <div className="value">{formatDecimal(params?.user?.healthFactor)}</div>
            </div>
            <div className="item">
              <div className="key">存款收益</div>
              <div className="subItem">
                <div className="key">存款年利率</div>
                <div className="value">
                  {params?.data?.borrowingEnabled
                    ? formatDecimal(Number(params?.data?.liquidityRate) * 100)
                    : -1}
                  %
                </div>
              </div>
            </div>
            <div className="item">
              <div className="key">抵押品参数</div>
              <div className="subItem">
                <div className="key">抵押率</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">可贷款价值</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">已贷款价值</div>
                <div className="value">xxx</div>
              </div>
            </div>
          </div>
          <div className="dialogFooter">
            <Button loading={loading} className="submit" onClick={() => handleBorrowSubmit()}>
              提交
            </Button>
          </div>
        </div>
      ) : (
        <div className="tabMain">
          <div className="typeTab">
            <div
              className={classnames('typeTabItem', { cur: interestRateMode === 'Variable' })}
              onClick={() => setInterestRateMode('Variable')}
            >
              可变利率
            </div>
            <div
              className={classnames('typeTabItem', { cur: interestRateMode === 'Stable' })}
              onClick={() => setInterestRateMode('Stable')}
            >
              稳定利率
            </div>
          </div>
          <div className="block">
            <div className="balance">
              <span className="balanceLabel">已贷款数量</span>
              <i className="balanceNumber">
                {userAssetInfo
                  ? formatMoney(
                      interestRateMode === 'Variable'
                        ? userAssetInfo.variableBorrows
                        : userAssetInfo.stableBorrows
                    )
                  : 0}
              </i>
            </div>
            <div className="input">
              <div
                onClick={() => {
                  if (userAssetInfo) {
                    setMax(true);
                    if (interestRateMode === 'Variable') {
                      setRepayAmount(userAssetInfo.variableBorrows);
                    } else {
                      setRepayAmount(userAssetInfo.stableBorrows);
                    }
                  }
                }}
                className="max"
              >
                MAX
              </div>
              <Input
                bordered={false}
                placeholder="请输入金额"
                value={repayAmount}
                onChange={(event) => {
                  handleRepayAmountChange(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="info">
            <div className="item">
              <div className="key">健康因子</div>
              <div className="value">{formatDecimal(params?.user?.healthFactor)}</div>
            </div>
            <div className="item">
              <div className="key">存款收益</div>
              <div className="subItem">
                <div className="key">存款年利率</div>
                <div className="value">
                  {params?.data?.borrowingEnabled
                    ? formatDecimal(Number(params?.data?.liquidityRate) * 100)
                    : -1}
                  %
                </div>
              </div>
            </div>
            <div className="item">
              <div className="key">抵押品参数</div>
              <div className="subItem">
                <div className="key">抵押率</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">可贷款价值</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">已贷款价值</div>
                <div className="value">xxx</div>
              </div>
            </div>
          </div>
          <div className="dialogFooter">
            <Button loading={loading} className="submit" onClick={() => handleRepaySubmit()}>
              提交
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
});
