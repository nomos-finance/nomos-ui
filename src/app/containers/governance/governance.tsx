import './governance.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button, Form, Select } from 'antd';
import { Link, useHistory } from 'react-router-dom';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';

const { Option } = Select;

const compare = (support: number, oppose: number) => {
  return (
    <div className="compare">
      <div className="txt">
        <div>支持</div>
        <Icon name="vs" />
        <div>反对</div>
      </div>
      <div className="bar">
        <div style={{ width: `${(oppose / (support + oppose)) * 100}%` }}></div>
      </div>
      <div className="num">
        <div>{support}</div>
        <div>{oppose}</div>
      </div>
    </div>
  );
};

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);
  const [tab, setTab] = useState('create');
  const [form] = Form.useForm();
  const submit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  const history = useHistory();

  return (
    <Layout className="page-voting">
      <div className="block">
        <div className="header">
          <div className="tab">
            <div
              className={classnames('item', { cur: tab === 'all' })}
              onClick={() => setTab('all')}
            >
              全部
            </div>
            <div
              className={classnames('item', { cur: tab === 'rule' })}
              onClick={() => setTab('rule')}
            >
              治理规则
            </div>
            <div
              className={classnames('item', { cur: tab === 'create' })}
              onClick={() => setTab('create')}
            >
              创建提案
            </div>
            <div className={classnames('item', { cur: tab === 'my' })} onClick={() => setTab('my')}>
              我的治理
            </div>
          </div>
          <div className="link">去DAO&Safty锁仓NOMO获得投票&gt;</div>
        </div>
        {tab === 'all' ? (
          <div className="tabMain all">
            <div className="item" onClick={() => history.push(`governance/detail/1212`)}>
              <div className="left">
                <div className="title">提案号：0001关于XXXX的提案</div>
                <div className="text">
                  <div className={classnames('status', `status${1}`)}>投票中</div>
                  <div className="time">还剩1天3小时1分</div>
                  <div className="type">普通提案</div>
                </div>
              </div>
              {compare(1000, 2000)}
            </div>
            <div className="item">
              <div className="left">
                <div className="title">提案号：0001关于XXXX的提案</div>
                <div className="text">
                  <div className={classnames('status', `status${2}`)}>待执行</div>
                  <div className="time">还剩1天3小时1分</div>
                  <div className="type">普通提案</div>
                </div>
              </div>
              {compare(1000, 2000)}
            </div>
            <div className="item">
              <div className="left">
                <div className="title">提案号：0001关于XXXX的提案</div>
                <div className="text">
                  <div className={classnames('status', `status${3}`)}>已执行</div>
                  <div className="time">还剩1天3小时1分</div>
                  <div className="type">普通提案</div>
                </div>
              </div>
              {compare(1000, 2000)}
            </div>
            <div className="item">
              <div className="left">
                <div className="title">提案号：0001关于XXXX的提案</div>
                <div className="text">
                  <div className={classnames('status', `status${4}`)}>已失败</div>
                  <div className="time">还剩1天3小时1分</div>
                  <div className="type">普通提案</div>
                </div>
              </div>
              {compare(1000, 2000)}
            </div>
            <div className="item">
              <div className="left">
                <div className="title">提案号：0001关于XXXX的提案</div>
                <div className="text">
                  <div className={classnames('status', `status${5}`)}>已取消</div>
                  <div className="time">还剩1天3小时1分</div>
                  <div className="type">普通提案</div>
                </div>
              </div>
              {compare(1000, 2000)}
            </div>
          </div>
        ) : null}
        {tab === 'rule' ? <div>xx</div> : null}
        {tab === 'create' ? (
          <div className="tabMain create">
            <div className="form">
              <Form form={form} scrollToFirstError>
                <div className="formTitle">创建提案</div>
                <Form.Item
                  label="提案类型"
                  name="address"
                  rules={[{ required: true, message: 'Please input your address!' }]}
                >
                  <div className="input">
                    <Select
                      defaultValue="lucy"
                      bordered={false}
                      dropdownClassName={classnames('customSelect', currentThemeName)}
                    >
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  </div>
                </Form.Item>
                <Form.Item
                  name="email"
                  label="提案标题"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'Please input your E-mail!',
                    },
                  ]}
                >
                  <div className="input">
                    <Input placeholder="请输入" bordered={false} />
                  </div>
                </Form.Item>
                <Form.Item
                  name="code"
                  label="提案内容"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your code!',
                    },
                  ]}
                >
                  <div className="input">
                    <Input.TextArea placeholder="请输入" bordered={false} />
                  </div>
                </Form.Item>
                <Form.Item label="&nbsp;&nbsp;">
                  <div className="box">
                    <div className="wrap">
                      <div className="balance">
                        <span className="balanceLabel">我的veNOMO</span>
                        <i className="balanceNumber">xx</i>
                      </div>
                      <div
                        className={classnames('input2', { error: !!`depositValidationMessage` })}
                      >
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
                </Form.Item>
                <Form.Item>
                  <Button className="btn" onClick={() => submit()}>
                    提交
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        ) : null}
        {tab === 'my' ? (
          <div className="tabMain my">
            <div className="content">
              <div className="boxTitle">委托投票</div>
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
                  <div className="entrust">
                    <span className="entrustLabel">委托给地址</span>
                    <Input bordered={false} placeholder="Enter ETH address" />
                  </div>
                </div>
              </div>
            </div>
            <div className="content">
              <div className="boxTitle">我的历史治理信息</div>
              <div className="table">
                <div className="tableTab">
                  <div className="item cur">投票</div>
                  <div className="item">创建</div>
                  <div className="item">委托</div>
                </div>
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
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}
