import './position.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button, Form } from 'antd';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);
  const [form] = Form.useForm();
  const submit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Success:', values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <Layout className="page-position">
      <div className="block">
        <div className="blockTitle">仓位管理</div>
        <div className="blockText">
          Nomos协议中用户资产受到市场涨跌的密切影响，因此将提供消息推送功能。推送内容包括仓位安全状态，协议重大公告等。用户可以选择是否使用，需要的用户只需在下方提交邮箱和钱包地址即可。
        </div>
        <div className="form">
          <Form form={form} scrollToFirstError>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please input your address!' }]}
            >
              <div className="input">
                <Input placeholder="请输入" bordered={false} />
              </div>
            </Form.Item>
            <Form.Item
              name="email"
              label="E-mail"
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
              label="Code"
              rules={[
                {
                  required: true,
                  message: 'Please input your code!',
                },
              ]}
            >
              <div className="input">
                <Input placeholder="请输入" bordered={false} />
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
    </Layout>
  );
}
