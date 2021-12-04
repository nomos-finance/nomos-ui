import './lending.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { useTranslation } from 'react-i18next';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';
import { Swap, ISwapDialog } from '../../components/ChangeDialog';
import useProtocolDataWithRpc from '../../hooks/usePoolData';
import useNetworkInfo from '../../hooks/useNetworkInfo';
import useWalletBalance from '../../hooks/useWalletBalance';
import MarketTable from './marketTable';
import MySavingLoad from './mySavingLoad';
import Chart from '../../components/Chart';
import { CompactNumber } from '../../components/CompactNumber';

import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from 'app/reducers/RootState';
import { setRefreshUIPoolData } from 'app/actions/baseAction';
import { formatMoney } from 'app/utils/tool';
import { useHistory } from 'react-router';

export default function Markets() {
  const history = useHistory();
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [totalLiquidity, setTotalLiquidity] = useState('');
  const [totalDeposit, setTotalDeposit] = useState('');
  const [totalBorrow, setTotalBorrow] = useState('');
  const SwapDialogRef = useRef<ISwapDialog>();
  const [networkInfo] = useNetworkInfo();
  const { currentThemeName } = useThemeContext();
  const { data, refresh } = useProtocolDataWithRpc();
  const { account, refreshUIPoolData } = useSelector((store: IRootState) => store.base);

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

  useEffect(() => {
    if (!refreshUIPoolData || !account) return;
    refresh(account);
    dispatch(setRefreshUIPoolData(false));
  }, [refreshUIPoolData, account]);

  return (
    <Layout className="page-market">
      <div className="totalBlock">
        <div className={classnames('block', 'totalLiquidity')}>
          <div className={classnames('inner', currentThemeName)}>
            <div className="text">
              <span>
                {t('lending.totalLiquidity')}
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
                {t('lending.totalDeposited')}
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
                {t('lending.totalBorrowed')}
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
              <span>{t('lending.myAddress')}</span>
              <span className="btn">{t('lending.claim')}</span>
            </div>
            <div className="main">
              <div className="item">
                <Icon name="deposit" />
                <div className="text">{t('lending.myDeposits')}</div>
                <div className="number">${formatMoney(data?.user?.totalLiquidityUSD)}</div>
              </div>
              <div className="item">
                <Icon name="loan" />
                <div className="text">{t('lending.myLoans')}</div>
                <div className="number">${formatMoney(data?.user?.totalBorrowsUSD)}</div>
              </div>
              <div className="item">
                <Icon name="rate" />
                <div className="text">{t('lending.totalAPR')}</div>
                <div className="number">--</div>
              </div>
              <div className="item">
                <Icon name="reward" />
                <div className="text">{t('lending.claimable')}</div>
                <div className="number">${formatMoney(data?.user?.totalRewardsUSD)}</div>
              </div>
            </div>
          </div>
          <div className="block charts">
            <div className="title">
              <span>{t('lending.healthFactor')}</span>
            </div>
            <div className="main">
              <Chart
                percentage={60}
                text={`${t('lending.maxBorrowLimit')}<br />$${
                  data && data.user
                    ? formatMoney(
                        new BigNumber(data.user.availableBorrowsETH)
                          .multipliedBy(data.usdPriceEth)
                          .toString()
                      )
                    : 0
                }`}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="block voteBlock">
        <div className="header">
          <div className="text">
            <span>{t('lending.nomoLock-up')}</span>
            <i>{t('lending.getBonusRewards')}</i>
          </div>
          <div className="more">{t('lending.details')} &gt;</div>
        </div>
        <div className="main">
          <div className="item">
            <span>{t('lending.nomoLocked')}</span>
            <i>10,000.00</i>
          </div>
          <div className="item">
            <span>{t('lending.myBoost')}</span>
            <i>1.5x</i>
          </div>
          <div className="btn" onClick={() => history.push('/dao')}>
            {t('lending.DAO&Safety')}
          </div>
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
