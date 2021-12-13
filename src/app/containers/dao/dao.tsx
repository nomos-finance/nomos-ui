import './dao.stylus';
import { Contract } from 'ethers';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize } from '@aave/protocol-js';
import BigNumber from 'bignumber.js';
import { useThemeContext } from '../../theme';
import { Input, Button } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import * as ethers from 'ethers';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';
import { Claim, IClaimDialog, Lock, ILockDialog } from 'app/components/ChangeDialog/';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney, pow10, original, filterInput } from 'app/utils/tool';
import useVotingEscrowRewardContract from 'app/hooks/useVotingEscrowRewardContract';
import useVeNomos from 'app/hooks/useVeNomos';
import useNetworkInfo from 'app/hooks/useNetworkInfo';
import useErc20Contract from 'app/hooks/useErc20Contract';
import dayjs from 'dayjs';

const FooterText = (
  lockNum?: string,
  maxTime?: BigNumber,
  lockTime?: BigNumber,
  veNomosBalanceOf?: BigNumber,
  totalSupply?: BigNumber
): JSX.Element => {
  const [t] = useTranslation();

  const veNomos =
    lockNum && maxTime && lockTime
      ? maxTime
          .multipliedBy(+lockNum)
          .dividedBy(lockTime.dividedBy(7 * 24 * 60 * 60).multipliedBy(7 * 24 * 60 * 60))
      : new BigNumber(0);

  const boost =
    veNomosBalanceOf && totalSupply
      ? veNomosBalanceOf.plus(veNomos).dividedBy(veNomos.plus(totalSupply))
      : 0;
  return (
    <div className="text">
      <div>
        {t('dao.estimatedVeNOMO')}:
        <strong>
          {/* 锁仓金额 * MAXTIME /（锁仓时间 / 7*24*60*60 * 7*24*60*60） */}
          {formatMoney(veNomos.toString())}
        </strong>
      </div>
      <div>
        {t('dao.estimatedBoost')}:
        <strong>
          {/* (veNOMO.balanceOf + 预计获得veNOMO) / (veNOMO.totalSupply + 预计获得veNOMO) */}
          {formatMoney(boost.toString())} X
        </strong>
      </div>
    </div>
  );
};

