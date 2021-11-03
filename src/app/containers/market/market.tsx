import './index.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';
import { Swap, ISwapDialog } from '../../components/ChangeDialog/';
import useProtocolDataWithRpc from '../../hooks/usePoolData';
import useNetworkInfo from '../../hooks/useNetworkInfo';
import useWalletBalance from '../../hooks/useWalletBalance';
import MarketTable from './marketTable';
import MySavingLoad from './mySavingLoad';
import Chart from '../../components/Chart';
import { CompactNumber } from '../../components/CompactNumber';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';

export default function Markets() {
  const [totalLiquidity, setTotalLiquidity] = useState('');
  const [totalDeposit, setTotalDeposit] = useState('');
  const [totalBorrow, setTotalBorrow] = useState('');
  const SwapDialogRef = useRef<ISwapDialog>();
  const [networkInfo] = useNetworkInfo();
  const { currentThemeName } = useThemeContext();
  const { data, refresh } = useProtocolDataWithRpc();
  const { account } = useSelector((store: IRootState) => store.base);

  const [balance, fetchBalance] = useWalletBalance(
    networkInfo?.walletBalanceProvider,
    account,
    networkInfo?.chainKey,
    networkInfo?.addresses.LENDING_POOL_ADDRESS_PROVIDER
  );

  useEffect(() => {
    if (!data) return;
    const marketRefPriceInUsd = normalize(data.usdPriceEth, 18);
    let liquidity = new BigNumber(0);
    let totalLiquidityInUSD = new BigNumber(0);
    let totalBorrowsInUSD = new BigNumber(0);

    data.reserves.forEach((item) => {
      liquidity = liquidity.plus(item.availableLiquidity);
      totalLiquidityInUSD = totalLiquidityInUSD.plus(
        valueToBigNumber(item.totalLiquidity)
          .multipliedBy(item.price.priceInEth)
          .dividedBy(marketRefPriceInUsd)
      );
      totalBorrowsInUSD = totalBorrowsInUSD.plus(
        valueToBigNumber(item.totalDebt)
          .multipliedBy(item.price.priceInEth)
          .dividedBy(marketRefPriceInUsd)
          .toNumber()
      );
    });
    setTotalLiquidity(liquidity.toString());
    setTotalDeposit(totalLiquidityInUSD.toString());
    setTotalBorrow(totalBorrowsInUSD.toString());
    fetchBalance();
  }, [data]);

  // console.log(data);

  return (
    <Layout className="page-market">
      <div className="totalBlock">
        <div className={classnames('block', 'totalLiquidity')}>
          <div className={classnames('inner', currentThemeName)}>
            <div className="text">
              <span>
                总流动性
                <Icon name="question" className="question" />
              </span>
            </div>
            <div className="number">
              <i>$</i>
              <CompactNumber value={totalLiquidity} />
            </div>
          </div>
        </div>
        <div className={classnames('block', 'totalDeposit')}>
          <div className={classnames('inner', currentThemeName)}>
            <div className="text">
              <span>
                总存款
                <Icon name="question" className="question" />
              </span>
            </div>
            <div className="number">
              <i>$</i>
              <CompactNumber value={totalDeposit} />
            </div>
          </div>
        </div>
        <div className={classnames('block', 'totalBorrow')}>
          <div className={classnames('inner', currentThemeName)}>
            <div className="text">
              <span>
                总贷款
                <Icon name="question" className="question" />
              </span>
            </div>
            <div className="number">
              <i>$</i>
              {/* <CompactNumber value={totalBorrow} /> */}
            </div>
          </div>
        </div>
      </div>

      {account && (data?.user?.totalLiquidityUSD || data?.user?.totalBorrowsUSD) ? (
        <div className="userBlock">
          <div className="block userInfo">
            <div className="title">
              <span>我的账户</span>
              <span className="btn">领取奖励</span>
            </div>
            <div className="main">
              <div className="item">
                <Icon name="deposit" />
                <div className="text">我的存款</div>
                <div className="number">${data?.user?.totalLiquidityUSD}</div>
              </div>
              <div className="item">
                <Icon name="loan" />
                <div className="text">我的贷款</div>
                <div className="number">${data?.user?.totalBorrowsUSD}</div>
              </div>
              <div className="item">
                <Icon name="rate" />
                <div className="text">总收益年利率</div>
                <div className="number"></div>
              </div>
              <div className="item">
                <Icon name="reward" />
                <div className="text">可领取奖励NOMO</div>
                <div className="number">${data?.user?.totalRewardsUSD}</div>
              </div>
            </div>
          </div>
          <div className="block charts">
            <div className="title">
              <span>健康因子</span>
            </div>
            <div>
              贷款上限 $
              {data && data.user
                ? new BigNumber(data.user.availableBorrowsETH)
                    .multipliedBy(data.usdPriceEth)
                    .toString()
                : 0}
            </div>
            <div className="main">
              <Chart percentage={60} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="block voteBlock">
        <div className="header">
          <div className="text">
            <span>锁仓NOMO</span>
            <i>可在所有市场获得加成奖励</i>
          </div>
          <div className="more">了解更多 &gt;</div>
        </div>
        <div className="main">
          <div className="item">
            <span>已锁仓NOMO</span>
            <i>10,000.00</i>
          </div>
          <div className="item">
            <span>收益加成</span>
            <i>10,000.00</i>
          </div>
          <div className="btn">去DAO&Safety锁仓NOMO</div>
        </div>
      </div>
      {data?.user &&
      balance &&
      account &&
      (data?.user?.totalLiquidityUSD || data?.user?.totalBorrowsUSD) ? (
        <MySavingLoad
          balance={balance}
          reserves={data.reserves}
          user={data.user}
          usdPriceEth={data.usdPriceEth}
        />
      ) : null}
      {data && balance && (
        <MarketTable
          balance={balance}
          reserves={data.reserves}
          usdPriceEth={data.usdPriceEth}
          user={data?.user}
        />
      )}
      <Swap ref={SwapDialogRef} />
    </Layout>
  );
}
