import './borrow.styl';
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
import { formatDecimal, pow10, formatMoney, filterInput } from '../../../utils/tool';
import storage from '../../../utils/storage';
import SymbolIcon from '../../SymbolIcon';
import SelectToken from 'app/components/SelectToken/selectToken';

import { useDispatch } from 'react-redux';
import { setRefreshUIPoolData } from 'app/actions/baseAction';

interface IProps {
  type: 'Borrow' | 'Repay';
  data?: ComputedReserveData;
  user?: UserSummaryData;
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
  const [borrowValidationMessage, setBorrowValidationMessage] = useState('');
  const [repayValidationMessage, setRepayValidationMessage] = useState('');
  const [borrowAmount, setBorrowAmount] = useState<string | number>('');
  const [repayAmount, setRepayAmount] = useState<string | number>('');
  const [loading, setLoading] = useState(false);
  const [interestRateMode, setInterestRateMode] = useState('Stable');
  const [maxAmountToBorrow, setMaxAmountToBorrow] = useState<number>(0);
  const [userAssetInfo, setUserAssetInfo] = useState<ComputedUserReserve>();
  const [isMax, setMax] = useState(false);
  const [collateralMode, setCollateralMode] = useState('Collateral');

  const hide = () => {
    setType(undefined);
    setShow(false);
    setParams(undefined);
    setBorrowAmount('');
    setRepayAmount('');
    setBorrowValidationMessage('');
    setRepayValidationMessage('');
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

  useEffect(() => {
    if (!params || !params.data || !params.user || !account) return;
    const maxUserAmountToBorrow = valueToBigNumber(params.user?.availableBorrowsETH || 0).div(
      params.data.price.priceInEth
    );
    let maxAmountToBorrow = BigNumber.max(
      BigNumber.min(params.data.availableLiquidity, maxUserAmountToBorrow),
      0
    );
    if (
      maxAmountToBorrow.gt(0) &&
      params.user?.totalBorrowsETH !== '0' &&
      maxUserAmountToBorrow.lt(
        valueToBigNumber(params.data.availableLiquidity).multipliedBy('1.01')
      )
    ) {
      maxAmountToBorrow = maxAmountToBorrow.multipliedBy('0.99');
    }
    setMaxAmountToBorrow(+maxAmountToBorrow);
    if (params?.user?.reservesData && params?.data?.underlyingAsset) {
      const asset = params.user.reservesData.filter(
        (item) => item.reserve.underlyingAsset === params.data?.underlyingAsset
      );
      setUserAssetInfo(asset[0]);
    }
  }, [params, account]);

  const handleBorrowAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setBorrowAmount(val);
    // if (Number(val) <= 0) {
    //   setBorrowValidationMessage('Amount must be > 0');
    // } else if (Number(val) > Number(val) + Number(params?.balance)) {
    //   setBorrowValidationMessage('Amount must be <= balance');
    // } else {
    //   setBorrowValidationMessage('');
    // }
  };

