import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import {
  ReserveData,
  UserReserveData,
  formatUserSummaryData,
  formatReserves,
  normalize,
  RewardsInformation,
  ComputedReserveData,
  UserSummaryData,
} from '@aave/protocol-js';
import { assetsList, Asset, assetsOrder, STABLE_ASSETS } from '@aave/aave-ui-kit';
import { useWeb3React } from '@web3-react/core';
import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';

import IUiPoolDataProviderFactory from '../contracts/IPoolDataProviderContract';
import useNetworkInfo from '../hooks/useNetworkInfo';

function formatObjectWithBNFields(obj: object): any {
  return Object.keys(obj).reduce((acc, key) => {
    if (isNaN(Number(key))) {
      // @ts-ignore
      let value = obj[key];
      if (value._isBigNumber) {
        value = value.toString();
      }
      acc[key] = value;
    }
    return acc;
  }, {} as any);
}

export interface DynamicPoolDataContextData {
  reserves: ComputedReserveData[];
  user?: UserSummaryData;
  usdPriceEth: string;
}

interface PoolReservesWithRPC {
  loading: boolean;
  data?: DynamicPoolDataContextData;
  refresh: (account: string) => Promise<void>;
}

interface IHandleFormatData {
  rawReservesData: any;
  userReserves: any;
  poolAddress: string;
  userAddress: string;
  usdPriceEth: any;
}

const handleFormatData = ({
  rawReservesData,
  userReserves,
  poolAddress,
  userAddress,
  usdPriceEth,
}: IHandleFormatData) => {
  const formattedUsdPriceEth = new BigNumber(10)
    .exponentiatedBy(18 + 8)
    .div(usdPriceEth?.toString())
    .toFixed(0, BigNumber.ROUND_DOWN);

  const formattedReservesData = rawReservesData
    .map((rawReserve: any) => {
      const formattedReserve = formatObjectWithBNFields(rawReserve);
      formattedReserve.symbol = rawReserve.symbol.toUpperCase();
      formattedReserve.id = (rawReserve.underlyingAsset + poolAddress).toLowerCase();
      formattedReserve.underlyingAsset = rawReserve.underlyingAsset.toLowerCase();
      formattedReserve.price = { priceInEth: rawReserve.priceInEth.toString() };
      return formattedReserve;
    })
    .map((reserve: any) => ({
      ...reserve,
      symbol: unPrefixSymbol(reserve.symbol, 'A'),
    }))
    .sort(
      ({ symbol: a }: any, { symbol: b }: any) =>
        assetsOrder.indexOf(a.toUpperCase()) - assetsOrder.indexOf(b.toUpperCase())
    );

  const formattedUserReserves = userReserves
    .map((rawUserReserve: any) => {
      const reserve = formattedReservesData.find(
        (res: any) => res.underlyingAsset === rawUserReserve.underlyingAsset.toLowerCase()
      );
      const formattedUserReserve = formatObjectWithBNFields(rawUserReserve);
      formattedUserReserve.id = (userAddress + reserve.id).toLowerCase();

      formattedUserReserve.reserve = {
        id: reserve.id,
        underlyingAsset: reserve.underlyingAsset,
        name: reserve.name,
        symbol: reserve.symbol,
        decimals: reserve.decimals,
        liquidityRate: reserve.liquidityRate,
        reserveLiquidationBonus: reserve.reserveLiquidationBonus,
        lastUpdateTimestamp: reserve.lastUpdateTimestamp,
      };
      return formattedUserReserve;
    })
    .map((userReserve: any) => ({
      ...userReserve,
      reserve: {
        ...userReserve.reserve,
      },
    }));

  const fr = JSON.parse(JSON.stringify(formattedReservesData));
  const fur =
    userAddress !== ethers.constants.AddressZero
      ? JSON.parse(JSON.stringify(formattedUserReserves))
      : [];

  return {
    formattedUsdPriceEth,
    formattedReservesData: fr.map((reserve: any) => {
      if (reserve.symbol.toUpperCase() === `AWETH`) {
        // TODO
        return {
          ...reserve,
          symbol: 'ETH',
          underlyingAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase(),
        };
      }
      return reserve;
    }),
    formattedUserReserves: fur.map((userReserve: any) => {
      if (userReserve.reserve.symbol.toUpperCase() === `AWETH`) {
        return {
          ...userReserve,
          reserve: {
            ...userReserve.reserve,
            symbol: 'ETH',
            underlyingAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase(),
          },
        };
      }
      return userReserve;
    }),
  };
};

