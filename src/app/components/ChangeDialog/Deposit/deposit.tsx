/*eslint-disable import/no-anonymous-default-export */

import './deposit.styl';
import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';

import { ComputedReserveData, UserSummaryData, ComputedUserReserve } from 'app/hooks/utils/types';

import useTxBuilder from '../../../hooks/useTxBuilder';
import { useWeb3React } from '@web3-react/core';
import {
  pow10,
  formatMoney,
  filterInput,
  formatDecimal,
  valueToBigNumber,
} from '../../../utils/tool';
import storage from '../../../utils/storage';
import { handleSend } from '../helper/txHelper';
import SymbolIcon from '../../SymbolIcon';
import BigNumber from 'bignumber.js';

import { useDispatch } from 'react-redux';
import { setRefreshUIPoolData } from 'app/actions/baseAction';

interface IProps {
  type: 'Deposit' | 'Withdraw';
  data?: ComputedReserveData;
  user?: UserSummaryData;
  balance?: string;
  healthFactor?: string;
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
  const [type, setType] = useState<IProps['type']>();
  const [show, setShow] = useState(false);
  const [depositValidationMessage, setDepositValidationMessage] = useState('');
  const [withdrawValidationMessage, setWithdrawValidationMessage] = useState('');
  const [depositAmount, setDepositAmount] = useState<string | number>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [userAssetInfo, setUserAssetInfo] = useState<ComputedUserReserve>();
  const [isMax, setMax] = useState(false);

  const hide = () => {
    setType(undefined);
    setShow(false);
    setParams(undefined);
    setDepositAmount('');
    setWithdrawAmount('');
    setDepositValidationMessage('');
    setWithdrawValidationMessage('');
    setLoading(false);
    setMax(false);
  };

  useImperativeHandle(ref, () => ({
    show: (openProps: IProps) => {
      setParams(openProps);
      setShow(true);
      setType(openProps.type);
    },
    hide,
  }));

