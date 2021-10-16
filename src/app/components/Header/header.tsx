import './header.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { DarkModeSwitcher } from '@aave/aave-ui-kit';
import AddressInfo from './addressInfo';

export default (): React.ReactElement => {
  const history = useHistory();
  const { pathname } = history.location;

  return (
    <header className={classnames('lt-header')}>
      <div className="notice">
        <span>
          温馨提示：出于安全考虑，MDX的抵押率为零，不可用于抵押。BAGS不可用于存借，即将下线。
        </span>
      </div>
      <DarkModeSwitcher />
      <AddressInfo />
    </header>
  );
};
