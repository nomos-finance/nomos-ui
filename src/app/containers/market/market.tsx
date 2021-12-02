import './market.stylus';
import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { valueToBigNumber, normalize, ComputedReserveData } from '@aave/protocol-js';
import { useThemeContext } from '../../theme';
import { Input, Button, Form, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';

import Icon from '../../../assets/icons';
import Layout from '../../components/Layout';

import { useSelector } from 'react-redux';
import { IRootState } from '../../reducers/RootState';
import { formatMoney } from 'app/utils/tool';
import useProtocolDataWithRpc from 'app/hooks/usePoolData';
import SymbolIcon from '../../components/SymbolIcon';

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
  const { data, refresh } = useProtocolDataWithRpc();
  const [sortedData, setSortedData] = useState<any[]>([]);

  const columns: Array<ColumnProps<any>> = [
    {
      title: 'Market',
      key: 'id',
      sorter: (a, b): any => {
        return a.currencySymbol > b.currencySymbol;
      },
      sortDirections: ['ascend', 'descend'],
      render: (item) => {
        return (
          <div className="asset">
            <SymbolIcon symbol={item.currencySymbol} />
            <span>{item.currencySymbol}</span>
          </div>
        );
      },
    },
    {
      title: 'Total Supply',
      sorter: (a, b) => a.age - b.age,
      render: (item) => {
        return <div>{item.name}</div>;
      },
    },
    {
      title: 'Supply APY',
      sorter: true,
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
      sorter: true,
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Borrow APR',
      sorter: true,
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

  useEffect(() => {
    if (data) {
      const marketRefPriceInUsd = normalize(data.usdPriceEth, 18);
      let totalLockedInUsd = valueToBigNumber('0');
      let sortedData = data.reserves
        .filter((res) => res.isActive)
        .map((reserve) => {
          totalLockedInUsd = totalLockedInUsd.plus(
            valueToBigNumber(reserve.totalLiquidity)
              .multipliedBy(reserve.price.priceInEth)
              .dividedBy(marketRefPriceInUsd)
          );

          const totalLiquidity = Number(reserve.totalLiquidity);
          const totalLiquidityInUSD = valueToBigNumber(reserve.totalLiquidity)
            .multipliedBy(reserve.price.priceInEth)
            .dividedBy(marketRefPriceInUsd)
            .toNumber();

          const totalBorrows = Number(reserve.totalDebt);
          const totalBorrowsInUSD = valueToBigNumber(reserve.totalDebt)
            .multipliedBy(reserve.price.priceInEth)
            .dividedBy(marketRefPriceInUsd)
            .toNumber();

          return {
            reserve,
            totalLiquidity,
            totalLiquidityInUSD,
            totalBorrows: reserve.borrowingEnabled ? totalBorrows : -1,
            totalBorrowsInUSD: reserve.borrowingEnabled ? totalBorrowsInUSD : -1,
            id: reserve.id,
            underlyingAsset: reserve.underlyingAsset,
            currencySymbol: reserve.symbol,
            depositAPY: reserve.borrowingEnabled ? Number(reserve.liquidityRate) : -1,
            avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
            stableBorrowRate:
              reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
                ? Number(reserve.stableBorrowRate)
                : -1,
            variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowRate) : -1,
            avg30DaysVariableRate: Number(reserve.avg30DaysVariableBorrowRate),
            borrowingEnabled: reserve.borrowingEnabled,
            stableBorrowRateEnabled: reserve.stableBorrowRateEnabled,
            isFreezed: reserve.isFrozen,
            aIncentivesAPY: reserve.aIncentivesAPY,
            vIncentivesAPY: reserve.vIncentivesAPY,
            sIncentivesAPY: reserve.sIncentivesAPY,
          };
        });

      setSortedData(sortedData);
    }

    return () => {
      setSortedData([]);
    };
  }, [data]);

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
        <Table
          dataSource={sortedData}
          columns={columns}
          pagination={false}
          rowKey={(key) => {
            return key.id;
          }}
        />
      </div>
    </Layout>
  );
}
