import './borrow.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal } from 'antd';
import { useThemeContext } from '../../../theme';

interface IProps {
  type: 'Loan' | 'Repay';
}

export interface IDialog {
  show(openProps: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [params, setParams] = useState<IProps>();
  const [type, setType] = useState(params ? params.type : 'Loan');
  const [show, setShow] = useState(false);
  const { currentThemeName } = useThemeContext();

  const hide = () => {
    setShow(false);
    setParams(undefined);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps: IProps) => {
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
      <div className="tab">
        <div
          className={classnames('tabItem', { cur: type === 'Loan' })}
          onClick={() => setType('Loan')}
        >
          贷款
        </div>
        <div
          className={classnames('tabItem', { cur: type === 'Repay' })}
          onClick={() => setType('Repay')}
        >
          还款
        </div>
      </div>
      <div>
        <div>钱包余额</div>
        <div>健康因子</div>
        <div>存款收益</div>
        <div>抵押品参数</div>
      </div>
      <div onClick={() => hide()}>提交</div>
    </Modal>
  );
});
