import './notification.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';

export default function Markets() {
  const [t] = useTranslation();
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
        <div className="blockTitle">{t('notification.notification')}</div>
        <div className="blockText">{t('notification.text')}</div>
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
              label={t('notification.email')}
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
              label={t('notification.code')}
              rules={[
                {
                  required: true,
                  message: 'Please input your code!',
                },
              ]}
            >
              <div className="code">
                <div className="input">
                  <Input placeholder="请输入" bordered={false} />
                </div>
                <Button className="getCode">{t('notification.get')}</Button>
              </div>
            </Form.Item>
            <Form.Item>
              <Button className="btn" onClick={() => submit()}>
                {t('notification.submit')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Layout>
  );
}
