import './lending.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { useTranslation } from 'react-i18next';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';
import { Swap, ISwapDialog, Claim, IClaimDialog } from 'app/components/ChangeDialog/';
import useProtocolDataWithRpc from '../../hooks/usePoolData';
import useNetworkInfo from '../../hooks/useNetworkInfo';
import useWalletBalance from '../../hooks/useWalletBalance';
import MarketTable from './marketTable';
import MySavingLoad from './mySavingLoad';
import Chart from '../../components/Chart';
import { CompactNumber } from '../../components/CompactNumber';
import Lock from './lock';

import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from 'app/reducers/RootState';
import { setRefreshUIPoolData } from 'app/actions/baseAction';
import { formatMoney, pow10 } from 'app/utils/tool';
import useLendingPoolContract from 'app/hooks/useLendingPoolContract';

export default function Markets() {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const SwapDialogRef = useRef<ISwapDialog>();
  const ClaimDialogRef = useRef<IClaimDialog>();
  const [networkInfo] = useNetworkInfo();
  const { currentThemeName } = useThemeContext();
  const { data, refresh } = useProtocolDataWithRpc();
  const { account, refreshUIPoolData } = useSelector((store: IRootState) => store.base);

  const [totalLiquidity, setTotalLiquidity] = useState('');
  const [totalDeposit, setTotalDeposit] = useState('');
  const [totalBorrow, setTotalBorrow] = useState('');

  const [myTotalDeposit, setMyTotalDeposit] = useState('');
  const [myTotalBorrow, setMyTotalBorrow] = useState('');

  const [healthFactor, setHealthFactor] = useState<string>('0.00');

  const [balance, fetchBalance] = useWalletBalance(
    networkInfo?.walletBalanceProvider,
    account,
    networkInfo?.addresses.LENDING_POOL_ADDRESS_PROVIDER
  );

  const [lendingPoolContract] = useLendingPoolContract();

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      if (lendingPoolContract && account) {
        const {
          totalCollateralBase,
          totalDebtBase,
          availableBorrowsBase,
          currentLiquidationThreshold,
          ltv,
          healthFactor,
        } = await lendingPoolContract.getUserAccountData(account);
        setHealthFactor(new BigNumber(1).dividedBy(pow10(healthFactor.toString(), 18)).toFixed(2));
      }
    };
    fetch();
  }, [lendingPoolContract, account]);

  useEffect(() => {
    if (!data) return;
    let liquidity = new BigNumber(0);
    let totalLiquidityInUSD = new BigNumber(0);
    let totalBorrowsInUSD = new BigNumber(0);

    fetchBalance();

    data.reserves.forEach((item) => {
      liquidity = liquidity.plus(item.availableLiquidity);
      totalLiquidityInUSD = totalLiquidityInUSD.plus(
        valueToBigNumber(item.totalLiquidity).multipliedBy(data.symbolUsd[item.symbol])
      );
      totalBorrowsInUSD = totalBorrowsInUSD.plus(
        valueToBigNumber(item.totalDebt).multipliedBy(data.symbolUsd[item.symbol])
      );
    });
    setTotalLiquidity(liquidity.toString());
    setTotalDeposit(totalLiquidityInUSD.toString());
    setTotalBorrow(totalBorrowsInUSD.toString());

    let myTotalLiquidityInUSD = new BigNumber(0);
    let myTotalBorrowsInUSD = new BigNumber(0);

    data.user?.reservesData.forEach((item) => {
      myTotalLiquidityInUSD = myTotalLiquidityInUSD.plus(
        valueToBigNumber(item.underlyingBalance).multipliedBy(data.symbolUsd[item.reserve.symbol])
      );
    });
    setMyTotalDeposit(myTotalLiquidityInUSD.toString());
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
              <CompactNumber value={totalBorrow} />
            </div>
          </div>
        </div>
      </div>

      <div className="userBlock">
        <div className="block userInfo">
          <div className="title">
            <span>{t('lending.myAddress')}</span>
            <span className="btn" onClick={() => ClaimDialogRef.current?.show({ claim: 10000 })}>
              {t('lending.claim')}
            </span>
          </div>
          <div className="main">
            <div className="item">
              <Icon name="deposit" />
              <div className="text">{t('lending.myDeposits')}</div>
              <div className="number">
                $<CompactNumber value={myTotalDeposit} />
              </div>
            </div>
            <div className="item">
              <Icon name="loan" />
              <div className="text">{t('lending.myLoans')}</div>
              <div className="number">
                {account && data?.user ? `$${formatMoney(data.user.totalBorrowsUSD)}` : '$0.00'}
              </div>
            </div>
            <div className="item">
              <Icon name="rate" />
              <div className="text">{t('lending.totalAPR')}</div>
              <div className="number">--</div>
            </div>
            <div className="item">
              <Icon name="reward" />
              <div className="text">{t('lending.claimable')}</div>
              <div className="number">
                {account && data?.user ? `$${formatMoney(data.user.totalRewardsUSD)}` : '$0.00'}
              </div>
            </div>
          </div>
        </div>
        <div className="block charts">
          <div className="title">
            <span>{t('lending.healthFactor')}</span>
          </div>
          <div className="main">
            <Chart
              percentage={healthFactor}
              account={account}
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

      <Lock />

      {data?.user &&
      balance &&
      account &&
      (data?.user?.totalLiquidityUSD || data?.user?.totalBorrowsUSD) ? (
        <MySavingLoad
          balance={balance}
          reserves={data.reserves}
          user={data.user}
          usdPriceEth={data.usdPriceEth}
          healthFactor={healthFactor}
        />
      ) : null}
      {data && balance && (
        <MarketTable
          balance={balance}
          reserves={data.reserves}
          usdPriceEth={data.usdPriceEth}
          user={data?.user}
          healthFactor={healthFactor}
        />
      )}
      <Swap ref={SwapDialogRef} />
      <Claim ref={ClaimDialogRef} />
    </Layout>
  );
}
