import './staking.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button } from 'antd';
import { useTranslation } from 'react-i18next';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);
  const [t] = useTranslation();

  return (
    <Layout className="page-staking">
      <div className="block infoBlock">
        <div className="header">
          <div className="blockTitle">Staking</div>
          <div className="right">
            <div className="notice">*{t('staking.stakingText')}</div>
            <div className="btn">{t('staking.claim')}</div>
          </div>
        </div>
        <div className="main">
          <div className="item">
            <Icon name="deposit" />
            <div className="text">{t('staking.totalValueStaked')}</div>
            <div className="number">1212</div>
          </div>
          <div className="item">
            <Icon name="rate" />
            <div className="text">{t('staking.APR')}</div>
            <div className="number">12%</div>
          </div>
          <div className="item">
            <Icon name="loan" />
            <div className="text">{t('staking.myStaking')}</div>
            <div className="number">121</div>
          </div>
          <div className="item">
            <Icon name="reward" />
            <div className="text">{t('staking.claimable')}</div>
            <div className="number">1212</div>
          </div>
        </div>
      </div>
      <div className="operation">
        <div className="block">
          <div className="blockTitle">质押</div>
          <div className="box">
            <div className="balance">
              <span className="balanceLabel">钱包余额</span>
              <i className="balanceNumber">xx</i>
            </div>
            <div className={classnames('input', { error: !!`depositValidationMessage` })}>
              <div
                className="max"
                onClick={() => `setDepositAmount(Number(pow10(params?.balance)))`}
              >
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
          <div className="btnWrap">
            <div className="btn">{t('staking.submit')}</div>
          </div>
        </div>
        <div className="block">
          <div className="blockTitle">赎回</div>
          <div className="box">
            <div className="balance">
              <span className="balanceLabel">{t('staking.redeemable')}</span>
              <i className="balanceNumber">xx</i>
            </div>
            <div className={classnames('input', { error: !!`depositValidationMessage` })}>
              <div
                className="max"
                onClick={() => `setDepositAmount(Number(pow10(params?.balance)))`}
              >
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
          <div className="btnWrap">
            <div className="btn">{t('staking.submit')}</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