const unPrefixSymbol = (symbol: string, prefix: string) => {
  return symbol.toUpperCase().replace(new RegExp(`^(${prefix[0]}?${prefix.slice(1)})`), '');
};

function useProtocolDataWithRpc(): PoolReservesWithRPC {
  const [loading, setLoading] = useState(true);
  const [poolData, setPoolData] = useState<DynamicPoolDataContextData | undefined>(undefined);
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async (poolAddress: string, network: string, poolDataProvider: string) => {
    if (!networkInfo) return;
    const userAddress = account || ethers.constants.AddressZero;

    try {
      setLoading(true);
      const Contracts = IUiPoolDataProviderFactory(poolDataProvider, network);
      const result = await Contracts.getReservesData(poolAddress, userAddress);

      const { 0: rawReservesData, 1: userReserves, 2: usdPriceEth, 3: rawRewardsData } = result;

      const rewardsData = {
        userUnclaimedRewards: rawRewardsData.userUnclaimedRewards?.toString(),
        emissionEndTimestamp: rawRewardsData.emissionEndTimestamp?.toNumber(),
      };

      const formatData = handleFormatData({
        rawReservesData,
        userReserves,
        poolAddress,
        userAddress,
        usdPriceEth,
      });

      const rawReserves = formatData.formattedReservesData;
      const rawUserReserves = formatData.formattedUserReserves;
      const rewardsEmissionEndTimestamp = rewardsData.emissionEndTimestamp;
      // const userUnclaimedRewardsRaw = rewardsData.userUnclaimedRewards;
      // const userId = userAddress !== ethers.constants.AddressZero ? userAddress : undefined;
      const formattedUsdPriceEth = normalize(normalize(formatData.formattedUsdPriceEth, 18), -18);
      const currentTimestamp = dayjs().unix();

      const rewardReserve = rawReserves.find(
        (reserve: any) =>
          reserve.underlyingAsset.toLowerCase() === networkInfo.rewardTokenAddress.toLowerCase()
      );
      const rewardTokenPriceEth = rewardReserve ? rewardReserve.price.priceInEth : '0';

      const rewardInfo: RewardsInformation = {
        rewardTokenAddress: networkInfo.rewardTokenAddress,
        rewardTokenDecimals: networkInfo.rewardTokenDecimals,
        incentivePrecision: networkInfo.incentivePrecision,
        rewardTokenPriceEth,
        emissionEndTimestamp: rewardsEmissionEndTimestamp,
      };

      const computedUserData =
        userAddress && rawUserReserves
          ? formatUserSummaryData(
              rawReserves,
              rawUserReserves,
              userAddress,
              formattedUsdPriceEth,
              // networkConfig.usdMarket ? valueToBigNumber(1) : normalize(usdPriceEth, -18),
              currentTimestamp,
              rewardInfo
            )
          : undefined;

      // console.log(userId, rawUserReserves);

      const formattedPoolReserves = formatReserves(
        rawReserves,
        currentTimestamp,
        undefined, //TODO: recover at some point
        rewardTokenPriceEth,
        rewardsEmissionEndTimestamp
      );

      setPoolData({
        user: computedUserData,
        reserves: formattedPoolReserves,
        usdPriceEth: normalize(formattedUsdPriceEth, 18),
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!networkInfo) return;

    fetchData(
      networkInfo.addresses.LENDING_POOL_ADDRESS_PROVIDER,
      networkInfo.chainKey,
      networkInfo.uiPoolDataProvider
    );
    const intervalID = setInterval(
      () =>
        fetchData(
          networkInfo.addresses.LENDING_POOL_ADDRESS_PROVIDER,
          networkInfo.chainKey,
          networkInfo.uiPoolDataProvider
        ),
      30 * 1000
    );
    return () => clearInterval(intervalID);
  }, [account, networkInfo]);

  return {
    loading,
    data: poolData,
    refresh: async () => {
      if (!networkInfo) return;
      fetchData(
        networkInfo.addresses.LENDING_POOL_ADDRESS_PROVIDER,
        networkInfo.chainKey,
        networkInfo.uiPoolDataProvider
      );
    },
  };
}

export default useProtocolDataWithRpc;
