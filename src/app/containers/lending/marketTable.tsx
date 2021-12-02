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
import classNames from 'classnames';
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
    <div className="marketBlock">
      <div className="block">
        <div className="title">{t('lending.supplyMarkets')}</div>
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
        <table>
          <thead>
            <tr>
              <th>{t('lending.depositAsset')}</th>
              <th>{t('lending.depositAPY')}</th>
              <th>{t('lending.rewardAPR')}</th>
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
      <div className="block">
        <div className="title">
          <span>{t('lending.supplyMarkets')}</span>
          <div className="tab">
            <div
              className={classNames('item', { cur: borrowType === 'USD' })}
              onClick={() => setBorrowType('USD')}
            >
              USD
            </div>
            <div
              className={classNames('item', { cur: borrowType === 'Amount' })}
              onClick={() => setBorrowType('Amount')}
            >
              Amount
            </div>
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
        <table>
          <thead>
            <tr>
              <th>{t('lending.borrowAsset')}</th>
              <th>stable 贷款APY</th>
              <th>variable 贷款APY</th>
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
