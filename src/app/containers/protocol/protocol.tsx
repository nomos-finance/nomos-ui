import './protocol.stylus';
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
    <Layout className="page-protocol">
      <div className="block ruleBlock">
        <div className="blockTitle">规则说明</div>
        <div className="main">
          <table>
            <tbody>
              <tr>
                <td colSpan={2} className="minor">
                  Nomos协议作为基础设施对所有人开放，可以无门槛创建自己的借贷协议，该协议为Nomos的子协议。
                  创建后会获得专属NFT及ID。NFT代表子协议的所有权，获得其产生的息差收益，因此不要轻易转让给他人；需要使用子协议的用户填写ID就可进入子协议中，开始借贷之旅。
                </td>
              </tr>
              <tr>
                <td>子协议所有者</td>
                <td>
                  获得子协议产生的息差收益，不同类型的所有者获得收益比例不同，收益以NOMO发放。
                </td>
              </tr>
              <tr>
                <td className="minor">初级子协议所有者</td>
                <td>无门槛；获得子协议所产生息差收益的5%</td>
              </tr>
              <tr>
                <td className="minor">高级子协议所有者</td>
                <td>
                  奖励与存入DAO池的NOMO相关，存入NOMO越多、时间越久，可获得的收益加成越多。最多可获得初级子协议所有者收益的3倍加成，即获得该子协议所产生收益的
                  <span>5%</span>
                  <div>了解详细计算规则，点击此处 &gt;</div>
                </td>
              </tr>
              <tr>
                <td>子协议用户</td>
                <td>
                  当前只对存款用户给予奖励，下阶段子协议所有者可以自定义分别给予存贷用户的奖励力度。收益以NOMO发放。
                </td>
              </tr>
              <tr>
                <td className="minor">子协议存款用户</td>
                <td>
                  获得使用的子协议所产生息差收益的<span>5%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="block recordBlock">
        <div className="blockTitle">收益记录</div>
        <div className="main">
          <div className="wrap">
            <div className="title">我的子协议</div>
            <table>
              <thead>
                <tr>
                  <th>用户地址</th>
                  <th>总存款</th>
                  <th>累计收益</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>111</td>
                  <td>111</td>
                  <td>111</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="wrap">
            <div className="title">我使用的子协议</div>
            <table>
              <thead>
                <tr>
                  <th>用户地址</th>
                  <th>总存款</th>
                  <th>累计收益</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>111</td>
                  <td>111</td>
                  <td>111</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
