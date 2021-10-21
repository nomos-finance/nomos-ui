import { useEffect, useState } from 'react';
import LendingPoolProviderContract from '../contracts/LendingPoolProviderContract';
import useNetworkInfo from './useNetworkInfo';
import { Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';

const useLendingPoolContract = (): [Contract | undefined] => {
  const [networkInfo] = useNetworkInfo();
  const [contract, setContract] = useState<Contract>();
  const { account } = useWeb3React();

  const fetchData = async () => {
    if (!networkInfo?.addresses) return;
    setContract(
      LendingPoolProviderContract(
        networkInfo?.addresses.LENDING_POOL,
        networkInfo?.chainKey,
        account
      )
    );
  };

  useEffect(() => {
    fetchData();
  }, [networkInfo, account]);

  return [contract];
};

export default useLendingPoolContract;
