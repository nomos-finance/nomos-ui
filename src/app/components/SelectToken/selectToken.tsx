/*eslint-disable import/no-anonymous-default-export */
import './selectToken.styl';
import classnames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Popover } from 'antd';

import SymbolIcon from '../SymbolIcon';
import { useThemeContext } from '../../theme';
import Icon from '../../../assets/icons';

export default (): React.ReactElement => {
  const { currentThemeName } = useThemeContext();
  const [t, i18n] = useTranslation();

  const content = (
    <div className="selectTokenList">
      <div className="header">
        <div className="input">
          <em>
            <Icon name="search" />
          </em>
          <Input placeholder="请搜索名称或粘贴地址" bordered={false} />
        </div>
      </div>
      <div>
        <div className="list">
          <div className="item">
            <SymbolIcon symbol="aave" />
            <div className="text">
              <div className="left">
                <div className="symbol">aave</div>
                <div className="subSymbol">aave</div>
              </div>
              <div className="right">
                <div className="number">63</div>
              </div>
            </div>
          </div>
          <div className="item">
            <SymbolIcon symbol="aave" />
            <div className="text">
              <div className="left">
                <div className="symbol">aave</div>
                <div className="subSymbol">aave</div>
              </div>
              <div className="right">
                <div className="number">63</div>
              </div>
            </div>
          </div>
          <div className="item">
            <SymbolIcon symbol="aave" />
            <div className="text">
              <div className="left">
                <div className="symbol">aave</div>
                <div className="subSymbol">aave</div>
              </div>
              <div className="right">
                <div className="number">63</div>
              </div>
            </div>
          </div>
          <div className="item">
            <SymbolIcon symbol="aave" />
            <div className="text">
              <div className="left">
                <div className="symbol">aave</div>
                <div className="subSymbol">aave</div>
              </div>
              <div className="right">
                <div className="number">63</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottomLeft"
      content={content}
      trigger="click"
      overlayClassName={classnames('selectTokenList', currentThemeName)}
    >
      <div className="selectToken">
        <SymbolIcon symbol="WBTC" />
        <div className="symbol">
          <em>ETH</em>
          <i>
            <Icon name="down" />
          </i>
        </div>
      </div>
    </Popover>
  );
};