export default function Markets() {
  const ClaimDialogRef = useRef<IClaimDialog>();
  const LockDialogRef = useRef<ILockDialog>();
  const [t] = useTranslation();
  const { currentThemeName } = useThemeContext();
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);
  const [votingEscrowRewardContract, freshVotingEscrowRewardContract] =
    useVotingEscrowRewardContract();
  const [veNomosContract, freshVeNomosContract] = useVeNomos();
  const [userEpochReward, setUserEpochReward] = useState<BigNumber>();
  const [, getErc20Contract] = useErc20Contract();
  const [nomoErc20Contract, setNomoErc20Contract] = useState<Contract>();
  const [veNomosBalanceOf, setVeNomosBalanceOf] = useState<BigNumber>();
  const [veNomoDecimals, setVeNomoDecimals] = useState<number>(18);
  const [rewardRate, setRewardRate] = useState<BigNumber>();
  const [nomoBalance, setNomoBalance] = useState('0');
  const [nomoDecimals, setNomoDecimals] = useState<number>(18);
  const [lockNum, setLockNum] = useState<string>();
  const [supply, setSupply] = useState<BigNumber>();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [maxTime, setMaxTime] = useState<BigNumber>(new BigNumber(0));
  const [locked, setLocked] = useState<{ amount: BigNumber; end: BigNumber }>();
  const [lockLoading, setLockLoading] = useState<boolean>(false);

  const fetchData = async () => {
    if (!votingEscrowRewardContract) return;
    try {
      const rewardRate = await votingEscrowRewardContract.rewardRate();
      setRewardRate(new BigNumber(rewardRate.toString()));
      if (account) {
        const userEpoch = await votingEscrowRewardContract.userEpoch(account);
        const userEpochReward = await votingEscrowRewardContract.userEpochReward(
          account,
          userEpoch.toString()
        );
        setUserEpochReward(userEpochReward);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [votingEscrowRewardContract, account]);

  const fetchVeNomosData = async () => {
    if (!veNomosContract) return;
    try {
      const supply = await veNomosContract.supply();
      const totalSupply = await veNomosContract.totalSupply();
      const MAXTIME = await veNomosContract.MAXTIME();
      const veNomoDecimals = await veNomosContract.decimals();
      setSupply(new BigNumber(supply.toString()));
      setTotalSupply(new BigNumber(totalSupply.toString()));
      setMaxTime(new BigNumber(MAXTIME.toString()));
      setVeNomoDecimals(+veNomoDecimals);
      if (account) {
        const balanceOf = await veNomosContract.balanceOf(account);
        setVeNomosBalanceOf(new BigNumber(balanceOf.toString()));
        const { 0: amount, 1: end } = await veNomosContract.locked(account);
        setLocked({ amount: new BigNumber(amount.toString()), end: new BigNumber(end.toString()) });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVeNomosData();
  }, [veNomosContract, account]);

  useEffect(() => {
    const fetch = async () => {
      if (networkInfo?.addresses.veNomos) {
        try {
          const c = await getErc20Contract(networkInfo.addresses.Nomos);
          if (c) {
            const decimals = await c.decimals();
            setNomoDecimals(decimals);
            setNomoErc20Contract(c);
            if (account) {
              const balance = await c.balanceOf(account);
              setNomoBalance(pow10(+balance, decimals));
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetch();
  }, [networkInfo, account]);

  const handleLock = async (): Promise<void> => {
    if (nomoErc20Contract && veNomosContract && account && networkInfo && locked) {
      setLockLoading(true);
      try {
        const allowance = await nomoErc20Contract.allowance(account, networkInfo.addresses.veNomos);
        if (!+allowance) {
          const approve = await nomoErc20Contract.approve(
            networkInfo.addresses.veNomos,
            ethers.constants.MaxUint256
          );
          await approve.wait();
        }
        const num = original(lockNum, nomoDecimals).toString();
        if (+locked.amount) {
          LockDialogRef.current?.show({
            lock: Number(lockNum),
            maxTime: +maxTime,
            end: new BigNumber(+locked.end - dayjs().unix())
              .dividedBy(365 * 24 * 60 * 60)
              .toFixed(2),
          });
        } else {
          const res = await veNomosContract.create_lock(num, +maxTime);
          await res.wait();
        }
      } catch (error) {
        console.log(error);
      }
      setLockLoading(false);
    }
  };

  return (
    <Layout className="page-dao">
      <div className="block infoBlock">
        <div className="blockTitle">
          <strong>{t('dao.NOMOLockeds')}</strong>
          <i>你可以质押NOMO来保护协议的安全，同时获得NOMO奖励。</i>
        </div>
        <div className="main">
          <div className="left">
            <div className="item">
              <div className="text">{t('dao.NOMOLockeds')}</div>
              <div className="number">
                {supply ? formatMoney(pow10(+supply, nomoDecimals)) : '0.00'}
              </div>
            </div>
            <div className="item">
              <div className="text">{t('dao.totalVeNOMO')}</div>
              <div className="number">
                {totalSupply ? formatMoney(pow10(+totalSupply, veNomoDecimals)) : '0.00'}
              </div>
            </div>
            <div className="item">
              <div className="text">{t('dao.lock-upTerm')}</div>
              <div className="number">
                {totalSupply && supply && maxTime && +totalSupply && +supply && +maxTime
                  ? totalSupply.dividedBy(supply.multipliedBy(maxTime)).toString()
                  : '0'}
                年
              </div>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <div className="text">{t('dao.NOMOPayouts')}</div>
              <div className="number">{rewardRate?.multipliedBy(60 * 60 * 24).toFixed(2)}</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.apy')}</div>
              <div className="number">
                {supply && rewardRate && +supply && +rewardRate
                  ? `${rewardRate.dividedBy(supply.multipliedBy(365 * 24 * 60 * 60)).toFixed(2)}%`
                  : '0.00%'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block infoBlock myBlock">
        <div className="blockTitle">
          <strong>{t('dao.myStats')}</strong>
          <Button
            className="btn"
            onClick={() =>
              ClaimDialogRef.current?.show({
                claim: userEpochReward ? Number(pow10(+userEpochReward, nomoDecimals)) : 0,
              })
            }
          >
            {t('dao.claim')}
          </Button>
        </div>
        <div className="main">
          <div className="left">
            <div className="item">
              <div className="text">{t('dao.NOMOLocked')}</div>
              <div className="number">
                {locked ? formatMoney(pow10(+locked.amount, nomoDecimals)) : 0}
              </div>
            </div>
            <div className="item">
              <div className="text">{t('dao.myVeNOMO')}</div>
              <div className="number">
                {veNomosBalanceOf ? formatMoney(pow10(+veNomosBalanceOf, veNomoDecimals)) : '0.00'}
              </div>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <div className="text">{t('dao.boost')}</div>
              <div className="number">
                {totalSupply && veNomosBalanceOf && +totalSupply && +veNomosBalanceOf
                  ? `${veNomosBalanceOf.dividedBy(totalSupply).toFixed(2)} x`
                  : '0.00 x'}
              </div>
            </div>
            <div className="item">
              <div className="text">{t('dao.timeToRelease')}</div>
              <div className="number">
                {locked
                  ? new BigNumber(+locked.end - dayjs().unix())
                      .dividedBy(365 * 24 * 60 * 60)
                      .toFixed(2)
                  : '--'}{' '}
                年
              </div>
            </div>
            <div className="item">
              <div className="text">{t('dao.claimableNOMO')}</div>
              <div className="number">
                {userEpochReward ? formatMoney(pow10(+userEpochReward, nomoDecimals)) : '0.00'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block voteBlock">
        <div className="blockTitle">
          <strong>{t('dao.lock-upVoting')}</strong>
          <em>{t('dao.lock-upVotingText')}</em>
        </div>
        <div className="main">
          <div className="box">
            <div className="wrap">
              <div className="balance">
                <span className="balanceLabel">{t('dao.walletBalance')}</span>
                <i className="balanceNumber">{formatMoney(nomoBalance)} NOMO</i>
              </div>
              <div className={classnames('input', { error: !!lockNum })}>
                <div className="max" onClick={() => setLockNum(filterInput(nomoBalance))}>
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder="请输入金额"
                  value={lockNum}
                  onChange={(event) => {
                    setLockNum(filterInput(event.target.value));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="footer">
            {FooterText(lockNum, maxTime, maxTime, veNomosBalanceOf, totalSupply)}
            <Button
              disabled={!Number(lockNum) || Number(lockNum) > Number(nomoBalance)}
              className="btn"
              onClick={() => handleLock()}
              loading={lockLoading}
            >
              {t('dao.submit')}
            </Button>
          </div>
        </div>
      </div>
      <Claim ref={ClaimDialogRef} />
      <Lock ref={LockDialogRef} />
    </Layout>
  );
}
