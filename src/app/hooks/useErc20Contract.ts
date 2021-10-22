import { useEffect, useState } from 'react';
import Erc20Contract from '../contracts/Erc20Contract';
import useNetworkInfo from './useNetworkInfo';
import { Contract } from 'ethers';
import { useWeb3React } from '@web3-react/core';

const useLendingPoolContract = (): [Contract | undefined] => {
  const [networkInfo] = useNetworkInfo();
  const [contract, setContract] = useState<Contract>();
  const { account } = useWeb3React();

  const fetchData = async () => {
    if (!networkInfo?.addresses || !account) return;
    setContract(Erc20Contract(account, networkInfo?.chainKey));
  };

  useEffect(() => {
    fetchData();
  }, [networkInfo, account]);

  return [contract];
};

export default useLendingPoolContract;
