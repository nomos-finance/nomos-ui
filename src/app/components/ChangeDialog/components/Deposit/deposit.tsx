import './deposit.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { useEffect, useRef } from 'react';
interface IProps {
  close(): void;
}
export default (props: IProps): React.ReactElement => {
  return (
    <div>
      <div>钱包余额</div>
      <div>健康因子</div>
      <div>存款收益</div>
      <div>抵押品参数</div>
      <div onClick={() => props.close()}>提交</div>
    </div>
  );
};
