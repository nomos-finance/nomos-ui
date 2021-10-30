/*eslint-disable import/no-anonymous-default-export */
import './nav.styl';

import classnames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Dropdown, Menu } from 'antd';

import Icon from '../../../assets/icons';
import { useThemeContext } from '../../theme';

export default (): React.ReactElement => {
  const history = useHistory();
  const { pathname } = history.location;
  const { currentThemeName } = useThemeContext();
  const [t, i18n] = useTranslation();

  const changLng = (l: string): void => {
    i18n.changeLanguage(l);
    history.replace(`?lng=${l}`);
  };

  return (
    <nav className={classnames('lt-nav')}>
      <Link className={classnames('logo', currentThemeName)} to="/" />
      <div className="menu">
        <Link
          className={classnames('item', { cur: pathname === '/' || /market/.test(pathname) })}
          to="/"
        >
          <i>
            <Icon name="market" />
          </i>
          <span>Market</span>
        </Link>
        <Link className={classnames('item', { cur: /dao/.test(pathname) })} to="/dao">
          <i>
            <Icon name="dao" />
          </i>
          <span>DAO</span>
        </Link>
        <Link className={classnames('item', { cur: /voting/.test(pathname) })} to="/voting">
          <i>
            <Icon name="voting" />
          </i>
          <span>Voting</span>
        </Link>
        <Link className={classnames('item', { cur: /invitation/.test(pathname) })} to="/invitation">
          <i>
            <Icon name="invitation" />
          </i>
          <span>Invitation</span>
        </Link>
        <Link className={classnames('item', { cur: /staking/.test(pathname) })} to="/staking">
          <i>
            <Icon name="staking" />
          </i>
          <span>Staking</span>
        </Link>
        <Link className={classnames('item', { cur: /position/.test(pathname) })} to="/position">
          <i>
            <Icon name="position" />
          </i>
          <span>Position</span>
        </Link>
        <div className="doc">
          <div className="item">
            <i>
              <Icon name="announcement" />
            </i>
            <span>Announcement</span>
          </div>
          <div className="item">
            <i>
              <Icon name="file" />
            </i>
            <span>File</span>
            <em>
              <Icon name="down" />
            </em>
          </div>
        </div>
      </div>
      <Dropdown
        overlayClassName={classnames('navLanguageDown', currentThemeName)}
        placement="topCenter"
        overlay={
          <Menu>
            <Menu.Item key="zh_CN">
              <div className="item" onClick={() => changLng('zh_CN')}>
                中文简体
              </div>
            </Menu.Item>
            <Menu.Item key="en_US">
              <div className="item" onClick={() => changLng('en_US')}>
                English
              </div>
            </Menu.Item>
          </Menu>
        }
      >
        <div className="language">
          <i>
            <Icon name="language" />
          </i>
          <span>{i18n.language === 'zh_CN' ? '中文简体' : 'English'}</span>
          <em>
            <Icon name="down" />
          </em>
        </div>
      </Dropdown>
      <div className="medium">
        <div className="item">
          <Icon name="twitter" />
        </div>
        <div className="item">
          <Icon name="facebook" />
        </div>
        <div className="item">
          <Icon name="weChat" />
        </div>
        <div className="item">
          <Icon name="in" />
        </div>
      </div>
    </nav>
  );
};
