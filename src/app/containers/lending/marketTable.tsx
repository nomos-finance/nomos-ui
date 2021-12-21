import React, { useRef, useState } from 'react';
import { ComputedReserveData, UserSummaryData } from '../../hooks/utils/types';
import { Input, Table } from 'antd';
import {
  Borrow,
  Deposit,
  Swap,
  IBorrowDialog,
  IDepositDialog,
  ISwapDialog,
} from '../../components/ChangeDialog/';
import { formatDecimal, formatMoney, pow10, valueToBigNumber, normalize } from '../../utils/tool';
import Icon from '../../../assets/icons';
import classnames from 'classnames';
import SymbolIcon from '../../components/SymbolIcon';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from 'app/reducers/RootState';

interface IProps {
  reserves: ComputedReserveData[];
  balance: IBalance;
  user?: UserSummaryData;
  healthFactor: string;
  symbolUsd: {
    [key: string]: string;
  };
}

interface IBalance {
  [key: string]: string;
}

export default function MarketTable(props: IProps) {
  const [t] = useTranslation();
  const BorrowDialogRef = useRef<IBorrowDialog>();
  const DepositDialogRef = useRef<IDepositDialog>();
  const [borrowType, setBorrowType] = useState('USD');
  const [tab, setTab] = useState('deposit');
  const { account } = useSelector((store: IRootState) => store.base);
  const [keyword, setKeyword] = useState('');

  let sortedData = props.reserves
    .filter((res) => res.isActive)
    .filter((res) => {
      const reg = new RegExp(keyword, 'ig');
      if (reg.test(res.underlyingAsset) || reg.test(res.symbol)) return true;
      return false;
    })
    .map((reserve) => {
      const totalLiquidity = Number(reserve.totalLiquidity);

      const totalBorrows = Number(reserve.totalDebt);

      return {
        reserve,
        totalLiquidity,
        totalBorrows: reserve.borrowingEnabled ? totalBorrows : -1,
        id: reserve.id,
        underlyingAsset: reserve.underlyingAsset,
        currencySymbol: reserve.symbol,
        depositAPY: reserve.borrowingEnabled ? Number(reserve.liquidityRate) : -1,
        stableBorrowRate:
          reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
            ? Number(reserve.stableBorrowRate)
            : -1,
        variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowRate) : -1,
        borrowingEnabled: reserve.borrowingEnabled,
        stableBorrowRateEnabled: reserve.stableBorrowRateEnabled,
        isFreezed: reserve.isFrozen,
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
          <Input
            bordered={false}
            placeholder={t('lending.search')}
            onChange={(v) => setKeyword(v.target.value)}
          />
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
                    user: props.user,
                    healthFactor: props.healthFactor,
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
                <td>{item.reserve.collateralCap === '0' ? '--' : item.reserve.collateralCap}</td>
                <td>{item.reserve.collateralCap === '0' ? '--' : 'xxx'}</td>
                <td>
                  <div className="money">
                    {account
                      ? formatMoney(
                          pow10(props.balance[item.underlyingAsset], item.reserve.decimals)
                        )
                      : '--'}
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
                    healthFactor: props.healthFactor,
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
                <td>{item.reserve.borrowCap === '0' ? '--' : item.reserve.borrowCap}</td>
                <td>{item.reserve.borrowCap === '0' ? '--' : 'xxx'}</td>
                <td>
                  {formatMoney(
                    borrowType === 'USD'
                      ? valueToBigNumber(item.totalLiquidity)
                          .multipliedBy(props.symbolUsd[item.reserve.symbol])
                          .toString()
                      : item.totalLiquidity,
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
