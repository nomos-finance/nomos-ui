import React, { useState, useRef } from 'react';
import classnames from 'classnames';
import { ComputedReserveData, UserSummaryData } from '@aave/protocol-js';

import {
  Borrow,
  Deposit,
  Swap,
  IBorrowDialog,
  IDepositDialog,
  ISwapDialog,
} from '../../components/ChangeDialog/';

interface IProps {
  reserves: ComputedReserveData[];
  user: UserSummaryData;
  balance: IBalance;
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

  return (
    <div className="assetBlock">
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
        <div className="text" onClick={() => SwapDialogRef.current?.show()}>
          想把抵押资产换成其他资产，不用赎回，一键可完成
        </div>
      </div>
      {tab === 'deposit' ? (
        <div className="block">
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
                        })
                      }
                    >
                      <td>{item.reserve.symbol}</td>
                      <td>{item.usageAsCollateralEnabledOnUser ? 'true' : 'false'}</td>
                      <td>{item.reserve.liquidityRate}</td>
                      <td>
                        {item.underlyingBalance} u:{item.underlyingBalanceUSD}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="block">
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
                        })
                      }
                    >
                      <td>{item.reserve.symbol}</td>
                      <td>
                        stable: {item.stableBorrowRate} variable:
                        {obj[item.reserve.symbol].variableBorrowRate}
                      </td>
                      <td>
                        stable: {item.stableBorrows} {item.stableBorrowsUSD} variable:{' '}
                        {item.variableBorrows} {item.variableBorrowsUSD}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      )}
      <Borrow ref={BorrowDialogRef} />
      <Deposit ref={DepositDialogRef} />
      <Swap ref={SwapDialogRef} />
    </div>
  );
}