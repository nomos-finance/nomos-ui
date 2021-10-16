import React from 'react';
import classNames from 'classnames';

import { useUserWalletDataContext } from '../../../libs/web3-data-provider';

interface ConnectButtonProps {
  className?: string;
  size?: 'small' | 'normal' | 'medium';
}

export default function ConnectButton({ className, size = 'normal' }: ConnectButtonProps) {
  const { showSelectWalletModal } = useUserWalletDataContext();

  return (
    <button
      className={classNames('ConnectButton', `ConnectButton__${size}`, className)}
      type="button"
      onClick={() => {
        showSelectWalletModal();
      }}
    >
      链接
    </button>
  );
}
