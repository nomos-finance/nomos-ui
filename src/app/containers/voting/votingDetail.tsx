import './votingDetail.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button } from 'antd';
import { Link, useHistory } from 'react-router-dom';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);
  const [tab, setTab] = useState('all');
  const history = useHistory();

  return (
    <Layout className="page-votingDetail">
      <div className="back">
        <em onClick={() => history.go(-1)}>
          <Icon name="back" />
          <span>返回</span>
        </em>
      </div>
      <div className="block votingBlock">
        <div className="blockTitle">
          提案标题提案标题提案标题提案标题提案标题提案标题提案标题提案标题
        </div>
        <div className="baseInfo">
          <div className="left">
            <span className={classnames('status', 'status1')}>投票中</span>
            <span className="time">还剩1天3小时1分</span>
            <span className="type">普通提案</span>
          </div>
          <div className="right">
            <div className="response">已投票（赞成）</div>
            <div className="number">10.00veNOMO</div>
          </div>
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
              <div className="voting">
                <div className="votingLabel">选择</div>
                <div className="votingBtn">
                  <div className="agree">赞成</div>
                  <div className="oppose">反对</div>
                </div>
              </div>
            </div>
          </div>
          <div className="btnWrap">
            <div className="btn">提交</div>
          </div>
        </div>
      </div>
      <div className="block proportionBlock">
        <div className="header">
          <div>
            <span>
              * 法定票数100.00veNOMO
              <Icon name="correct" />
            </span>
          </div>
          <div>
            <span>
              法定赞成票占比 75%
              <Icon name="correct" />
            </span>
          </div>
        </div>
        <div className="main">
          <div className="left">
            <div className="process">
              <div className="txt">
                <div>赞成</div>
                <div>120120veNomo</div>
              </div>
              <div className="bar">
                <div style={{ width: '20%' }}></div>
              </div>
            </div>
            <div className="wrap">
              <div className="itemHeader">
                <div>地址</div>
                <div>投票</div>
              </div>
              <div className="item">
                <div>xxx</div>
                <div>121212</div>
              </div>
              <div className="item">
                <div>xxx</div>
                <div>121212</div>
              </div>
              <div className="item">
                <div>xxx</div>
                <div>121212</div>
              </div>
            </div>
            <div className="btnWrap">
              <div className="btn">查看更多</div>
            </div>
          </div>
          <div className="right">
            <div className="process">
              <div className="txt">
                <div>赞成</div>
                <div>120120veNomo</div>
              </div>
              <div className="bar">
                <div style={{ width: '20%' }}></div>
              </div>
            </div>
            <div className="wrap">
              <div className="itemHeader">
                <div>地址</div>
                <div>投票</div>
              </div>
              <div className="item">
                <div>xxx</div>
                <div>121212</div>
              </div>
              <div className="item">
                <div>xxx</div>
                <div>121212</div>
              </div>
              <div className="item">
                <div>xxx</div>
                <div>121212</div>
              </div>
            </div>
            <div className="btnWrap">
              <div className="btn">查看更多</div>
            </div>
          </div>
        </div>
      </div>
      <div className="block contentBlock">
        <div className="blockTitle">提案内容</div>
        <div className="main">
          Summary A proposal to take precautionary measures by temporarily disabling borrow for
          xSUSHI and DeFi Pulse Index (DPI), and freezing deposits, borrows, and rate swaps for
          UNI/BAL AMM Markets. Implementation The proposal sets the LTV and liquidation threshold
          ratios by calling disableBorrowingOnReserve on the Aave: Lending Pool Configurator V2
          contract at 0x311Bb771e4F8952E6Da169b425E7e92d6Ac45756, for xSUSHI at
          0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272 and DPI at
          0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b The proposal calls freezeReserve on the
          LendingPoolConfigurator contract at 0x23A875eDe3F1030138701683e42E9b16A7F87768 for all UNI
          and BPT AMM Markets at the addresses listed in the docs. Copyright Copyright and related
          rights waived via CC0. Special Thanks Mudit Gupta, flashfish, Nipun, Emilio, Lasse
          Herskind, Gasper, Ernesto, Andrey, 0xMaki, Zer0dot, Stani, Ernesto, and numerous others on
          the Gauntlet team for assistance and review of this proposal.
        </div>
      </div>
      <div className="block commentBlock">
        <div className="blockTitle">发表评论</div>
        <div className="commentWrap">
          <div className="form">
            <div className="avatar"></div>
            <Input.TextArea></Input.TextArea>
          </div>
          <div className="comment">
            <div className="btn">评论</div>
          </div>
        </div>
        <div className="blockTitle">评论列表（2342条）</div>
        <div className="list">
          <div className="item">
            <div className="avatar"></div>
            <div className="content">
              <div className="name">xxxxx</div>
              <div className="text">xxxxx</div>
              <div className="foot">
                <div className="time">1小时前</div>
                <div className="support">
                  <Icon name="support" />
                  <span>点赞</span>
                </div>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="avatar"></div>
            <div className="content">
              <div className="name">xxxxx</div>
              <div className="text">xxxxx</div>
              <div className="foot">
                <div className="time">1小时前</div>
                <div className="support">
                  <Icon name="support" />
                  <span>点赞</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="btnWrap">
          <div className="btn">查看更多</div>
        </div>
      </div>
    </Layout>
  );
}