  const handleBorrowSubmit = async () => {
    if (!lendingPool || !params?.data || !account || !borrowAmount) return;
    try {
      setLoading(true);
      const txs = await lendingPool.borrow({
        interestRateMode: interestRateMode as any,
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${borrowAmount}`,
        referralCode: storage.get('referralCode') || undefined,
        debtTokenAddress:
          interestRateMode === 'Stable'
            ? params.data.stableDebtTokenAddress
            : params.data.variableDebtTokenAddress,
      });
      console.log(txs);
      await handleSend(txs, library);
      dispatch(setRefreshUIPoolData(true));
      setLoading(false);
      hide();
    } catch (error) {
      console.log(error);
      setLoading(false);
      hide();
    }
  };

  const handleRepayAmountChange = (amount: string): void => {
    const val = filterInput(amount);
    setRepayAmount(val);
    // if (Number(val) <= 0) {
    //   setRepayValidationMessage('Amount must be > 0');
    // } else if (Number(val) > Number(val) + Number(params?.balance)) {
    //   setRepayValidationMessage('Amount must be <= balance');
    // } else {
    //   setRepayValidationMessage('');
    // }
  };

  const handleRepaySubmit = async () => {
    if (!lendingPool || !params?.data || !account || !repayAmount) return;
    try {
      setLoading(true);
      const txs = await lendingPool.repay({
        interestRateMode: interestRateMode as any,
        user: account,
        reserve: params.data.underlyingAsset,
        amount: `${isMax ? '-1' : repayAmount}`,
      });
      await handleSend(txs, library);
      dispatch(setRefreshUIPoolData(true));
      setLoading(false);
      hide();
    } catch (error) {
      console.log(error);
      setLoading(false);
      hide();
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
      <div className="symbol">
        <SymbolIcon symbol={params?.data?.symbol} size={96} />
        <div className="text">{params?.data?.symbol}</div>
      </div>
      <div className="tab">
        <div
          className={classnames('tabItem', { cur: type === 'Borrow' })}
          onClick={() => setType('Borrow')}
        >
          {t('changeDialog.borrow')}
        </div>
        <div
          className={classnames('tabItem', { cur: type === 'Repay' })}
          onClick={() => setType('Repay')}
        >
          {t('changeDialog.repay')}
        </div>
      </div>
      {type === 'Borrow' ? (
        <div className="tabMain">
          <div className="typeTab">
            <div
              className={classnames('typeTabItem', { cur: interestRateMode === 'Variable' })}
              onClick={() => setInterestRateMode('Variable')}
            >
              {t('changeDialog.variableRate')}
            </div>
            <div
              className={classnames('typeTabItem', { cur: interestRateMode === 'Stable' })}
              onClick={() => setInterestRateMode('Stable')}
            >
              {t('changeDialog.stableRate')}
            </div>
          </div>
          <div className="block">
            <div className="box">
              <div className="balance">
                <span className="balanceLabel">{t('changeDialog.availableLoanAmt')}</span>
                <i className="balanceNumber">{formatMoney(`${maxAmountToBorrow}`)}</i>
              </div>
              <div className="input">
                <div
                  className="max"
                  onClick={() => {
                    setMax(true);
                    setBorrowAmount(filterInput(`${maxAmountToBorrow}`));
                  }}
                >
                  Max
                </div>
                <Input
                  bordered={false}
                  placeholder={t('changeDialog.enterAmount')}
                  value={borrowAmount}
                  onChange={(event) => {
                    handleBorrowAmountChange(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="info">
            <div className="item">
              <div className="key">{t('changeDialog.healthFactor')}</div>
              <div className="value">{formatDecimal(params?.user?.healthFactor)}</div>
            </div>
            <div className="item">
              <div className="key">{t('changeDialog.loanInfo')}</div>
              <div className="subItem">
                <div className="key">{t('changeDialog.variableBorrowAPR')}</div>
                <div className="value">
                  {formatDecimal(Number(params?.data?.variableBorrowAPR) * 100)}%
                </div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.rewardAPR')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.remainingLoanPool')}</div>
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
            <Button loading={loading} className="submit" onClick={() => handleBorrowSubmit()}>
              {t('changeDialog.submit')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="tabMain">
          <div className="typeTab">
            <div
              className={classnames('typeTabItem', { cur: collateralMode === 'Ordinary' })}
              onClick={() => setCollateralMode('Ordinary')}
            >
              {t('changeDialog.normal')}
            </div>
            <div
              className={classnames('typeTabItem', { cur: collateralMode === 'Collateral' })}
              onClick={() => setCollateralMode('Collateral')}
            >
              {t('changeDialog.collateral')}
            </div>
          </div>
          <div className="block">
            {collateralMode === 'Collateral' ? (
              <div className="collateral">
                <SelectToken />
                <span className="value">1212ETH</span>
              </div>
            ) : null}
            <div className="box">
              <div className="balance">
                <span className="balanceLabel">{t('changeDialog.availableLoanAmt')}</span>
                <i className="balanceNumber">
                  {userAssetInfo
                    ? formatMoney(
                        interestRateMode === 'Variable'
                          ? userAssetInfo.variableBorrows
                          : userAssetInfo.stableBorrows
                      )
                    : 0}
                </i>
              </div>
              <div className="input">
                <div
                  onClick={() => {
                    if (userAssetInfo) {
                      setMax(true);
                      if (interestRateMode === 'Variable') {
                        setRepayAmount(filterInput(userAssetInfo.variableBorrows));
                      } else {
                        setRepayAmount(filterInput(userAssetInfo.stableBorrows));
                      }
                    }
                  }}
                  className="max"
                >
                  MAX
                </div>
                <Input
                  bordered={false}
                  placeholder={t('changeDialog.enterAmount')}
                  value={repayAmount}
                  onChange={(event) => {
                    handleRepayAmountChange(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="info">
            <div className="item">
              <div className="key">{t('changeDialog.healthFactor')}</div>
              <div className="value">{formatDecimal(params?.user?.healthFactor)}</div>
            </div>
            <div className="item">
              <div className="key">{t('changeDialog.loanInfo')}</div>
              <div className="subItem">
                <div className="key">{t('changeDialog.stableLoanAPR')}</div>
                <div className="value">
                  {formatDecimal(Number(params?.data?.stableBorrowRate) * 100)}%
                </div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.rewardAPR')}</div>
                <div className="value">xxx</div>
              </div>
              <div className="subItem">
                <div className="key">{t('changeDialog.remainingLoanPool')}</div>
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
            <Button loading={loading} className="submit" onClick={() => handleRepaySubmit()}>
              {t('changeDialog.submit')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
});
