import { useEffect, useState } from 'react';
import { NETWORK, INetworkData } from '../config';
import LendingPoolProviderContract from '../contracts/LendingPoolProviderContract';
import useNetworkInfo from './useNetworkInfo';
import { Contract } from 'ethers';

const useLendingPoolContract = (): [INetworkData | undefined] => {
  const [networkInfo] = useNetworkInfo();
  const [contract, setContract] = useState<Contract>();

  const fetchData = async () => {
    if (!networkInfo?.addresses) return;
    setContract(
      LendingPoolProviderContract(networkInfo?.addresses.LENDING_POOL, networkInfo?.chainKey)
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return [networkInfo];
};

export default useLendingPoolContract;
