import './staking.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button } from 'antd';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);

  return (
    <Layout className="page-staking">
      <div className="block infoBlock">
        <div className="header">
          <div className="blockTitle">Staking</div>
          <div className="right">
            <div className="notice">
              *Staking NOMO获得NOMO奖励，质押后可在14天后赎回，奖励是实时领取
            </div>
            <div className="btn">领取奖励</div>
          </div>
        </div>
        <div className="main">
          <div className="item">
            <Icon name="deposit" />
            <div className="text">我的staking</div>
            <div className="number">1212</div>
          </div>
          <div className="item">
            <Icon name="loan" />
            <div className="text">veNOMO总量</div>
            <div className="number">1212</div>
          </div>
          <div className="item">
            <Icon name="rate" />
            <div className="text">APR</div>
            <div className="number">1212</div>
          </div>
          <div className="item">
            <Icon name="reward" />
            <div className="text">可领取奖励</div>
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
            <div className="btn">提交</div>
          </div>
        </div>
        <div className="block">
          <div className="blockTitle">赎回</div>
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
            <div className="btn">提交</div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
