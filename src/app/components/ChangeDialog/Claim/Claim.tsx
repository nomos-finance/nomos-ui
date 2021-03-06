import './Claim.styl';
/*eslint-disable import/no-anonymous-default-export */

import classnames from 'classnames';
import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { useThemeContext } from '../../../theme';
import { useTranslation } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import SymbolIcon from '../../SymbolIcon';

import { formatMoney } from 'app/utils/tool';
import useVotingEscrowRewardContract from 'app/hooks/useVotingEscrowRewardContract';

import Logo from './img/logo.png';

interface IProps {
  claim: number;
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

  const [votingEscrowRewardContract, freshVotingEscrowRewardContract] =
    useVotingEscrowRewardContract();

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
    if (account && params && votingEscrowRewardContract) {
      try {
        setLoading(true);
        const lastEpoch = await votingEscrowRewardContract.lastEpoch();
        const res = await votingEscrowRewardContract.claimReward(lastEpoch.toString());
        console.log(res);
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
      <div className="symbol">
        <SymbolIcon src={Logo} size={96} />
        <div className="text">NOMO</div>
      </div>
      <div className="claim">?????????: {formatMoney(params ? params.claim : 0)} NOMO</div>
      <div className="dialogFooter">
        <Button
          disabled={!(params ? params.claim : 0)}
          loading={loading}
          className="submit"
          onClick={() => handleSubmit()}
        >
          {t('changeDialog.submit')}
        </Button>
      </div>
    </Modal>
  );
});
