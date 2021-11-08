/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React from 'react';
import * as echarts from 'echarts/core';
import ReactECharts from 'echarts-for-react';
import { useThemeContext } from '../../theme';

interface IChart {
  percentage: number | string;
  text?: string;
}
export default (props: IChart): React.ReactElement => {
  const { currentThemeName } = useThemeContext();

  const data = {
    name: '贷款',
    value: [props.percentage],
  };
  const option = {
    title: {
      text: data.value[0] + '%',
      textStyle: {
        color: '#FFC572',
        fontSize: 42,
      },
      itemGap: 20,
      left: 'center',
      top: 'center',
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, .9)',
      formatter: function (params: any) {
        return `<div>${props.text}</div>`;
        // return '<div style="text-align: center">贷款上限<br />' + params.value + '%</div>';
      },
    },
    angleAxis: {
      max: 100,
      show: false,
    },
    radiusAxis: {
      type: 'category',
      show: true,
      axisLabel: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    polar: [
      {
        center: ['50%', '50%'], //中心点位置
        radius: '100%', //图形大小
      },
    ],
    series: [
      {
        name: '',
        type: 'pie',
        startAngle: 0,
        radius: ['50%'],
        hoverAnimation: false,
        center: ['50%', '50%'],
        itemStyle: {
          color: 'rgba(66, 66, 66, .0)',
          borderWidth: 13,
          borderColor: currentThemeName === 'dark' ? '#353535' : '#F7F7F7',
        },
        data: [100],
        z: 1,
        animation: false,
      },
      {
        type: 'bar',
        data: data.value,
        showBackground: true,
        polarIndex: 0,
        backgroundStyle: {
          opacity: 0,
        },
        coordinateSystem: 'polar',
        roundCap: true,
        barWidth: 19,
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#FFDD34', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#FBA807', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
            shadowColor: 'rgba(255, 216, 78, 0.5)',
            shadowBlur: 10,
          },
        },
        z: 2,
      },
    ],
  };
  return (
    <ReactECharts
      option={option}
      className="Chart"
      notMerge={true}
      lazyUpdate={true}
      style={{
        height: 280,
        width: 280,
      }}
    />
  );
};
