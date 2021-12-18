import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import dayjs from 'dayjs';
import { formatUserSummaryData, formatReserves } from './utils/computations-and-formatting';
import { UserSummaryData, ComputedReserveData, RewardsInformation } from './utils/types';

import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';

import useNetworkInfo from '../hooks/useNetworkInfo';

import { handleFormatData } from './utils/handleFormatData';

import abi from 'abi/UiPoolDataProvider.json';
import { contract as appContract } from 'app/contracts/contract';
import priceOrcleAbi from 'abi/AaveOracle.json';

import { pow10, normalize } from 'app/utils/tool';

export interface DynamicPoolDataContextData {
  reserves: ComputedReserveData[];
  user?: UserSummaryData;
  symbolUsd: { [key: string]: string };
}

interface PoolReservesWithRPC {
  loading: boolean;
  data?: DynamicPoolDataContextData;
  refresh: (account: string) => Promise<void>;
}

function useProtocolDataWithRpc(): PoolReservesWithRPC {
  const [loading, setLoading] = useState(true);
  const [poolData, setPoolData] = useState<DynamicPoolDataContextData | undefined>(undefined);
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async (poolAddress: string, poolDataProvider: string) => {
    if (!networkInfo) return;
    const userAddress = account || ethers.constants.AddressZero;

    try {
      setLoading(true);
      const Contracts = await appContract(abi, poolDataProvider, account);
      const result = await Contracts.getReservesData(poolAddress, userAddress);
      const priceOracleContract = await appContract(
        priceOrcleAbi,
        networkInfo.addresses.AaveOracle
      );

      const { 0: rawReservesData, 1: userReserves } = result;

      const rewardsData = {
        userUnclaimedRewards: 0,
        emissionEndTimestamp: 0,
      };

      const formatData = handleFormatData({
        rawReservesData,
        userReserves,
        poolAddress,
        userAddress,
      });

      const rawReserves = formatData.formattedReservesData;
      const rawUserReserves = formatData.formattedUserReserves;
      const rewardsEmissionEndTimestamp = rewardsData.emissionEndTimestamp;
      const currentTimestamp = dayjs().unix();

      const computedUserData = formatUserSummaryData(
        rawReserves,
        rawUserReserves,
        userAddress,
        currentTimestamp
      );

      const formattedPoolReserves = formatReserves(
        rawReserves,
        currentTimestamp,
        rewardsEmissionEndTimestamp
      );

      let address: string[] = [];
      let symbolUsd: { [key: string]: string } = {};
      formatData.formattedReservesData.forEach((item: any) => {
        address.push(item.originAddress || item.underlyingAsset);
      });
      let USD = await priceOracleContract.getAssetsPrices(address);
      formatData.formattedReservesData.forEach((item: any, index: number) => {
        symbolUsd[item.symbol] = pow10(USD[index].toString(), 8).toString();
      });

      setPoolData({
        user: computedUserData,
        reserves: formattedPoolReserves,
        symbolUsd,
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!networkInfo) return;

    fetchData(networkInfo.addresses.LENDING_POOL_ADDRESS_PROVIDER, networkInfo.uiPoolDataProvider);
    const intervalID = setInterval(
      () =>
        fetchData(
          networkInfo.addresses.LENDING_POOL_ADDRESS_PROVIDER,
          networkInfo.uiPoolDataProvider
        ),
      30 * 1000
    );
    return () => {
      setPoolData(undefined);
      clearInterval(intervalID);
    };
  }, [account, networkInfo]);

  return {
    loading,
    data: poolData,
    refresh: async () => {
      if (!networkInfo) return;
      fetchData(
        networkInfo.addresses.LENDING_POOL_ADDRESS_PROVIDER,
        networkInfo.uiPoolDataProvider
      );
    },
  };
}

export default useProtocolDataWithRpc;
