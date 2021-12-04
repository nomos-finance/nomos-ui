import './usageAsCollateral.styl';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';

import {
  ComputedReserveData,
  valueToBigNumber,
  BigNumber,
  UserSummaryData,
  ComputedUserReserve,
} from '@aave/protocol-js';
import useTxBuilder from '../../../hooks/useTxBuilder';
import { handleSend } from '../helper/txHelper';
import { useWeb3React } from '@web3-react/core';

import { useDispatch } from 'react-redux';
import { setRefreshUIPoolData } from 'app/actions/baseAction';

interface IProps {
  status: boolean;
  data: ComputedReserveData;
}

export interface IDialog {
  show(openProps: IProps): void;
  hide(): void;
}

export default forwardRef((props, ref) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const [lendingPool] = useTxBuilder();
  const { currentThemeName } = useThemeContext();
  const { account, library } = useWeb3React();
  const [params, setParams] = useState<IProps>();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

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
    if (lendingPool && account && params) {
      try {
        setLoading(true);
        const txs = await lendingPool.setUsageAsCollateral({
          user: account,
          reserve: params.data.underlyingAsset,
          usageAsCollateral: params.status,
        });
        await handleSend(txs, library);
        dispatch(setRefreshUIPoolData(true));
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
      <div>抵押品</div>
      <div className="dialogFooter">
        <Button loading={loading} className="submit" onClick={() => handleSubmit()}>
          {t('changeDialog.submit')}
        </Button>
      </div>
    </Modal>
  );
});
