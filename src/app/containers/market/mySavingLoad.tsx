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
import { Switch } from 'antd';

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
      {props.user.reservesData.length ? (
        <div style={{ display: tab === 'deposit' ? 'block' : 'none' }}>
          <table>
            <thead>
              <tr>
                <th>资产</th>
                <th>存款数量</th>
                <th>存款APY</th>
                <th>
                  <span>
                    奖励APR
                    <em className="tag">
                      <i>加成比例</i>
                    </em>
                  </span>
                </th>
                <th>抵押品</th>
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
                          type: 'Withdraw',
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
                      <td>
                        <div>{Number(item.underlyingBalance).toFixed(2)}</div>
                      </td>
                      <td>{formatDecimal(Number(item.reserve.liquidityRate) * 100)}%</td>
                      <td>
                        <span>
                          --
                          <em className="tag">
                            <i>1.6x</i>
                          </em>
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={item.usageAsCollateralEnabledOnUser}
                          onChange={() => alert('change')}
                        ></Switch>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
          <div className="btnWrap">
            <div className="btn" onClick={() => alert('查看更多')}>
              查看更多
            </div>
          </div>
        </div>
      ) : null}

      {props.user.reservesData.length ? (
        <div style={{ display: tab !== 'deposit' ? 'block' : 'none' }}>
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
                          {formatDecimal(Number(obj[item.reserve.symbol].variableBorrowRate) * 100)}
                          %
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
          <div className="btnWrap">
            <div className="btn" onClick={() => alert('查看更多')}>
              查看更多
            </div>
          </div>
        </div>
      ) : null}
      <Borrow ref={BorrowDialogRef} />
      <Deposit ref={DepositDialogRef} />
      <Swap ref={SwapDialogRef} />
    </div>
  );
}
