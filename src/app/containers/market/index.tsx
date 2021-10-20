import './market.scss';
import React, { useState, useRef, useEffect } from 'react';
import { valueToBigNumber, normalize } from '@aave/protocol-js';
import classnames from 'classnames';
import { ethers } from 'ethers';
import { formatReserves, ComputedReserveData } from '@aave/protocol-js';
import { Progress } from 'antd';

import Layout from '../../components/Layout';
import ChangeDialog, { IDialog } from '../../components/ChangeDialog';
import useProtocolDataWithRpc from '../../hooks/usePoolData';
import useNetworkInfo from '../../hooks/useNetworkInfo';
import useWalletBalance from '../../hooks/useWalletBalance';
import { useWeb3React } from '@web3-react/core';
import { formatDecimal } from '../../utils/tool';

export default function Markets() {
  const { account, chainId } = useWeb3React();
  const [totalLiquidity, setTotalLiquidity] = useState('');
  const SwapDialogRef = useRef<IDialog>();
  const [tab, setTab] = useState('deposit');
  const [networkInfo] = useNetworkInfo();
  const [formatReservesData, setFormatReservesData] = useState<ComputedReserveData[]>([]);
  let totalLockedInUsd = valueToBigNumber('0');
  let marketRefPriceInUsd = normalize(1, 10);

  const { error, loading, data, refresh } = useProtocolDataWithRpc(
    networkInfo?.uiPoolDataProvider,
    ethers.constants.AddressZero,
    networkInfo?.chainKey,
    networkInfo?.addresses.LENDING_POOL_ADDRESS_PROVIDER
  );

  useWalletBalance(
    networkInfo?.walletBalanceProvider,
    account,
    networkInfo?.chainKey,
    networkInfo?.addresses.LENDING_POOL_ADDRESS_PROVIDER
  );

  useEffect(() => {
    if (!data) return;
    let r = formatReserves(data.reserves);
    // r.filter((res) => res.isActive).map((reserve) => {
    //   totalLockedInUsd = totalLockedInUsd.plus(
    //     valueToBigNumber(reserve.totalLiquidity)
    //       .multipliedBy(reserve.price.priceInEth)
    //       .dividedBy(marketRefPriceInUsd)
    //   );

    //   const totalLiquidity = Number(reserve.totalLiquidity);
    //   const totalLiquidityInUSD = valueToBigNumber(reserve.totalLiquidity)
    //     .multipliedBy(reserve.price.priceInEth)
    //     .dividedBy(marketRefPriceInUsd)
    //     .toNumber();

    //   const totalBorrows = Number(reserve.totalDebt);
    //   const totalBorrowsInUSD = valueToBigNumber(reserve.totalDebt)
    //     .multipliedBy(reserve.price.priceInEth)
    //     .dividedBy(marketRefPriceInUsd)
    //     .toNumber();

    //   return {
    //     totalLiquidity,
    //     totalLiquidityInUSD,
    //     totalBorrows: reserve.borrowingEnabled ? totalBorrows : -1,
    //     totalBorrowsInUSD: reserve.borrowingEnabled ? totalBorrowsInUSD : -1,
    //     id: reserve.id,
    //     underlyingAsset: reserve.underlyingAsset,
    //     currencySymbol: reserve.symbol,
    //     depositAPY: reserve.borrowingEnabled ? Number(reserve.liquidityRate) : -1,
    //     avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
    //     stableBorrowRate:
    //       reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
    //         ? Number(reserve.stableBorrowRate)
    //         : -1,
    //     variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowRate) : -1,
    //     avg30DaysVariableRate: Number(reserve.avg30DaysVariableBorrowRate),
    //     borrowingEnabled: reserve.borrowingEnabled,
    //     stableBorrowRateEnabled: reserve.stableBorrowRateEnabled,
    //     isFreezed: reserve.isFrozen,
    //     aIncentivesAPY: reserve.aIncentivesAPY,
    //     vIncentivesAPY: reserve.vIncentivesAPY,
    //     sIncentivesAPY: reserve.sIncentivesAPY,
    //   };
    // });
    setFormatReservesData(r);
    let availableLiquidity = valueToBigNumber(0);
    r.forEach((item) => {
      const u = valueToBigNumber(item.availableLiquidity)
        .multipliedBy(item.price.priceInEth)
        .dividedBy(marketRefPriceInUsd);
      availableLiquidity.plus(u);
    });
    setTotalLiquidity(availableLiquidity.toString());
    return () => {};
  }, [data]);

  console.log(formatReservesData);

  return (
    <Layout className="page-market">
      <div className="totalBlock">
        <div className="block">
          <div className="text">
            <span>
              {/* <Icon name="allLiquidity" />
                            <Icon name="question" className="question" /> */}
              总流动性
            </span>
          </div>
          <div className="number">${totalLiquidity}</div>
        </div>
        <div className="block">
          <div className="text">
            <span>
              {/* <Icon name="allDeposit" /> */}
              总存款
            </span>
          </div>
          <div className="number">$50,000.00</div>
        </div>
        <div className="block">
          <div className="text">
            <span>
              {/* <Icon name="allLoan" /> */}
              总贷款
            </span>
          </div>
          <div className="number">$50,000.00</div>
        </div>
      </div>
      <div className="userBlock">
        <div className="title">我的账户</div>
        <div className="userBlockMain">
          <div className="block">
            <div className="main">
              <div className="item">
                {/* <Icon name="deposit" /> */}
                <div className="text">我的存款</div>
                <div className="number">$50,000.00</div>
              </div>
              <div className="item">
                {/* <Icon name="loan" /> */}
                <div className="text">我的贷款</div>
                <div className="number">$50,000.00</div>
              </div>
              <div className="item">
                {/* <Icon name="rate" /> */}
                <div className="text">总收益年利率</div>
                <div className="number">$50,000.00</div>
              </div>
              <div className="item">
                {/* <Icon name="reward" /> */}
                <div className="text">可领取奖励NOMO</div>
                <div className="number">$50,000.00</div>
              </div>
            </div>
            <div className="btn">领取奖励</div>
          </div>
          <div className="block">
            <Progress
              width={130}
              type="circle"
              trailColor={'#ffe7cd'}
              strokeColor={{
                '0%': '#fd9303',
                '100%': '#f9bd00',
              }}
              percent={80}
              format={(percent) => (
                <>
                  <div>{percent}%</div>
                  <div>健康因子</div>
                </>
              )}
            />
            <div>贷款上限 $1000.00</div>
          </div>
        </div>
      </div>
      <div className="block voteBlock">
        <div className="text">通过投票提高放大倍数来获取更高收益</div>
        <div className="btn">投票</div>
      </div>
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
              className={classnames('tabItem', { cur: tab === 'loan' })}
              onClick={() => setTab('loan')}
            >
              我的存款
            </div>
          </div>
          <div className="text" onClick={() => SwapDialogRef.current?.show()}>
            想把抵押资产换成其他资产，不用赎回，一键可完成
          </div>
        </div>
        <div className="block">
          <table>
            <thead>
              <tr>
                <th>资产</th>
                <th>存款APY</th>
                <th>奖励APR</th>
                <th>钱包余额</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>1</td>
                <td>1</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="marketBlock">
        <div className="main">
          <div className="title">存款市场</div>
          <div className="block">
            <table>
              <thead>
                <tr>
                  <th>资产</th>
                  <th>存款APY</th>
                  <th>奖励APR</th>
                  <th>钱包余额</th>
                </tr>
              </thead>
              <tbody>
                {formatReservesData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.symbol}</td>
                    <td>{item.borrowingEnabled ? Number(item.liquidityRate) : -1}</td>
                    <td>{item.aIncentivesAPY}</td>
                    <td>1</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="main">
          <div className="title">贷款市场</div>
          <div className="block">
            <table>
              <thead>
                <tr>
                  <th>资产</th>
                  <th>贷款APY</th>
                  <th>奖励APR</th>
                </tr>
              </thead>
              <tbody>
                {formatReservesData
                  .filter((res) => res.isActive)
                  .map((item) => (
                    <tr key={item.id}>
                      <td>{item.symbol}</td>
                      <td>{item.borrowingEnabled ? Number(item.variableBorrowRate) : -1}</td>
                      <td>{item.vIncentivesAPY}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ChangeDialog type="Swap" ref={SwapDialogRef} />
    </Layout>
  );
}
