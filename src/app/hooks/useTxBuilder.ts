import { LendingPoolInterfaceV2, TxBuilderV2 } from '@aave/protocol-js';
import { getProvider } from '../contracts/provider';

import { useEffect, useState } from 'react';
import useNetworkInfo from './useNetworkInfo';

const useLendingPoolContract = (): [LendingPoolInterfaceV2 | undefined] => {
  const [networkInfo, NETWORK] = useNetworkInfo();
  const [contract, setContract] = useState<LendingPoolInterfaceV2>();
  const lendingPoolConfig: any = {};
  const incentives: any = {};
  Object.keys(NETWORK).forEach((item) => {
    if (NETWORK[item].incentives) {
      incentives[item] = NETWORK[item].incentives;
      lendingPoolConfig[item] = {};
      lendingPoolConfig[item][`proto_${item}`] = NETWORK[item].addresses;
    }
  });

  const fetchData = async () => {
    if (networkInfo) {
      const txBuilder = new TxBuilderV2(
        networkInfo.chainKey as any,
        getProvider(networkInfo.chainKey),
        undefined,
        {
          lendingPool: lendingPoolConfig,
          incentives,
        }
      );

      const lendingPool = txBuilder.getLendingPool('proto_kovan');

      console.log({
        lendingPool: lendingPoolConfig,
        incentives,
      });

      setContract(lendingPool);
    }
  };

  useEffect(() => {
    fetchData();
  }, [networkInfo]);

  return [contract];
};

export default useLendingPoolContract;
