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

interface IModules {
  Borrow: () => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  Deposit: () => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  Swap: () => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
}

const modules: IModules = {
  Borrow,
  Deposit,
  Swap,
};

const ChangeDialog = forwardRef((props: IProps, ref) => {
  const [show, setShow] = useState(false);
  const { account } = useWeb3React();
  const { currentThemeName } = useThemeContext();

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
      {modules[props.type]()}
    </Modal>
  ) : null;
});

export default ChangeDialog;
