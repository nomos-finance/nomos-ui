import './dao.stylus';
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
    <Layout className="page-dao">
      <div className="block infoBlock">
        <div className="blockTitle">
          <strong>NOMO锁仓总量</strong>
          <i>你可以质押NOMO来保护协议的安全，同时获得NOMO奖励。</i>
        </div>
        <div className="main">
          <div className="left">
            <div className="item">
              <div className="text">NOMO锁仓总量</div>
              <div className="number">{formatMoney(11111)}</div>
            </div>
            <div className="item">
              <div className="text">veNOMO总量</div>
              <div className="number">1212</div>
            </div>
            <div className="item">
              <div className="text">平均锁仓时间</div>
              <div className="number">1212</div>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <div className="text">每天奖励释放NOMO量</div>
              <div className="number">1212</div>
            </div>
            <div className="item">
              <div className="text">锁仓年收益</div>
              <div className="number">121212</div>
            </div>
          </div>
        </div>
      </div>
      <div className="block infoBlock myBlock">
        <div className="blockTitle">
          <strong>我的锁仓情况</strong>
          <Button className="btn">领取</Button>
        </div>
        <div className="main">
          <div className="left">
            <div className="item">
              <div className="text">我的NOMO锁仓量</div>
              <div className="number">{formatMoney(11111)}</div>
            </div>
            <div className="item">
              <div className="text">我的veNOMO</div>
              <div className="number">121212</div>
            </div>
          </div>
          <div className="right">
            <div className="item">
              <div className="text">收益加成</div>
              <div className="number">1212</div>
            </div>
            <div className="item">
              <div className="text">待解锁时间</div>
              <div className="number">121212</div>
            </div>
            <div className="item">
              <div className="text">可领取NOMO</div>
              <div className="number">121212</div>
            </div>
          </div>
        </div>
      </div>
      <div className="block voteBlock">
        <div className="blockTitle">
          <strong>锁仓货的投票</strong>
          <em>注：从第一次锁仓开始，最长锁仓时间为5年</em>
        </div>
        <div className="main">
          <div className="box">
            <div className="wrap">
              <div className="balance">
                <span className="balanceLabel">我的veNOMO</span>
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
          </div>
          <div className="footer">
            <div className="text">
              <div>
                预计获得票数：<strong>121212</strong>
              </div>
              <div>
                预计获得收益加成：<strong>1212%</strong>
              </div>
            </div>
            <Button className="btn">提交</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
