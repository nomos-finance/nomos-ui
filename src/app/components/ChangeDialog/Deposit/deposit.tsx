/*eslint-disable import/no-anonymous-default-export */

import './deposit.styl';
import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useThemeContext } from '../../../theme';
import {
  ComputedReserveData,
  valueToBigNumber,
  UserSummaryData,
  ComputedUserReserve,
} from '@aave/protocol-js';
import useTxBuilder from '../../../hooks/useTxBuilder';
import { useWeb3React } from '@web3-react/core';
import { pow10, formatMoney, filterInput, formatDecimal } from '../../../utils/tool';
import storage from '../../../utils/storage';
import { handleSend } from '../helper/txHelper';
import SymbolIcon from '../../SymbolIcon';
import BigNumber from 'bignumber.js';

import useLendingPoolContract from 'app/hooks/useLendingPoolContract';
import { parseNumber } from 'app/utils';
import useErc20Contract from 'app/hooks/useErc20Contract';

interface IProps {
  type: 'Deposit' | 'Withdraw';
  data?: ComputedReserveData;
  user?: UserSummaryData;
  balance?: string;
  marketRefPriceInUsd: string;
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
  const [type, setType] = useState(params ? params.type : 'Deposit');
  const [show, setShow] = useState(false);
  const [depositValidationMessage, setDepositValidationMessage] = useState('');
  const [withdrawValidationMessage, setWithdrawValidationMessage] = useState('');
  const [depositAmount, setDepositAmount] = useState<string | number>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [userAssetInfo, setUserAssetInfo] = useState<ComputedUserReserve>();
  const [isMax, setMax] = useState(false);

  const hide = () => {
    setType(params ? params.type : 'Deposit');
    setShow(false);
    setParams(undefined);
    setDepositAmount('');
    setWithdrawAmount('');
    setDepositValidationMessage('');
    setWithdrawValidationMessage('');
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

  const handleDepositAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setDepositAmount(val);
    if (Number(val) <= 0) {
      setDepositValidationMessage('Amount must be > 0');
    } else if (Number(val) > Number(val) + Number(params?.balance)) {
      setDepositValidationMessage('Amount must be <= balance');
    } else {
      setDepositValidationMessage('');
    }
  };

