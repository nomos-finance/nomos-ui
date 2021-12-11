import './dao.stylus';
import { Contract } from 'ethers';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize } from '@aave/protocol-js';
import BigNumber from 'bignumber.js';
import { useThemeContext } from '../../theme';
import { Input, Button } from 'antd';
import { Trans, useTranslation } from 'react-i18next';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney, pow10 } from 'app/utils/tool';
import useVotingEscrowRewardContract from 'app/hooks/useVotingEscrowRewardContract';
import useVeNomos from 'app/hooks/useVeNomos';
import useNetworkInfo from 'app/hooks/useNetworkInfo';
import useErc20Contract from 'app/hooks/useErc20Contract';

export default function Markets() {
  const [t] = useTranslation();
  const { currentThemeName } = useThemeContext();
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);
  const [votingEscrowRewardContrac, freshVotingEscrowRewardContrac] =
    useVotingEscrowRewardContract();
  const [veNomosContract, freshVeNomosContract] = useVeNomos();
  const [, getErc20Contract] = useErc20Contract();
  const [nomoErc20Contract, setNomoErc20Contract] = useState<Contract>();
  const [veNomosBalanceOf, setVeNomosBalanceOf] = useState<number>();
  const [rewardRate, setRewardRate] = useState<BigNumber>();
  const [nomoBalance, setNomoBalance] = useState('0');
  const [lockNum, setLockNum] = useState<string>();
  const [supply, setSupply] = useState<BigNumber>();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [maxTime, setMaxTime] = useState<BigNumber>();

  const fetchData = async () => {
    if (!votingEscrowRewardContrac) return;
    const rewardRate = await votingEscrowRewardContrac.rewardRate();
    setRewardRate(new BigNumber(rewardRate.toString()));
  };

  useEffect(() => {
    fetchData();
  }, [votingEscrowRewardContrac]);

  const fetchVeNomosData = async () => {
    if (!veNomosContract) return;
    const supply = await veNomosContract.supply();
    const totalSupply = await veNomosContract.totalSupply();
    const MAXTIME = await veNomosContract.MAXTIME();
    setSupply(new BigNumber(supply.toString()));
    setTotalSupply(new BigNumber(totalSupply.toString()));
    setMaxTime(new BigNumber(MAXTIME.toString()));
    if (account) {
      const balanceOf = await veNomosContract.balanceOf(account);
      setVeNomosBalanceOf(+balanceOf);
    }
  };

  useEffect(() => {
    fetchVeNomosData();
  }, [veNomosContract, account]);

  useEffect(() => {
    const fetch = async () => {
      if (networkInfo?.addresses.veNomos && account) {
        const c = await getErc20Contract(networkInfo.addresses.Nomos);
        if (c) {
          const balance = await c.balanceOf(account);
          const decimals = await c.decimals();
          setNomoBalance(pow10(+balance, decimals));
          setNomoErc20Contract(c);
        }
      }
    };
    fetch();
  }, [networkInfo, account]);

  const lock = async (): Promise<void> => {
    if (nomoErc20Contract && account && networkInfo) {
      try {
        const res = await nomoErc20Contract.allowance(account, networkInfo.addresses.veNomos);
        if (+res < +Number(lockNum)) {
          const max = new BigNumber(0xffffffffffffffffffffffffffffffff).toFixed();
          console.log(nomoErc20Contract);
          nomoErc20Contract.approve(networkInfo.addresses.veNomos, max);
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
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
              <div className="number">{supply?.toFixed(2)}</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.totalVeNOMO')}</div>
              <div className="number">{totalSupply?.toFixed(2)}</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.lock-upTerm')}</div>
              <div className="number">
                $
                {totalSupply && supply && maxTime && +totalSupply && +supply && +maxTime
                  ? totalSupply.dividedBy(supply.multipliedBy(maxTime)).toFixed(2)
                  : '0.00'}
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
                  ? `${rewardRate
                      .dividedBy(supply.multipliedBy(365 * 24 * 60 * 60))
                      .multipliedBy(100)
                      .toFixed(2)}%`
                  : '0.00%'}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="block infoBlock myBlock">
        <div className="blockTitle">
          <strong>{t('dao.myStats')}</strong>
          <Button className="btn">{t('dao.claim')}</Button>
        </div>
        <div className="main">
          <div className="left">
            <div className="item">
              <div className="text">{t('dao.NOMOLocked')}</div>
              <div className="number">{formatMoney(11111)}</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.myVeNOMO')}</div>
              <div className="number">{veNomosBalanceOf}</div>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <div className="text">{t('dao.boost')}</div>
              <div className="number">1212</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.timeToRelease')}</div>
              <div className="number">121212</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.claimableNOMO')}</div>
              <div className="number">121212</div>
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
                <i className="balanceNumber">{nomoBalance} NOMO</i>
              </div>
              <div className={classnames('input', { error: !!lockNum })}>
                <div className="max" onClick={() => setLockNum(nomoBalance)}>
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder="请输入金额"
                  value={lockNum}
                  onChange={(event) => {
                    setLockNum(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="text">
              <div>
                {t('dao.estimatedVeNOMO')}: <strong>121212</strong>
              </div>
              <div>
                {t('dao.estimatedBoost')}: <strong>1212%</strong>
              </div>
            </div>
            <Button className="btn" onClick={() => lock()}>
              {t('dao.submit')}
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
