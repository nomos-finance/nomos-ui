import React, { useRef, useState } from 'react';
import {
  valueToBigNumber,
  normalize,
  ComputedReserveData,
  UserSummaryData,
} from '@aave/protocol-js';
import { Input, Table } from 'antd';
import {
  Borrow,
  Deposit,
  Swap,
  IBorrowDialog,
  IDepositDialog,
  ISwapDialog,
} from '../../components/ChangeDialog/';
import { formatDecimal, formatMoney, pow10 } from '../../utils/tool';
import Icon from '../../../assets/icons';
import classnames from 'classnames';
import SymbolIcon from '../../components/SymbolIcon';
import { useTranslation } from 'react-i18next';

interface IProps {
  reserves: ComputedReserveData[];
  usdPriceEth: string;
  balance: IBalance;
  user?: UserSummaryData;
}

interface IBalance {
  [key: string]: string;
}

export default function MarketTable(props: IProps) {
  const [t] = useTranslation();
  let totalLockedInUsd = valueToBigNumber('0');
  const marketRefPriceInUsd = normalize(props.usdPriceEth, 18);
  const BorrowDialogRef = useRef<IBorrowDialog>();
  const DepositDialogRef = useRef<IDepositDialog>();
  const [borrowType, setBorrowType] = useState('USD');
  const [tab, setTab] = useState('deposit');

  let sortedData = props.reserves
    .filter((res) => res.isActive)
    .map((reserve) => {
      totalLockedInUsd = totalLockedInUsd.plus(
        valueToBigNumber(reserve.totalLiquidity)
          .multipliedBy(reserve.price.priceInEth)
          .dividedBy(marketRefPriceInUsd)
      );

      const totalLiquidity = Number(reserve.totalLiquidity);
      const totalLiquidityInUSD = valueToBigNumber(reserve.totalLiquidity)
        .multipliedBy(reserve.price.priceInEth)
        .dividedBy(marketRefPriceInUsd)
        .toNumber();

      const totalBorrows = Number(reserve.totalDebt);
      const totalBorrowsInUSD = valueToBigNumber(reserve.totalDebt)
        .multipliedBy(reserve.price.priceInEth)
        .dividedBy(marketRefPriceInUsd)
        .toNumber();

      return {
        reserve,
        totalLiquidity,
        totalLiquidityInUSD,
        totalBorrows: reserve.borrowingEnabled ? totalBorrows : -1,
        totalBorrowsInUSD: reserve.borrowingEnabled ? totalBorrowsInUSD : -1,
        id: reserve.id,
        underlyingAsset: reserve.underlyingAsset,
        currencySymbol: reserve.symbol,
        depositAPY: reserve.borrowingEnabled ? Number(reserve.liquidityRate) : -1,
        avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
        stableBorrowRate:
          reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
            ? Number(reserve.stableBorrowRate)
            : -1,
        variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowRate) : -1,
        avg30DaysVariableRate: Number(reserve.avg30DaysVariableBorrowRate),
        borrowingEnabled: reserve.borrowingEnabled,
        stableBorrowRateEnabled: reserve.stableBorrowRateEnabled,
        isFreezed: reserve.isFrozen,
        aIncentivesAPY: reserve.aIncentivesAPY,
        vIncentivesAPY: reserve.vIncentivesAPY,
        sIncentivesAPY: reserve.sIncentivesAPY,
      };
    });

  return (
    <div className="block marketBlock">
      <div className="header">
        <div className="tab">
          <div
            className={classnames('tabItem', { cur: tab === 'deposit' })}
            onClick={() => setTab('deposit')}
          >
            {t('lending.supplyMarkets')}
          </div>
          <div
            className={classnames('tabItem', { cur: tab === 'borrow' })}
            onClick={() => setTab('borrow')}
          >
            {t('lending.borrowMarkets')}
          </div>
        </div>
        <div className="search">
          <em>
            <Icon name="search" />
          </em>
          <Input bordered={false} placeholder={t('lending.search')} />
          <span>
            所有资产
            <i>
              <Icon name="down" />
            </i>
          </span>
        </div>
        {tab === 'borrow' ? (
          <div className="type">
            <div
              className={classnames('item', { cur: borrowType === 'USD' })}
              onClick={() => setBorrowType('USD')}
            >
              USD
            </div>
            <div
              className={classnames('item', { cur: borrowType === 'Amount' })}
              onClick={() => setBorrowType('Amount')}
            >
              Amount
            </div>
          </div>
        ) : null}
      </div>
      <div style={{ display: tab === 'deposit' ? 'block' : 'none' }}>
        <table>
          <thead>
            <tr>
              <th>{t('lending.depositAsset')}</th>
              <th>{t('lending.depositAPY')}</th>
              <th>{t('lending.rewardAPR')}</th>
              <th>抵押品上限</th>
              <th>抵押品剩余额度</th>
              <th>{t('lending.walletBalance')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  DepositDialogRef.current?.show({
                    type: 'Deposit',
                    data: item.reserve,
                    balance: props.balance[item.underlyingAsset],
                    marketRefPriceInUsd,
                    user: props.user,
                  })
                }
              >
                <td>
                  <div className="asset">
                    <SymbolIcon symbol={item.currencySymbol} />
                    <span>{item.currencySymbol}</span>
                  </div>
                </td>
                <td>{formatDecimal(item.depositAPY * 100)}%</td>
                <td>xxx</td>
                <td>xxx</td>
                <td>xxx</td>
                <td>
                  <div className="money">
                    {formatMoney(pow10(props.balance[item.underlyingAsset], item.reserve.decimals))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: tab === 'borrow' ? 'block' : 'none' }}>
        <table>
          <thead>
            <tr>
              <th>{t('lending.borrowAsset')}</th>
              <th>稳定利率贷款APR</th>
              <th>浮动利率贷款APR</th>
              <th>奖励APR</th>
              <th>债务上限</th>
              <th>剩余债务额度</th>
              <th>流动结构性</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr
                key={item.id}
                onClick={() =>
                  BorrowDialogRef.current?.show({
                    type: 'Borrow',
                    data: item.reserve,
                    user: props.user,
                  })
                }
              >
                <td>
                  <div className="asset">
                    <SymbolIcon symbol={item.currencySymbol} />
                    <span>{item.currencySymbol}</span>
                  </div>
                </td>
                <td>
                  {formatDecimal(item.stableBorrowRate * 100 < 0 ? 0 : item.stableBorrowRate * 100)}
                  %
                </td>
                <td>{formatDecimal(item.variableBorrowRate * 100)}%</td>
                <td>xxx</td>
                <td>xxx</td>
                <td>xxx</td>
                <td>
                  {formatMoney(
                    borrowType === 'USD' ? item.totalLiquidityInUSD : item.totalLiquidity,
                    2
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Borrow ref={BorrowDialogRef} />
      <Deposit ref={DepositDialogRef} />
    </div>
  );
}