  const handleDepositSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !depositAmount) return;
    try {
      setLoading(true);
      console.log({
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${depositAmount}`,
        referralCode: storage.get('referralCode') || undefined,
      });
      const txs = await lendingPool.deposit({
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${depositAmount}`,
        referralCode: storage.get('referralCode') || undefined,
      });
      console.log(library);
      await handleSend(txs, library);
      setLoading(false);
      hide();
    } catch (error) {
      console.log(error);
      setLoading(false);
      hide();
    }
  };

  const handleWithdrawAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setWithdrawAmount(val);
    // if (Number(val) <= 0) {
    //   setWithdrawValidationMessage('Amount must be > 0');
    // } else if (Number(val) > Number(val) + Number(params?.balance)) {
    //   setWithdrawValidationMessage('Amount must be <= balance');
    // } else {
    //   setWithdrawValidationMessage('');
    // }
  };

  const handleWithdrawSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !withdrawAmount) return;
    try {
      setLoading(true);
      const txs = await lendingPool.withdraw({
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${isMax ? '-1' : withdrawAmount}`,
        aTokenAddress: params.data.aTokenAddress,
      });
      await handleSend(txs, library);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const poolReserve = params?.data;
    const marketRefPriceInUsd = params?.marketRefPriceInUsd;
    if (!poolReserve || !marketRefPriceInUsd) return;
    const totalLiquidityInUsd = valueToBigNumber(poolReserve.totalLiquidity)
      .multipliedBy(poolReserve.price.priceInEth)
      .dividedBy(marketRefPriceInUsd)
      .toString();
    const totalBorrowsInUsd = valueToBigNumber(poolReserve.totalDebt)
      .multipliedBy(poolReserve.price.priceInEth)
      .dividedBy(marketRefPriceInUsd)
      .toString();
    const availableLiquidityInUsd = valueToBigNumber(poolReserve.availableLiquidity)
      .multipliedBy(poolReserve.price.priceInEth)
      .dividedBy(marketRefPriceInUsd)
      .toString();

    const reserveOverviewData = {
      totalLiquidityInUsd,
      totalBorrowsInUsd,
      availableLiquidityInUsd,
      totalLiquidity: poolReserve.totalLiquidity,
      totalBorrows: poolReserve.totalDebt,
      availableLiquidity: poolReserve.availableLiquidity,
      liquidityRate: Number(poolReserve.liquidityRate),
      avg30DaysLiquidityRate: Number(poolReserve.avg30DaysLiquidityRate),
      stableRate: Number(poolReserve.stableBorrowRate),
      variableRate: Number(poolReserve.variableBorrowRate),
      stableOverTotal: valueToBigNumber(poolReserve.totalStableDebt)
        .dividedBy(poolReserve.totalDebt)
        .toNumber(),
      variableOverTotal: valueToBigNumber(poolReserve.totalVariableDebt)
        .dividedBy(poolReserve.totalDebt)
        .toNumber(),
      avg30DaysVariableRate: Number(poolReserve.avg30DaysVariableBorrowRate),
      utilizationRate: Number(poolReserve.utilizationRate),
      baseLTVasCollateral: Number(poolReserve.baseLTVasCollateral),
      liquidationThreshold: Number(poolReserve.reserveLiquidationThreshold),
      liquidationBonus: Number(poolReserve.reserveLiquidationBonus),
      usageAsCollateralEnabled: poolReserve.usageAsCollateralEnabled,
      stableBorrowRateEnabled: poolReserve.stableBorrowRateEnabled,
      borrowingEnabled: poolReserve.borrowingEnabled,
    };
    // console.log(reserveOverviewData);
    if (params?.user?.reservesData && params?.data?.underlyingAsset) {
      const asset = params.user.reservesData.filter(
        (item) => item.reserve.underlyingAsset === params.data?.underlyingAsset
      );
      setUserAssetInfo(asset[0]);
    }

    return () => {};
  }, [params]);

  const [erc20Contract] = useErc20Contract();
  const [lendingPool2] = useLendingPoolContract();

  const handleDepositSubmit2 = async () => {
    if (!lendingPool2 || !params?.data || !account || !depositAmount) return;
    // if (erc20Contract) {
    //   let isAllowance = await erc20Contract.allowance(account, '');
    //   isAllowance = Number(isAllowance.toString());
    //   console.log('is_allowance', !!isAllowance);

    //   if (!isAllowance) {
    //     const approve_res = await erc20Contract.approve('', 'ethers.constants.MaxUint256');
    //     await approve_res.wait();
    //   }
    // }

    console.log(erc20Contract);
    console.log(
      lendingPool2,
      params.data.underlyingAsset,
      `0x${parseNumber(depositAmount, 18).toString(16)}`,
      account,
      storage.get('referralCode') || 0
    );
    try {
      // const a = await lendingPool2.estimateGas.deposit(
      //   params.data.underlyingAsset,
      //   parseNumber(depositAmount, 18).toString(16),
      //   account,
      //   storage.get('referralCode') || 0,
      //   { gasLimit: 14400000 }
      // );
      // console.log(a);
      const txs = await lendingPool2.deposit(
        params.data.underlyingAsset,
        `0x${parseNumber(depositAmount, 18).toString(16)}`,
        account,
        storage.get('referralCode') || 0
        // { gasLimit: 400000 }
      );
    } catch (error) {
      console.log(error);
    }

    // try {
    //   setLoading(true);
    //   const txs = await lendingPool2.deposit(
    //     params.data.underlyingAsset,
    //     valueToBigNumber(depositAmount),
    //     account,
    //     storage.get('referralCode') || undefined
    //   );
    //   await handleSend(txs, library);
    //   setLoading(false);
    //   hide();
    // } catch (error) {
    //   console.log(error);
    //   setLoading(false);
    //   hide();
    // }
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
          className={classnames('tabItem', { cur: type === 'Deposit' })}
          onClick={() => setType('Deposit')}
        >
          存款
        </div>
        <div
          className={classnames('tabItem', { cur: type === 'Withdraw' })}
          onClick={() => setType('Withdraw')}
        >
          取款
        </div>
      </div>
      {type === 'Deposit' ? (
        <div className="tabMain">
          <div className="block">
            <div className="box">
              <div className="balance">
                <span className="balanceLabel">钱包余额</span>
                <i className="balanceNumber">
                  {formatMoney(pow10(params?.balance))}
                  <em>{params?.data?.symbol}</em>
                </i>
              </div>
              <div className={classnames('input', { error: !!depositValidationMessage })}>
                <div
                  className="max"
                  onClick={() => setDepositAmount(Number(pow10(params?.balance)))}
                >
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder="请输入金额"
                  value={depositAmount}
                  onChange={(event) => {
                    handleDepositAmountChange(event.target.value);
                  }}
                />
              </div>
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
            <Button loading={loading} className="submit" onClick={() => handleDepositSubmit()}>
              提交
            </Button>
            <Button loading={loading} className="submit" onClick={() => handleDepositSubmit2()}>
              提交
            </Button>
          </div>
        </div>
      ) : (
        <div className="tabMain">
          <div className="block">
            <div className="box">
              <div className="balance">
                <span className="balanceLabel">钱包余额</span>
                <i className="balanceNumber">
                  {formatMoney(pow10(params?.balance))}
                  <em>{params?.data?.symbol}</em>
                </i>
              </div>
              <div className="input">
                <div
                  onClick={() => {
                    if (userAssetInfo) {
                      setMax(true);
                      setWithdrawAmount(userAssetInfo.underlyingBalance);
                    }
                  }}
                  className="max"
                >
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder="请输入金额"
                  value={withdrawAmount}
                  onChange={(event) => {
                    handleWithdrawAmountChange(event.target.value);
                  }}
                />
              </div>
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
                  {params?.data?.borrowingEnabled ? Number(params?.data?.liquidityRate) : -1}%
                </div>
              </div>
              <div className="subItem">
                <div className="key">奖励年利率</div>
                <div className="value">xxx</div>
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
            <Button loading={loading} className="submit" onClick={() => handleWithdrawSubmit()}>
              提交
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
});
