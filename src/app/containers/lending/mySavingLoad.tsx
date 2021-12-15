import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import {
  ComputedReserveData,
  UserSummaryData,
  normalize,
  ComputedUserReserve,
} from '@aave/protocol-js';
import SymbolIcon from '../../components/SymbolIcon';
import {
  Borrow,
  Deposit,
  Swap,
  UsageAsCollateral,
  IBorrowDialog,
  IDepositDialog,
  ISwapDialog,
  IUsageAsCollateralDialog,
} from '../../components/ChangeDialog/';
import { formatDecimal, formatMoney, chunk } from 'app/utils/tool';
import { Switch } from 'antd';
import { useTranslation } from 'react-i18next';

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
  const [t] = useTranslation();
  const BorrowDialogRef = useRef<IBorrowDialog>();
  const DepositDialogRef = useRef<IDepositDialog>();
  const SwapDialogRef = useRef<ISwapDialog>();
  const UsageAsCollateralRef = useRef<IUsageAsCollateralDialog>();
  const [tab, setTab] = useState('deposit');
  const [depositData, setDepositData] = useState<ComputedUserReserve[][]>([]);
  const [borrowData, setBorrowData] = useState<ComputedUserReserve[][]>([]);
  const [depositDataTmp, setDepositDataTmp] = useState<ComputedUserReserve[]>([]);
  const [borrowDataTmp, setBorrowDataTmp] = useState<ComputedUserReserve[]>([]);
  const [depositIndex, setDepositIndex] = useState(0);
  const [borrowIndex, setBorrowIndex] = useState(0);
  const obj: any = {};

  props.user.reservesData.forEach((userReserve) => {
    const poolReserve = props.reserves.find((res) => res.symbol === userReserve.reserve.symbol);
    obj[userReserve.reserve.symbol] = poolReserve;
  });

  const marketRefPriceInUsd = normalize(props.usdPriceEth, 18);

  useEffect(() => {
    let depositArr: ComputedUserReserve[] = [];
    let borrowArr: ComputedUserReserve[] = [];
    props.user.reservesData.forEach((item) => {
      if (Number(item?.underlyingBalance)) {
        depositArr.push(item);
      }
      if (Number(item?.scaledVariableDebt)) {
        borrowArr.push(item);
      }
    });
    const depositTmp = chunk(depositArr, 5);
    const borrowTmp = chunk(borrowArr, 5);
    setDepositData(depositTmp);
    setBorrowData(borrowTmp);
    setDepositDataTmp(depositTmp[0]);
    setBorrowDataTmp(borrowTmp[0]);
    return () => {
      setDepositData([]);
      setBorrowData([]);
      setDepositDataTmp([]);
      setBorrowDataTmp([]);
    };
  }, [props.user.reservesData]);

  const changeDepositData = () => {
    setDepositDataTmp(depositDataTmp.concat(depositData[depositIndex + 1]));
    setDepositIndex(depositIndex + 1);
  };

  const changeBorrowData = () => {
    setBorrowDataTmp(borrowDataTmp.concat(borrowData[borrowIndex + 1]));
    setBorrowIndex(borrowIndex + 1);
  };

  return (
    <div className="block assetBlock">
      <div className="header">
        <div className="tab">
          {depositDataTmp?.length ? (
            <div
              className={classnames('tabItem', { cur: tab === 'deposit' })}
              onClick={() => setTab('deposit')}
            >
              {t('lending.myDeposits')}
            </div>
          ) : null}
          {borrowDataTmp?.length ? (
            <div
              className={classnames('tabItem', { cur: tab === 'borrow' })}
              onClick={() => setTab('borrow')}
            >
              {t('lending.myLoans')}
            </div>
          ) : null}
        </div>
        <div className="more" onClick={() => SwapDialogRef.current?.show()}>
          {t('lending.one-click')} &gt;
        </div>
      </div>
      {depositDataTmp?.length ? (
        <div style={{ display: tab === 'deposit' ? 'block' : 'none' }}>
          <table>
            <thead>
              <tr>
                <th>{t('lending.depositAsset')}</th>
                <th>{t('lending.depositBalance')}</th>
                <th>{t('lending.depositAPY')}</th>
                <th>
                  <span>
                    {t('lending.rewardAPR')}
                    <em className="tag">
                      <i>{t('lending.myBoost')}</i>
                    </em>
                  </span>
                </th>
                <th>{t('lending.collateral')}</th>
              </tr>
            </thead>
            <tbody>
              {depositDataTmp.map((item) => {
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
                      <td>{formatDecimal(Number((item.reserve as any).liquidityRate) * 100)}%</td>
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
                          onChange={(status) =>
                            UsageAsCollateralRef.current?.show({
                              status,
                              data: obj[item.reserve.symbol],
                              healthFactor: 111,
                            })
                          }
                        ></Switch>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
          {depositData.length > 1 && depositIndex < depositData.length - 1 ? (
            <div className="btnWrap">
              <div className="btn" onClick={() => changeDepositData()}>
                {t('lending.more')}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {borrowDataTmp?.length ? (
        <div style={{ display: tab !== 'deposit' ? 'block' : 'none' }}>
          <table>
            <thead>
              <tr>
                <th>{t('lending.borrowAsset')}</th>
                <th>{t('lending.borrowBalance')}</th>
                <th>{t('lending.variableLoanAPR')}</th>
                <th>{t('lending.stableLoanAPR')}</th>
                <th>
                  <span>
                    {t('lending.rewardAPR')}
                    <em className="tag">
                      <i>{t('lending.myBoost')}</i>
                    </em>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {borrowDataTmp.map((item) => {
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
                        {(+item.stableBorrows || +item.variableBorrows).toFixed(2)}
                        {/* <div>
                          <span>stable: {Number(item.stableBorrows).toFixed(2)}</span>
                        </div>
                        <div>
                          <span>variable: {Number(item.variableBorrows).toFixed(2)}</span>
                        </div> */}
                      </td>
                      <td>
                        {formatDecimal(Number(obj[item.reserve.symbol].variableBorrowRate) * 100)}%
                      </td>
                      <td>
                        {formatDecimal(Number(obj[item.reserve.symbol].stableBorrowRate) * 100)}%
                        {/* {formatDecimal(Number(item.stableBorrowRate) * 100)}% */}
                      </td>
                      <td>
                        <span>
                          --
                          <em className="tag">
                            <i>1.6x</i>
                          </em>
                        </span>
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
          {borrowData.length > 1 && borrowIndex < borrowData.length - 1 ? (
            <div className="btnWrap">
              <div className="btn" onClick={() => changeBorrowData()}>
                {t('lending.more')}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <Borrow ref={BorrowDialogRef} />
      <Deposit ref={DepositDialogRef} />
      <Swap ref={SwapDialogRef} />
      <UsageAsCollateral ref={UsageAsCollateralRef} />
    </div>
  );
}
