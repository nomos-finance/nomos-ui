import './data.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, BigNumber } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button, Form, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';

const progress = (name: string, num: number) => (
  <div className="progress">
    <div className="progressText">
      <div>{name}</div>
      <div>{num}%</div>
    </div>
    <div className="progressBar">
      <div style={{ width: `${num}%` }}></div>
    </div>
  </div>
);

export default function Markets() {
  const { currentThemeName } = useThemeContext();
  const { account } = useSelector((store: IRootState) => store.base);

  const dataSource = [
    {
      key: '1',
      name: '3',
      age: 32,
      address: '2',
    },
    {
      key: '2',
      name: '1',
      age: 42,
      address: '3',
    },
  ];

  const columns: Array<ColumnProps<{ name: string }>> = [
    {
      title: 'Market',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Total Supply',
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: 'Supply APY',
      render: (item) => {
        return (
          <div>
            <div>{item.name}</div>
            <div>Max reward 2.20%</div>
          </div>
        );
      },
    },
    {
      title: 'Total Borrow',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Borrow APR',
      render: (item) => {
        return (
          <div>
            <div>{item.name}</div>
            <div>Max reward 2.20%</div>
          </div>
        );
      },
    },
  ];

  return (
    <Layout className="page-data">
      <div className="block ranking">
        <div className="proportion">
          <div className="proportionItem">
            <div className="header">
              <div className="text">Total Supply</div>
              <div className="number">$34,163.00</div>
            </div>
            <div className="main">
              <div className="title">Top 3 markets</div>
              <div className="item">{progress('BTC', 20)}</div>
              <div className="item">{progress('BTC', 30)}</div>
              <div className="item">{progress('BTC', 40)}</div>
            </div>
          </div>
          <div className="proportionItem">
            <div className="header">
              <div className="text">Total Borrow</div>
              <div className="number">$34,163.00</div>
            </div>
            <div className="main">
              <div className="title">Top 3 markets</div>
              <div className="item">{progress('BTC', 20)}</div>
              <div className="item">{progress('BTC', 40)}</div>
              <div className="item">{progress('BTC', 21.5)}</div>
            </div>
          </div>
        </div>
        <div className="totalBox">
          <div className="item">
            <div className="text">Total veNOMO</div>
            <div className="number">36,089,587.22</div>
          </div>
          <div className="item">
            <div className="text">Average Lock Time</div>
            <div className="number">36,089,587.22</div>
          </div>
          <div className="item">
            <div className="text">Average Boost</div>
            <div className="number rockets">36,089,587.22</div>
          </div>
        </div>
      </div>
      <div className="block marketBlock">
        <div className="blockTitle">ALL Markets</div>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </div>
    </Layout>
  );
}
