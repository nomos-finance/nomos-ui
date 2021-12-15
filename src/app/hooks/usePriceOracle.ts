import { useEffect, useState } from 'react';
import useNetworkInfo from './useNetworkInfo';
import abi from 'abi/AaveOracle.json';
import { contract as appContract, Contract } from 'app/contracts/contract';

const useAAVEOracle = (): [Contract | undefined, () => void] => {
  const [contract, setContract] = useState<Contract>();
  const [networkInfo] = useNetworkInfo();

  const fetchData = async () => {
    if (!networkInfo?.addresses.AaveOracle) return;

    try {
      const res = await appContract(abi, networkInfo.addresses.AaveOracle);
      setContract(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setContract(undefined);
    };
  }, [networkInfo]);

  return [contract, fetchData];
};

export default useAAVEOracle;
