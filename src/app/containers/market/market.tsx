import './index.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';
import { Swap, ISwapDialog } from '../../components/ChangeDialog/';
import useProtocolDataWithRpc from '../../hooks/usePoolData';
import useNetworkInfo from '../../hooks/useNetworkInfo';
import useWalletBalance from '../../hooks/useWalletBalance';
import { useWeb3React } from '@web3-react/core';
import MarketTable from './marketTable';
import MySavingLoad from './mySavingLoad';
import Chart from '../../components/Chart';

export default function Markets() {
  const { account } = useWeb3React();
  const [totalLiquidity, setTotalLiquidity] = useState('');
  const SwapDialogRef = useRef<ISwapDialog>();
  const [networkInfo] = useNetworkInfo();
  const { currentThemeName } = useThemeContext();
  const { data, refresh } = useProtocolDataWithRpc();

  const [balance] = useWalletBalance(
    networkInfo?.walletBalanceProvider,
    account,
    networkInfo?.chainKey,
    networkInfo?.addresses.LENDING_POOL_ADDRESS_PROVIDER
  );

  console.log(data?.user);

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
              {totalLiquidity}
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
              <i>$</i>50,000.00
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
              <i>$</i>50,000.00
            </div>
          </div>
        </div>
      </div>
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
          {/* <div>
            贷款上限 $
            {data && data.user
              ? new BigNumber(data.user.availableBorrowsETH)
                  .multipliedBy(data.usdPriceEth)
                  .toString()
              : 0}
          </div>
          {data?.usdPriceEth} */}
          <div className="main">
            <Chart percentage={60} />
          </div>
        </div>
      </div>
      <div className="block voteBlock">
        <div className="title">
          <span>QBT Locker</span>
          <Icon name="note" />
        </div>
        <div className="main">
          <div className="item">
            <span>Locked</span>
            <i>10,000.00</i>
          </div>
          <div className="item">
            <span>Locked Period</span>
          </div>
          <div className="item">
            <span>qScore</span>
            <i>10,000.00</i>
          </div>
          <div className="item">
            <div className="btn">投票</div>
          </div>
        </div>
      </div>
      {data?.user && balance && (
        <MySavingLoad
          balance={balance}
          reserves={data.reserves}
          user={data.user}
          usdPriceEth={data.usdPriceEth}
        />
      )}
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
