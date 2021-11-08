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
      <div className="block descBlock">
        <div className="blockTitle">
          NOMO锁仓
          <span>
            你可以质押NOMO来保护协议的安全，同时获得NOMO奖励。<i>了解更多</i>
          </span>
        </div>
        <div>
          <table>
            <tr>
              <td>锁仓义务</td>
              <td>
                质押NOMO可以让协议在紧急情况下更加安全。发生坏账情况下，首先使用归属奖励的NOMO来弥补赤字，如果不够，则最高使用质押中30%的NOMO来继续弥补。
              </td>
            </tr>
            <tr>
              <td>锁仓权益</td>
              <td>
                <div>获得NOMO代币奖励</div>
                <div>获得所有市场的借贷挖矿加成</div>
                <div>创建子协议后，获得收益加成</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div className="block infoBlock">
        <div className="blockTitle">NOMO锁仓总量</div>
        <div>
          <div>NOMO锁仓总量</div>
          <div>veNOMO总量</div>
          <div>平均锁仓时间</div>
          <div>每天奖励释放NOMO量</div>
          <div>锁仓年收益</div>
        </div>
      </div>
      <div className="positionBlock">
        <div className="block myBlock">
          <div className="blockTitle">我的锁仓情况</div>
          <div>
            <div>我的NOMO锁仓量</div>
            <div>我的veNOMO</div>
            <div>收益加成</div>
            <div>可领取NOMO</div>
            <div>待解锁时间</div>
            <Button>领取</Button>
          </div>
        </div>
        <div className="block voteBlock">
          <div className="blockTitle">锁仓货的投票</div>
          <div>
            <div>注：从第一次锁仓开始，最长锁仓时间为5年</div>
            <div>预计获得票数：</div>
            <div className="block">
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
            <Button>提交</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
