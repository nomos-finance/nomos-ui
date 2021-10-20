import './deposit.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
interface IProps {
  close(): void;
}

export default (props: IProps): React.ReactElement => {
  // const history = useHistory();
  // const { pathname } = history.location;

  return (
    <div>
      <div>兑换</div>
      <div>已抵押资产</div>
      <div>BTC</div>
      <div>目标抵押资产</div>
      <div>ETH</div>
      <div onClick={() => props.close()}>提交</div>
    </div>
  );
};
