import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { ComputedReserveData, UserSummaryData, normalize } from '@aave/protocol-js';
import SymbolIcon from '../../components/SymbolIcon';
import {
  Borrow,
  Deposit,
  Swap,
  IBorrowDialog,
  IDepositDialog,
  ISwapDialog,
} from '../../components/ChangeDialog/';
import { formatDecimal, formatMoney } from 'app/utils/tool';

interface IProps {
  reserves: ComputedReserveData[];
  user: UserSummaryData;
  balance: IBalance;
  usdPriceEth: string;
}

interface IBalance {
  [key: string]: string;
}

export default function MySavingLoad(props: IProps) {
  const BorrowDialogRef = useRef<IBorrowDialog>();
  const DepositDialogRef = useRef<IDepositDialog>();
  const SwapDialogRef = useRef<ISwapDialog>();
  const [tab, setTab] = useState('deposit');
  const obj: any = {};

  props.user.reservesData.forEach((userReserve) => {
    const poolReserve = props.reserves.find((res) => res.symbol === userReserve.reserve.symbol);
    obj[userReserve.reserve.symbol] = poolReserve;
  });

  const marketRefPriceInUsd = normalize(props.usdPriceEth, 18);

  return (
    <div className="block assetBlock">
      <div className="header">
        <div className="tab">
          <div
            className={classnames('tabItem', { cur: tab === 'deposit' })}
            onClick={() => setTab('deposit')}
          >
            我的存款
          </div>
          <div
            className={classnames('tabItem', { cur: tab === 'borrow' })}
            onClick={() => setTab('borrow')}
          >
            我的贷款
          </div>
        </div>
        <div className="more" onClick={() => SwapDialogRef.current?.show()}>
          想把抵押资产换成其他资产，不用赎回，一键可完成 &gt;
        </div>
      </div>
      {tab === 'deposit' ? (
        <table>
          <thead>
            <tr>
              <th>资产</th>
              <th>抵押品</th>
              <th>年收益率</th>
              <th>存款余额</th>
            </tr>
          </thead>
          <tbody>
            {props.user.reservesData.map((item) => {
              if (Number(item?.underlyingBalance)) {
                return (
                  <tr
                    key={item.reserve.id}
                    onClick={() =>
                      DepositDialogRef.current?.show({
                        type: 'Deposit',
                        data: obj[item.reserve.symbol],
                        marketRefPriceInUsd,
                        user: props.user,
                        balance: props.balance[item.reserve.underlyingAsset],
                      })
                    }
                  >
                    <td>
                      <div className="asset">
                        <SymbolIcon symbol={item.reserve.symbol} />
                        <span>{item.reserve.symbol}</span>
                      </div>
                    </td>
                    <td>{item.usageAsCollateralEnabledOnUser ? 'true' : 'false'}</td>
                    <td>{formatDecimal(Number(item.reserve.liquidityRate) * 100)}%</td>
                    <td>
                      <div>{Number(item.underlyingBalance).toFixed(2)}</div>
                      <div>${formatMoney(item.underlyingBalanceUSD)}</div>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      ) : (
        <table>
          <thead>
            <tr>
              <th>资产</th>
              <th>利率</th>
              <th>已借</th>
            </tr>
          </thead>
          <tbody>
            {props.user.reservesData.map((item) => {
              if (Number(item?.scaledVariableDebt)) {
                return (
                  <tr
                    key={item.reserve.id}
                    onClick={() =>
                      BorrowDialogRef.current?.show({
                        type: 'Repay',
                        data: obj[item.reserve.symbol],
                        user: props.user,
                      })
                    }
                  >
                    <td>
                      <div className="asset">
                        <SymbolIcon symbol={item.reserve.symbol} />
                        <span>{item.reserve.symbol}</span>
                      </div>
                    </td>
                    <td>
                      <div>stable: {formatDecimal(Number(item.stableBorrowRate) * 100)}% </div>
                      <div>
                        variable:
                        {formatDecimal(Number(obj[item.reserve.symbol].variableBorrowRate) * 100)}%
                      </div>
                    </td>
                    <td>
                      <div>
                        <span>stable: {Number(item.stableBorrows).toFixed(2)}</span>
                        <span>${formatMoney(item.stableBorrowsUSD)}</span>
                      </div>
                      <div>
                        <span>variable: {Number(item.variableBorrows).toFixed(2)}</span>
                        <span>${formatMoney(item.variableBorrowsUSD)}</span>
                      </div>
                    </td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      )}
      <Borrow ref={BorrowDialogRef} />
      <Deposit ref={DepositDialogRef} />
      <Swap ref={SwapDialogRef} />
    </div>
  );
}
