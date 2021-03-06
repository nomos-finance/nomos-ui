import './swap.styl';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { Modal, Input, Button, Popover } from 'antd';
import { useThemeContext } from '../../../theme';

import { ComputedReserveData } from '@aave/protocol-js';
import useTxBuilder from '../../../hooks/useTxBuilder';
import { handleSend } from '../helper/txHelper';
import { useWeb3React } from '@web3-react/core';
import { pow10, formatMoney, filterInput } from '../../../utils/tool';
import storage from '../../../utils/storage';
import SelectToken from 'app/components/SelectToken/selectToken';
import Icon from 'assets/icons';

interface IProps {}

export interface IDialog {
  show(openProps?: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [lendingPool] = useTxBuilder();
  const { currentThemeName } = useThemeContext();
  const { account, library } = useWeb3React();
  const [params, setParams] = useState<IProps>();
  const [show, setShow] = useState(false);
  const [borrowValidationMessage, setBorrowValidationMessage] = useState('');
  const [repayValidationMessage, setRepayValidationMessage] = useState('');
  const [borrowAmount, setBorrowAmount] = useState<string | number>('');
  const [repayAmount, setRepayAmount] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [interestRateMode, setInterestRateMode] = useState('Stable');

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

  const handleSubmit = async () => {
    //   if (!lendingPool || !params?.data || !account || !borrowAmount) return;
    //   try {
    //     setLoading(true);
    //     const txs = await lendingPool.borrow({
    //       interestRateMode: interestRateMode as any,
    //       user: account,
    //       reserve: params.data.underlyingAsset,
    //       amount: `${borrowAmount}`,
    //       referralCode: storage.get('referralCode') || undefined,
    //       debtTokenAddress:
    //         interestRateMode === 'Stable'
    //           ? params.data.stableDebtTokenAddress
    //           : params.data.variableDebtTokenAddress,
    //     });
    //     console.log(txs);
    //     await handleSend(txs, library);
    //     setLoading(false);
    //     hide();
    //   } catch (error) {
    //     console.log(error);
    //     setLoading(false);
    //     hide();
    //   }
  };

  const content = (
    <div className="settingWrap">
      <div className="settingTitle">??????</div>
      <div className="btnWrap">
        <div className="btn">??????</div>
        <div className="input">
          <Input bordered={false} placeholder="?????????" />
        </div>
      </div>
      <div className="settingTitle">??????????????????</div>
      <div className="time">
        <div className="input">
          <Input bordered={false} placeholder="?????????" />
        </div>
        <span>??????</span>
      </div>
      <div className="notice">?????????????????????Uniswap</div>
    </div>
  );

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
      <div className="swapHeader">
        <div className="text">??????</div>
        <Popover
          placement="bottomLeft"
          content={content}
          trigger="click"
          overlayClassName={classnames('swapSetting', currentThemeName)}
        >
          <div className="setting">
            <Icon name="setting" />
          </div>
        </Popover>
      </div>
      <div className="tabMain">
        <div className="blockTitle">???????????????</div>
        <div className="block">
          <div className="box">
            <div className="balance">
              <SelectToken />
              <div className="swapNumber">
                <div className="label">?????????:</div>
                <div className="value">55</div>
              </div>
            </div>
            <div className="input">
              <div onClick={() => {}} className="max">
                MAX
              </div>
              <Input
                bordered={false}
                placeholder="???????????????"
                // value={withdrawAmount}
                onChange={(event) => {}}
              />
              <div className="number">???$1000.00</div>
            </div>
          </div>
        </div>
        <div className="blockTitle blockTitle2">??????????????????</div>
        <div className="block">
          <div className="box">
            <div className="balance">
              <SelectToken />
              <div className="swapNumber">
                <div className="label">????????????:</div>
                <div className="value">55</div>
              </div>
            </div>
            <div className="input">
              <Input
                bordered={false}
                placeholder="???????????????"
                // value={withdrawAmount}
                onChange={(event) => {}}
              />
              <div className="number">???$1000.00</div>
            </div>
          </div>
        </div>
        <div className="blockTip">1WETH=1000.00SENT</div>
        <div className="dialogFooter">
          <Button loading={loading} className="submit" onClick={() => handleSubmit()}>
            ??????
          </Button>
        </div>
      </div>
    </Modal>
  );
});
