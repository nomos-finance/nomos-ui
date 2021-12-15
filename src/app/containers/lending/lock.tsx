import './lending.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import useVeNomos from 'app/hooks/useVeNomos';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney, pow10 } from 'app/utils/tool';
import useNetworkInfo from 'app/hooks/useNetworkInfo';
import useErc20Contract from 'app/hooks/useErc20Contract';

export default function Lock() {
  const history = useHistory();
  const [t] = useTranslation();
  const [veNomosContract, freshVeNomosContract] = useVeNomos();
  const [veNomosBalanceOf, setVeNomosBalanceOf] = useState<BigNumber>();
  const [veNomoDecimals, setVeNomoDecimals] = useState<number>(18);
  const [supply, setSupply] = useState<BigNumber>();
  const [totalSupply, setTotalSupply] = useState<BigNumber>();
  const [maxTime, setMaxTime] = useState<BigNumber>(new BigNumber(0));
  const [locked, setLocked] = useState<{ amount: BigNumber; end: BigNumber }>();
  const [nomoDecimals, setNomoDecimals] = useState<number>(18);
  const { account } = useSelector((store: IRootState) => store.base);
  const [networkInfo] = useNetworkInfo();
  const [, getErc20Contract] = useErc20Contract();

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
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetch();
  }, [networkInfo, account]);

  return (
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
          <span>{t('lending.nomoLocked')} </span>
          <i>{account ? (locked ? formatMoney(pow10(+locked.amount, nomoDecimals)) : 0) : '--'}</i>
        </div>
        <div className="item">
          <span>{t('lending.myBoost')} </span>
          <i>
            {account
              ? totalSupply && veNomosBalanceOf && +totalSupply && +veNomosBalanceOf
                ? `${veNomosBalanceOf.dividedBy(totalSupply).toFixed(2)} x`
                : '0.00 x'
              : '--'}
          </i>
        </div>
        <div className="btn" onClick={() => history.push('/dao')}>
          {t('lending.DAO&Safety')}
        </div>
      </div>
    </div>
  );
}
