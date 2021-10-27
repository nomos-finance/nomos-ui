import './index.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { Progress } from 'antd';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';
import { Swap, ISwapDialog } from '../../components/ChangeDialog/';
import useProtocolDataWithRpc from '../../hooks/usePoolData';
import useNetworkInfo from '../../hooks/useNetworkInfo';
import useWalletBalance from '../../hooks/useWalletBalance';
import { useWeb3React } from '@web3-react/core';
import MarketTable from './marketTable';
import MySavingLoad from './mySavingLoad';

export default function Markets() {
  const { account } = useWeb3React();
  const [totalLiquidity, setTotalLiquidity] = useState('');
  const SwapDialogRef = useRef<ISwapDialog>();
  const [networkInfo] = useNetworkInfo();

  const { data, refresh } = useProtocolDataWithRpc();

  const [balance] = useWalletBalance(
    networkInfo?.walletBalanceProvider,
    account,
    networkInfo?.chainKey,
    networkInfo?.addresses.LENDING_POOL_ADDRESS_PROVIDER
  );

  return (
    <Layout className="page-market">
      <div className="totalBlock">
        <div className="block">
          <div className="text">
            <span>
              <Icon name="allLiquidity" />
              <Icon name="question" className="question" />
              总流动性
            </span>
          </div>
          <div className="number">${totalLiquidity}</div>
        </div>
        <div className="block">
          <div className="text">
            <span>
              <Icon name="allDeposit" />
              总存款
            </span>
          </div>
          <div className="number">$50,000.00</div>
        </div>
        <div className="block">
          <div className="text">
            <span>
              <Icon name="allLoan" />
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
      {data?.user && balance && (
        <MySavingLoad balance={balance} reserves={data.reserves} user={data.user} />
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
