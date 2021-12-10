import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import VeNomos from '../contracts/VeNomos';
import { ethers } from 'ethers';
import useNetworkInfo from './useNetworkInfo';
import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';

const useVeNomos = (): [any | undefined, () => void] => {
  const [contract, setContract] = useState<any>();
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async () => {
    if (!networkInfo?.addresses.veNomos) return;

    try {
      const res: any = await VeNomos(networkInfo.addresses.veNomos, networkInfo.chainKey);
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
  }, [networkInfo, account]);

  return [contract, fetchData];
};

export default useVeNomos;
