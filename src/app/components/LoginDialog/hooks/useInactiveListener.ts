import { useWeb3React } from '@web3-react/core';
import { useEffect } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import storage from 'app/utils/storage';
import { useDispatch } from 'react-redux';
import { setNetwork, setProviderName, setAccount } from 'app/actions/baseAction';
import { getNetworkByChainId } from 'app/config';

export default function useInactiveListener(
  injected: AbstractConnector | undefined,
  suppress = false
): void {
  const { active, error, activate, account } = useWeb3React();
  const dispatch = useDispatch();

  useEffect(() => {
    const { ethereum } = window;
    const handleConnect = () => {
      console.log("Handling 'connect' event");
      // activate(injected);
    };
    const handleChainChanged = (chainId: string) => {
      console.log("Handling 'chainChanged' event with payload", chainId);
      // activate(injected);
    };
    const handleAccountsChanged = (accounts: string) => {
      console.log("Handling 'accountsChanged' event with payload", accounts);
      if (account) {
        // activate(injected);
        storage.set('account', account);
        dispatch(setAccount(account));
      }
    };
    const handleNetworkChanged = (networkId: string) => {
      console.log("Handling 'networkChanged' event with payload", networkId);
      // activate(injected);
      const network = getNetworkByChainId(Number(networkId));
      if (network) {
        const chainKey = network?.chainKey;
        storage.set('network', chainKey);
        dispatch(setNetwork(chainKey));
      }
    };

    ethereum.on('connect', handleConnect);
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('networkChanged', handleNetworkChanged);

    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener('connect', handleConnect);
        ethereum.removeListener('chainChanged', handleChainChanged);
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
        ethereum.removeListener('networkChanged', handleNetworkChanged);
      }
    };
  }, [active, error, suppress, activate, injected]);
}
