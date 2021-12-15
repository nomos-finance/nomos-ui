import './Lock.styl';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';

import useVeNomos from 'app/hooks/useVeNomos';

interface IProps {
  lock: number;
  maxTime: number;
  end: string;
}

export interface IDialog {
  show(openProps: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [t] = useTranslation();
  const { currentThemeName } = useThemeContext();
  const { account, library } = useWeb3React();
  const [params, setParams] = useState<IProps>();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [increaseTime, setIncreaseTime] = useState(false);

  const [veNomosContract, freshVeNomosContract] = useVeNomos();

  const hide = () => {
    setShow(false);
    setParams(undefined);
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps: IProps) => {
      setParams(openProps);
      setShow(true);
    },
    hide,
  }));

  const handleSubmit = async () => {
    if (account && params && veNomosContract) {
      try {
        setLoading(true);
        if (increaseTime) {
          const res = await veNomosContract.increase_unlock_time(1);
          await res.wait();
        }
        const res = await veNomosContract.increase_amount(params.lock);
        await res.wait();
        hide();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={show}
      onCancel={() => hide()}
      footer={null}
      wrapClassName={classnames('customDialog', 'changeDialog', currentThemeName)}
      centered
      destroyOnClose={true}
      closable={false}
    >
      <div className="lock">
        <div className="title">请选择锁仓时间</div>
        <div className="select">
          <div
            className={classnames('item', { cur: !increaseTime })}
            onClick={() => setIncreaseTime(false)}
          >
            本次锁仓后，不延长锁仓时间，即整体解锁时间为{params?.end}年
          </div>
          <div
            className={classnames('item', { cur: increaseTime })}
            onClick={() => setIncreaseTime(true)}
          >
            本次锁仓后，整体锁仓时间为5年
          </div>
        </div>
      </div>
      <div className="dialogFooter">
        <Button loading={loading} className="submit" onClick={() => handleSubmit()}>
          {t('changeDialog.submit')}
        </Button>
      </div>
    </Modal>
  );
});
