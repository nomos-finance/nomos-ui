import './voting.stylus';
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
    <Layout className="page-voting">
      <div className="block">
        <div>全部</div>
        <div>治理规则</div>
        <div>创建提案</div>
        <div>我的治理</div>
        <div>去DAO&Safty锁仓NOMO获得投票</div>
        <div>委托投票</div>
        <div>我的veNOMO</div>
        <div>委托给地址</div>
      </div>
      <div className="block">
        <div>我的历史治理信息</div>
        <div>投票</div>
        <div>创建</div>
        <div>委托</div>
        <table>
          <thead>
            <tr>
              <th>用户地址</th>
              <th>日期</th>
              <th>提案号</th>
              <th>投票方向</th>
              <th>投票数</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1212</td>
              <td>1212</td>
              <td>1212</td>
              <td>1212</td>
              <td>1212</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
