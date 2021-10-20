import { useWeb3React } from '@web3-react/core';
import { Modal } from 'antd';
import classNames from 'classnames';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useThemeContext } from '../../theme';
import Deposit from './components/Deposit';
import Borrow from './components/Borrow';
import Swap from './components/Swap';

export interface IDialog {
  show(): void;
  hide(): void;
}

interface IProps {
  type: 'Borrow' | 'Deposit' | 'Swap';
}

const ChangeDialog = forwardRef((props: IProps, ref) => {
  const [show, setShow] = useState(false);
  const { account } = useWeb3React();
  const { currentThemeName } = useThemeContext();
  const [species, setSpecies] = useState(props.type !== 'Swap' ? props.type : 'Deposit');

  useImperativeHandle(ref, () => ({
    show: () => {
      setShow(true);
    },
    hide: () => {
      setShow(false);
    },
  }));

  return account ? (
    <Modal
      visible={show}
      onCancel={() => setShow(false)}
      footer={null}
      wrapClassName={classNames('customDialog', 'changeDialog', currentThemeName)}
      centered
      destroyOnClose={true}
      closable={false}
    >
      {props.type === 'Swap' ? (
        <Swap close={() => setShow(false)} />
      ) : (
        <>
          <div className="tab">
            <div
              className={classNames('tabItem', { cur: species === 'Deposit' })}
              onClick={() => setSpecies('Deposit')}
            >
              存款
            </div>
            <div
              className={classNames('tabItem', { cur: species === 'Borrow' })}
              onClick={() => setSpecies('Deposit')}
            >
              贷款
            </div>
          </div>
          {props.type === 'Deposit' ? (
            <Deposit close={() => setShow(false)} />
          ) : (
            <Borrow close={() => setShow(false)} />
          )}
        </>
      )}
    </Modal>
  ) : null;
});

export default ChangeDialog;
