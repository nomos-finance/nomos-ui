import './dao.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button } from 'antd';
import { Trans, useTranslation } from 'react-i18next';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';
import useVotingEscrowRewardContract from 'app/hooks/useVotingEscrowRewardContract';
import useVeNomos from 'app/hooks/useVeNomos';

interface IData {
  supply: number;
  totalSupply: number;
  maxTime: number;
  veNomoBalanceOf?: number;
}

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);
  const [t] = useTranslation();
  const [votingEscrowRewardContrac, freshVotingEscrowRewardContrac] =
    useVotingEscrowRewardContract();
  const [veNomosContract, freshVeNomosContract] = useVeNomos();
  const [veNomosBalanceOf, setVeNomosBalanceOf] = useState<number>();
  const [data, setData] = useState<IData>();

  const fetchData = async () => {
    if (!votingEscrowRewardContrac) return;
    const rewardRate = await votingEscrowRewardContrac.rewardRate();
    console.log(rewardRate);
  };

  useEffect(() => {
    fetchData();
  }, [votingEscrowRewardContrac]);

  const fetchVeNomosData = async () => {
    if (!veNomosContract) return;
    const supply = await veNomosContract.supply();
    const totalSupply = await veNomosContract.totalSupply();
    const MAXTIME = await veNomosContract.MAXTIME();
    if (account) {
      const balanceOf = await veNomosContract.balanceOf(account);
      setVeNomosBalanceOf(+balanceOf);
    }

    console.log(MAXTIME.toString());
  };

  useEffect(() => {
    fetchVeNomosData();
  }, [veNomosContract, account]);

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
              <div className="number">{formatMoney(11111)}</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.totalVeNOMO')}</div>
              <div className="number">1212</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.lock-upTerm')}</div>
              <div className="number">totalSupply / supply * maxtime</div>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <div className="text">{t('dao.NOMOPayouts')}</div>
              <div className="number">rewardRate * 60 * 60 * 24</div>
            </div>
            <div className="item">
              <div className="text">{t('dao.apy')}</div>
              <div className="number">rewardRate() * 365 *24 * 60 * 60</div>
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
                <span className="balanceLabel">{t('dao.myVeNOMO')}</span>
                <i className="balanceNumber">0</i>
              </div>
              <div className={classnames('input', { error: !!`depositValidationMessage` })}>
                <div className="max" onClick={() => `setDepositAmount(veNomosBalanceOf)`}>
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder="请输入金额"
                  // value={depositAmount}
                  onChange={(event) => {
                    //   handleDepositAmountChange(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="text">
              <div>
                {t('dao.estimatedVeNOMO')}：<strong>121212</strong>
              </div>
              <div>
                {t('dao.estimatedBoost')}：<strong>1212%</strong>
              </div>
            </div>
            <Button className="btn">{t('dao.submit')}</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
