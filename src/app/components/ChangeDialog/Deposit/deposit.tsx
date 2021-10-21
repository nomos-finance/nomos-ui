import './deposit.scss';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal, Input } from 'antd';
import { useThemeContext } from '../../../theme';
import { ComputedReserveData } from '@aave/protocol-js';
import useLendingPoolContract from '../../../hooks/useLendingPoolContract';
import { useWeb3React } from '@web3-react/core';
import { pow10, formatMoney, original } from '../../../utils/tool';
import storage from '../../../utils/storage';

interface IProps {
  type: 'Save' | 'Cash';
  data?: ComputedReserveData;
  balance?: string;
}

export interface IDialog {
  show(openProps: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [params, setParams] = useState<IProps>();
  const [type, setType] = useState(params ? params.type : 'Save');
  const [show, setShow] = useState(false);
  const { currentThemeName } = useThemeContext();
  const [contract] = useLendingPoolContract();
  const { account } = useWeb3React();

  const [saveValidationMessage, setSaveValidationMessage] = useState('');
  const [saveAmount, setSaveAmount] = useState<string | number>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string | number>('');

  const hide = () => {
    setShow(false);
    setParams(undefined);
    setSaveAmount(0);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps: IProps) => {
      setParams(openProps);
      setShow(true);
    },
    hide,
  }));

  const handleSaveSubmit = async () => {
    if (!contract || !params?.data) return;
    console.log(params.data.underlyingAsset, original(saveAmount, 18), account, '0');
    try {
      await (contract as any).deposit(
        params.data.underlyingAsset,
        original(saveAmount, 18),
        account,
        '0'
        // storage.get('referralCode') || 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveAmountChange = (amount: string): void => {
    const val = amount
      .replace('-', '')
      .replace(/^\.+|[^\d.]/g, '')
      .replace(/^0\d+\./g, '0.')
      .replace(/\.{2,}/, '')
      .replace(/^0(\d)/, '$1')
      .replace(/^(\-)*(\d+)\.(\d{0,2}).*$/, '$1$2.$3');
    setSaveAmount(val);
    if (Number(val) <= 0) {
      setSaveValidationMessage('Amount must be > 0');
    } else if (Number(val) > Number(val) + Number(params?.balance)) {
      setSaveValidationMessage('Amount must be <= balance');
    } else {
      setSaveValidationMessage('');
    }
  };

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
      <div>{params?.data?.symbol}</div>
      <div className="tab">
        <div
          className={classnames('tabItem', { cur: type === 'Save' })}
          onClick={() => setType('Save')}
        >
          存款
        </div>
        <div
          className={classnames('tabItem', { cur: type === 'Cash' })}
          onClick={() => setType('Cash')}
        >
          取款
        </div>
      </div>
      {type === 'Save' ? (
        <div className="tabMain">
          <div className="balance">
            <div>
              <div>钱包余额</div>
              {formatMoney(pow10(params?.balance))}
              {params?.data?.symbol}
            </div>
            <div className={classnames('input', { error: !!saveValidationMessage })}>
              <div onClick={() => setSaveAmount(Number(pow10(params?.balance)))}>MAX</div>
              <Input
                // bordered={false}
                value={saveAmount}
                onChange={(event) => {
                  handleSaveAmountChange(event.target.value);
                }}
              />
              {saveAmount}
            </div>
          </div>
          <div>
            <div>健康因子</div>
          </div>
          <div>
            <div>存款收益</div>
            <div>
              <div>存款年利率</div>
              <div>
                {params?.data?.borrowingEnabled ? Number(params?.data?.liquidityRate) : -1}%
              </div>
            </div>
          </div>
          <div>
            <div>抵押品参数</div>
          </div>
          <div className="submit" onClick={() => handleSaveSubmit()}>
            提交
          </div>
        </div>
      ) : (
        <div className="tabMain">
          <div>xx</div>
          <div className="submit" onClick={() => handleSaveSubmit()}>
            提交
          </div>
        </div>
      )}
    </Modal>
  );
});