  const handleDepositAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setDepositAmount(val);
    if (Number(val) <= 0) {
      setDepositValidationMessage('Amount must be > 0');
    } else if (Number(val) > Number(val) + Number(params?.balance)) {
      setDepositValidationMessage('Amount must be <= balance');
    } else {
      setDepositValidationMessage('');
    }
  };

  const handleDepositSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !depositAmount) return;
    setLoading(true);
    try {
      const txs = await lendingPool.deposit({
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${depositAmount}`,
        referralCode: storage.get('referralCode') || undefined,
      });
      await handleSend(txs, library);
      dispatch(setRefreshUIPoolData(true));
      hide();
    } catch (error) {
      console.log(error);
      hide();
    }
    setLoading(false);
  };

  const handleWithdrawAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setWithdrawAmount(val);
    // if (Number(val) <= 0) {
    //   setWithdrawValidationMessage('Amount must be > 0');
    // } else if (Number(val) > Number(val) + Number(params?.balance)) {
    //   setWithdrawValidationMessage('Amount must be <= balance');
    // } else {
    //   setWithdrawValidationMessage('');
    // }
  };

  const handleWithdrawSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !withdrawAmount) return;
    setLoading(true);
    try {
      const txs = await lendingPool.withdraw({
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${isMax ? '-1' : withdrawAmount}`,
        aTokenAddress: params.data.aTokenAddress,
      });
      await handleSend(txs, library);
      dispatch(setRefreshUIPoolData(true));
      hide();
    } catch (error) {
      console.log(error);
      hide();
    }
    setLoading(false);
  };

  useEffect(() => {
    const poolReserve = params?.data;
    if (!poolReserve) return;
    if (params?.user?.reservesData && params?.data?.underlyingAsset) {
      const asset = params.user.reservesData.filter(
        (item) => item.reserve.underlyingAsset === params.data?.underlyingAsset
      );
      setUserAssetInfo(asset[0]);
    }

    return () => {};
  }, [params]);

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
      <div className="symbol">
        <SymbolIcon symbol={params?.data?.symbol} size={96} />
        <div className="text">{params?.data?.symbol}</div>
      </div>
      <div className="tab">
        <div
          className={classnames('tabItem', { cur: type === 'Deposit' })}
          onClick={() => setType('Deposit')}
        >
          {t('changeDialog.deposit')}
        </div>
        <div
          className={classnames('tabItem', { cur: type === 'Withdraw' })}
          onClick={() => setType('Withdraw')}
        >
          {t('changeDialog.withdraw')}
        </div>
      </div>
      {type === 'Deposit' ? (
        <div className="tabMain">
          <div className="block">
            <div className="box">
              <div className="balance">
                <span className="balanceLabel">{t('changeDialog.walletBalance')}</span>
                <i className="balanceNumber">
                  <em>{formatMoney(pow10(params?.balance, params?.data?.decimals))}</em>
                  {params?.data?.symbol}
                </i>
              </div>
              <div className={classnames('input', { error: !!depositValidationMessage })}>
                <div
                  className="max"
                  onClick={() =>
                    setDepositAmount(
                      filterInput(pow10(params?.balance, params?.data?.decimals).toString())
                    )
                  }
                >
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder={t('changeDialog.enterAmount')}
                  value={depositAmount}
                  onChange={(event) => {
                    setMax(false);
                    handleDepositAmountChange(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="info">
            <div className="item">
              <div className="key">{t('changeDialog.healthFactor')}</div>
              <div className="value">{formatDecimal(params?.healthFactor)}%</div>
            </div>
            <div className="item">
              <div className="key">{t('changeDialog.depositInfo')}</div>
              <div className="subItem">
                <div className="key">{t('changeDialog.depositAPY')}</div>
                <div className="value">
                  {params?.data?.borrowingEnabled
                    ? formatDecimal(Number(params?.data?.liquidityRate) * 100)
                    : -1}
                  %
                </div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.rewardAPR')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.LTV')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.remainingDepositPool')}</div>
                <div className="value">xxx</div>
              </div>
            </div>
            <div className="item">
              <div className="key">{t('changeDialog.borrowLimit')}</div>
              <div className="subItem">
                <div className="key">{t('changeDialog.availableLoanValue')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.borrowedValue')}</div>
                <div className="value">xxx</div>
              </div>
            </div>
          </div>
          <div className="dialogFooter">
            <Button
              disabled={!isMax && +depositAmount > +pow10(params?.balance, params?.data?.decimals)}
              loading={loading}
              className="submit"
              onClick={() => handleDepositSubmit()}
            >
              {t('changeDialog.submit')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="tabMain">
          <div className="block">
            <div className="box">
              <div className="balance">
                <span className="balanceLabel">{t('changeDialog.redeemable')}</span>
                <i className="balanceNumber">
                  <em>{formatMoney(userAssetInfo?.underlyingBalance || 0)}</em>
                  {params?.data?.symbol}
                </i>
              </div>
              <div className="input">
                <div
                  onClick={() => {
                    if (userAssetInfo) {
                      setMax(true);
                      setWithdrawAmount(filterInput(userAssetInfo.underlyingBalance));
                    }
                  }}
                  className="max"
                >
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder={t('changeDialog.enterAmount')}
                  value={withdrawAmount}
                  onChange={(event) => {
                    setMax(false);
                    handleWithdrawAmountChange(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="info">
            <div className="item">
              <div className="key">{t('changeDialog.healthFactor')}</div>
              <div className="value">{formatDecimal(params?.healthFactor)}%</div>
            </div>
            <div className="item">
              <div className="key">{t('changeDialog.depositInfo')}</div>
              <div className="subItem">
                <div className="key">{t('changeDialog.depositAPY')}</div>
                <div className="value">
                  {params?.data?.borrowingEnabled
                    ? formatDecimal(Number(params?.data?.liquidityRate) * 100)
                    : -1}
                  %
                </div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.rewardAPR')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.LTV')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.remainingDepositPool')}</div>
                <div className="value">xxx</div>
              </div>
            </div>
            <div className="item">
              <div className="key">{t('changeDialog.borrowLimit')}</div>
              <div className="subItem">
                <div className="key">{t('changeDialog.availableLoanValue')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.borrowedValue')}</div>
                <div className="value">xxx</div>
              </div>
            </div>
          </div>
          <div className="dialogFooter">
            <Button
              disabled={!isMax && withdrawAmount > Number(userAssetInfo?.underlyingBalance)}
              loading={loading}
              className="submit"
              onClick={() => handleWithdrawSubmit()}
            >
              {t('changeDialog.submit')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
});
