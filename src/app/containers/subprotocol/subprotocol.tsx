import './subprotocol.stylus';
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
import { Trans, useTranslation } from 'react-i18next';

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);
  const [t] = useTranslation();

  return (
    <Layout className="page-protocol">
      <div className="block myBlock">
        <div className="info">
          <div className="mySubProtocol">
            <div className="title">我的子协议</div>
            <div className="txt">Nomos1348972831</div>
          </div>
          <div className="earnings">
            <div className="title">收益</div>
            <div className="txt">$34,163.00</div>
            <div className="num">（≈100.00 NOMO）</div>
          </div>
        </div>
        <div className="btn">链接钱包</div>
        {/* 创建子协议 领取 */}
      </div>
      <div className="block ruleBlock">
        <div className="blockTitle">{t('subprotocol.rules')}</div>
        <div className="main">
          <table>
            <tbody>
              <tr>
                <td
                  colSpan={2}
                  className="minor"
                  dangerouslySetInnerHTML={{ __html: t('subprotocol.rulesText') }}
                ></td>
              </tr>
              <tr>
                <td>{t('subprotocol.subprotocolOwner')}</td>
                <td>{t('subprotocol.subprotocolOwnerText')}</td>
              </tr>
              <tr>
                <td className="minor">{t('subprotocol.beginner')}</td>
                <td>{t('subprotocol.beginnerText')}</td>
              </tr>
              <tr>
                <td className="minor">{t('subprotocol.pro')}</td>
                <td>
                  <Trans
                    i18nKey="subprotocol.proText"
                    values={{ number: '15%' }}
                    components={{
                      span: <span />,
                      div: <div onClick={() => alert('calculationRules')} />,
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>{t('subprotocol.subprotocolUsers')}</td>
                <td>{t('subprotocol.subprotocolUsersText')}</td>
              </tr>
              <tr>
                <td className="minor">{t('subprotocol.depositors', { number: '15%' })}</td>
                <td dangerouslySetInnerHTML={{ __html: t('subprotocol.depositorsText') }}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="block recordBlock">
        <div className="blockTitle">{t('subprotocol.rewardHistory')}</div>
        <div className="main">
          <div className="wrap">
            <div className="title">{t('subprotocol.mySubprotocol')}</div>
            <table>
              <thead>
                <tr>
                  <th>{t('subprotocol.userAddress')}</th>
                  <th>{t('subprotocol.totalDeposited')}</th>
                  <th>{t('subprotocol.totalRewards')}</th>
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
            <div className="title">{t('subprotocol.subprotocolsIUse')}</div>
            <table>
              <thead>
                <tr>
                  <th>{t('subprotocol.userAddress')}</th>
                  <th>{t('subprotocol.totalDeposited')}</th>
                  <th>{t('subprotocol.totalRewards')}</th>
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
