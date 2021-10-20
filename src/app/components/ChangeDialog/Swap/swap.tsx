import './deposit.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import { useThemeContext } from '../../../theme';

interface IProps {}

export interface IDialog {
  show(openProps?: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [params, setParams] = useState<IProps>();
  const [show, setShow] = useState(false);
  const { currentThemeName } = useThemeContext();

  const hide = () => {
    setShow(false);
    setParams(undefined);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps?: IProps) => {
      setParams(openProps);
      setShow(true);
    },
    hide,
  }));

  return (
    <Modal
      visible={show}
      onCancel={() => setShow(false)}
      footer={null}
      wrapClassName={classnames('customDialog', 'changeDialog', currentThemeName)}
      centered
      destroyOnClose={true}
      closable={false}
    >
      <div>兑换</div>
      <div>已抵押资产</div>
      <div>BTC</div>
      <div>目标抵押资产</div>
      <div>ETH</div>
      <div onClick={() => hide()}>提交</div>
    </Modal>
  );
});
