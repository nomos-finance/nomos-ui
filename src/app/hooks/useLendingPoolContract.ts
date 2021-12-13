import { useEffect, useState } from 'react';
import useNetworkInfo from './useNetworkInfo';
import { useWeb3React } from '@web3-react/core';
import abi from 'abi/LendingPool.json';
import { contract as appContract, Contract } from 'app/contracts/contract';

const useLendingPoolContract = (): [Contract | undefined] => {
  const [networkInfo] = useNetworkInfo();
  const [contract, setContract] = useState<Contract>();
  const { account } = useWeb3React();

  const fetchData = async () => {
    if (!networkInfo?.addresses) return;
    const res = await appContract(abi, networkInfo.addresses.LENDING_POOL, account);
    setContract(res);
  };

  useEffect(() => {
    fetchData();
  }, [networkInfo, account]);

  return [contract];
};

export default useLendingPoolContract;
