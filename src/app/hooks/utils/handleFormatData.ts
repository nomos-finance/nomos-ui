import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import { assetsOrder } from '@aave/aave-ui-kit';

interface IHandleFormatData {
  rawReservesData: any;
  userReserves: any;
  poolAddress: string;
  userAddress: string;
}

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

const unPrefixSymbol = (symbol: string, prefix: string) => {
  return symbol.toUpperCase().replace(new RegExp(`^(${prefix[0]}?${prefix.slice(1)})`), '');
};

export const handleFormatData = ({
  rawReservesData,
  userReserves,
  poolAddress,
  userAddress,
}: IHandleFormatData) => {
  const formattedReservesData = rawReservesData
    .map((rawReserve: any) => {
      const formattedReserve = formatObjectWithBNFields(rawReserve);
      formattedReserve.symbol = rawReserve.symbol.toUpperCase();
      formattedReserve.id = (rawReserve.underlyingAsset + poolAddress).toLowerCase();
      formattedReserve.underlyingAsset = rawReserve.underlyingAsset.toLowerCase();
      return formattedReserve;
    })
    .map((reserve: any) => ({
      ...reserve,
      symbol: unPrefixSymbol(reserve.symbol, 'N'),
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

  return {
    formattedReservesData: JSON.parse(JSON.stringify(formattedReservesData)).map((reserve: any) => {
      if (reserve.symbol.toUpperCase() === `WETH`) {
        return {
          ...reserve,
          symbol: 'ETH',
          originAddress: reserve.underlyingAsset,
          underlyingAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase(),
        };
      }
      return reserve;
    }),
    formattedUserReserves:
      userAddress !== ethers.constants.AddressZero
        ? JSON.parse(JSON.stringify(formattedUserReserves)).map((userReserve: any) => {
            if (userReserve.reserve.symbol.toUpperCase() === `WETH`) {
              return {
                ...userReserve,
                reserve: {
                  ...userReserve.reserve,
                  symbol: 'ETH',
                  originAddress: userReserve.reserve.underlyingAsset,
                  underlyingAsset: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'.toLowerCase(),
                },
              };
            }
            return userReserve;
          })
        : [],
  };
};
