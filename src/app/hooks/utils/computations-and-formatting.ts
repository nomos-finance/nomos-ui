import BigNumber from 'bignumber.js';

import {
  BigNumberValue,
  valueToBigNumber,
  valueToZDBigNumber,
  normalize,
  pow10,
  normalizeBN,
} from './helpers/bignumber';
import {
  calculateAvailableBorrowsETH,
  calculateHealthFactorFromBalances,
  getCompoundedBalance,
  getCompoundedStableBalance,
  calculateAverageRate,
  LTV_PRECISION,
  calculateCompoundedInterest,
  getLinearBalance,
} from './helpers/pool-math';
import { RAY, rayDiv, rayMul, rayPow } from './helpers/ray-math';
import {
  ComputedUserReserve,
  ReserveData,
  UserReserveData,
  UserSummaryData,
  ReserveRatesData,
  ComputedReserveData,
  Supplies,
  ReserveSupplyData,
  RewardsInformation,
} from './types';
import { ETH_DECIMALS, RAY_DECIMALS, SECONDS_PER_YEAR, USD_DECIMALS } from './helpers/constants';

export function getEthAndUsdBalance(
  balance: BigNumberValue,
  priceInEth: BigNumberValue,
  decimals: number,
  usdPriceEth: BigNumberValue
): [string, string] {
  const balanceInEth = valueToZDBigNumber(balance)
    .multipliedBy(priceInEth)
    .dividedBy(pow10(decimals));
  const balanceInUsd = balanceInEth
    .multipliedBy(pow10(USD_DECIMALS))
    .dividedBy(usdPriceEth)
    .toFixed(0);
  return [balanceInEth.toString(), balanceInUsd];
}

export function computeUserReserveData(
  poolReserve: ReserveData,
  userReserve: UserReserveData,
  currentTimestamp: number
): ComputedUserReserve {
  const underlyingBalance = getLinearBalance(
    userReserve.scaledATokenBalance,
    poolReserve.liquidityIndex,
    poolReserve.liquidityRate,
    poolReserve.lastUpdateTimestamp,
    currentTimestamp
  ).toString();

  const variableBorrows = getCompoundedBalance(
    userReserve.scaledVariableDebt,
    poolReserve.variableBorrowIndex,
    poolReserve.variableBorrowRate,
    poolReserve.lastUpdateTimestamp,
    currentTimestamp
  ).toString();

  const stableBorrows = getCompoundedStableBalance(
    userReserve.principalStableDebt,
    poolReserve.stableBorrowRate,
    userReserve.stableBorrowLastUpdateTimestamp,
    currentTimestamp
  ).toString();

  const { totalLiquidity, totalStableDebt, totalVariableDebt } = calculateSupplies(
    {
      totalScaledVariableDebt: poolReserve.totalScaledVariableDebt,
      variableBorrowIndex: poolReserve.variableBorrowIndex,
      variableBorrowRate: poolReserve.variableBorrowRate,
      totalPrincipalStableDebt: poolReserve.totalPrincipalStableDebt,
      averageStableRate: poolReserve.averageStableRate,
      availableLiquidity: poolReserve.availableLiquidity,
      stableDebtLastUpdateTimestamp: poolReserve.stableDebtLastUpdateTimestamp,
      lastUpdateTimestamp: poolReserve.lastUpdateTimestamp,
    },
    currentTimestamp
  );

  const exactStableBorrowRate = rayPow(
    valueToZDBigNumber(userReserve.stableBorrowRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
    SECONDS_PER_YEAR
  ).minus(RAY);

  return {
    ...userReserve,
    underlyingBalance,
    variableBorrows,
    stableBorrows,
    totalBorrows: valueToZDBigNumber(variableBorrows).plus(stableBorrows).toString(),
    stableBorrowAPR: normalize(userReserve.stableBorrowRate, RAY_DECIMALS),
    stableBorrowAPY: normalize(exactStableBorrowRate, RAY_DECIMALS),
  };
}

export function computeRawUserSummaryData(
  poolReservesData: ReserveData[],
  rawUserReserves: UserReserveData[],
  userId: string,
  currentTimestamp: number
): UserSummaryData {
  const userReservesData = rawUserReserves
    .map((userReserve) => {
      const poolReserve = poolReservesData.find((reserve) => reserve.id === userReserve.reserve.id);
      if (!poolReserve) {
        throw new Error('Reserve is not registered on platform, please contact support');
      }
      const computedUserReserve = computeUserReserveData(
        poolReserve,
        userReserve,
        currentTimestamp
      );

      return computedUserReserve;
    })
    .sort((a, b) =>
      a.reserve.symbol > b.reserve.symbol ? 1 : a.reserve.symbol < b.reserve.symbol ? -1 : 0
    );

  return {
    id: userId,
    reservesData: userReservesData,
  };
}

export function formatUserSummaryData(
  poolReservesData: ReserveData[],
  rawUserReserves: UserReserveData[],
  userId: string,
  currentTimestamp: number
): UserSummaryData {
  const userData = computeRawUserSummaryData(
    poolReservesData,
    rawUserReserves,
    userId,
    currentTimestamp
  );
  const userReservesData = userData.reservesData.map(
    ({ reserve, ...userReserve }): ComputedUserReserve => {
      const reserveDecimals = reserve.decimals;

      const exactStableBorrowRate = rayPow(
        valueToZDBigNumber(userReserve.stableBorrowRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
        SECONDS_PER_YEAR
      ).minus(RAY);

      return {
        ...userReserve,
        reserve: {
          ...reserve,
          reserveLiquidationBonus: normalize(
            valueToBigNumber(reserve.reserveLiquidationBonus).minus(pow10(LTV_PRECISION)),
            4
          ),
        },
        scaledATokenBalance: normalize(userReserve.scaledATokenBalance, reserveDecimals),
        stableBorrowAPR: normalize(userReserve.stableBorrowRate, RAY_DECIMALS),
        stableBorrowAPY: normalize(exactStableBorrowRate, RAY_DECIMALS),
        variableBorrowIndex: normalize(userReserve.variableBorrowIndex, RAY_DECIMALS),
        underlyingBalance: normalize(userReserve.underlyingBalance, reserveDecimals),
        stableBorrows: normalize(userReserve.stableBorrows, reserveDecimals),
        variableBorrows: normalize(userReserve.variableBorrows, reserveDecimals),
        totalBorrows: normalize(userReserve.totalBorrows, reserveDecimals),
      };
    }
  );
  return {
    id: userData.id,
    reservesData: userReservesData,
  };
}

/**
 * Calculates the formatted debt accrued to a given point in time.
 * @param reserve
 * @param currentTimestamp unix timestamp which must be higher than reserve.lastUpdateTimestamp
 */
export function calculateReserveDebt(reserve: ReserveData, currentTimestamp: number) {
  const totalVariableDebt = normalize(
    rayMul(
      rayMul(reserve.totalScaledVariableDebt, reserve.variableBorrowIndex),
      calculateCompoundedInterest(
        reserve.variableBorrowRate,
        currentTimestamp,
        reserve.lastUpdateTimestamp
      )
    ),
    reserve.decimals
  );
  const totalStableDebt = normalize(
    rayMul(
      reserve.totalPrincipalStableDebt,
      calculateCompoundedInterest(
        reserve.averageStableRate,
        currentTimestamp,
        reserve.stableDebtLastUpdateTimestamp
      )
    ),
    reserve.decimals
  );
  return { totalVariableDebt, totalStableDebt };
}

export function formatReserves(
  reserves: ReserveData[],
  currentTimestamp?: number
): ComputedReserveData[] {
  return reserves.map((reserve) => {
    const availableLiquidity = normalize(reserve.availableLiquidity, reserve.decimals);

    const { totalVariableDebt, totalStableDebt } = calculateReserveDebt(
      reserve,
      currentTimestamp || reserve.lastUpdateTimestamp
    );

    const totalDebt = valueToBigNumber(totalStableDebt).plus(totalVariableDebt);

    const totalLiquidity = totalDebt.plus(availableLiquidity).toString();
    const utilizationRate =
      totalLiquidity !== '0' ? totalDebt.dividedBy(totalLiquidity).toString() : '0';

    const supplyAPY = rayPow(
      valueToZDBigNumber(reserve.liquidityRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
      SECONDS_PER_YEAR
    ).minus(RAY);

    const variableBorrowAPY = rayPow(
      valueToZDBigNumber(reserve.variableBorrowRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
      SECONDS_PER_YEAR
    ).minus(RAY);

    const stableBorrowAPY = rayPow(
      valueToZDBigNumber(reserve.stableBorrowRate).dividedBy(SECONDS_PER_YEAR).plus(RAY),
      SECONDS_PER_YEAR
    ).minus(RAY);

    return {
      ...reserve,
      totalVariableDebt,
      totalStableDebt,
      totalLiquidity,
      availableLiquidity,
      utilizationRate,
      totalDebt: totalDebt.toString(),
      baseLTVasCollateral: normalize(reserve.baseLTVasCollateral, LTV_PRECISION),
      reserveFactor: normalize(reserve.reserveFactor, LTV_PRECISION),
      variableBorrowAPR: normalize(reserve.variableBorrowRate, RAY_DECIMALS),
      variableBorrowAPY: normalize(variableBorrowAPY, RAY_DECIMALS),
      stableBorrowAPR: normalize(reserve.stableBorrowRate, RAY_DECIMALS),
      stableBorrowAPY: normalize(stableBorrowAPY, RAY_DECIMALS),
      supplyAPR: normalize(reserve.liquidityRate, RAY_DECIMALS),
      supplyAPY: normalize(supplyAPY, RAY_DECIMALS),
      liquidityIndex: normalize(reserve.liquidityIndex, RAY_DECIMALS),
      reserveLiquidationThreshold: normalize(reserve.reserveLiquidationThreshold, 4),
      reserveLiquidationBonus: normalize(
        valueToBigNumber(reserve.reserveLiquidationBonus).minus(10 ** LTV_PRECISION),
        4
      ),
      totalScaledVariableDebt: normalize(reserve.totalScaledVariableDebt, reserve.decimals),
      totalPrincipalStableDebt: normalize(reserve.totalPrincipalStableDebt, reserve.decimals),
      variableBorrowIndex: normalize(reserve.variableBorrowIndex, RAY_DECIMALS),
    };
  });
}

/**
 * Calculates the debt accrued to a given point in time.
 * @param reserve
 * @param currentTimestamp unix timestamp which must be higher than reserve.lastUpdateTimestamp
 */
export function calculateReserveDebtSuppliesRaw(
  reserve: ReserveSupplyData,
  currentTimestamp: number
) {
  const totalVariableDebt = rayMul(
    rayMul(reserve.totalScaledVariableDebt, reserve.variableBorrowIndex),
    calculateCompoundedInterest(
      reserve.variableBorrowRate,
      currentTimestamp,
      reserve.lastUpdateTimestamp
    )
  );
  const totalStableDebt = rayMul(
    reserve.totalPrincipalStableDebt,
    calculateCompoundedInterest(
      reserve.averageStableRate,
      currentTimestamp,
      reserve.stableDebtLastUpdateTimestamp
    )
  );
  return { totalVariableDebt, totalStableDebt };
}

export function calculateSupplies(reserve: ReserveSupplyData, currentTimestamp: number): Supplies {
  const { totalVariableDebt, totalStableDebt } = calculateReserveDebtSuppliesRaw(
    reserve,
    currentTimestamp
  );

  const totalDebt = totalVariableDebt.plus(totalStableDebt);

  const totalLiquidity = totalDebt.plus(reserve.availableLiquidity);
  return {
    totalVariableDebt,
    totalStableDebt,
    totalLiquidity,
  };
}

export function calculateIncentivesAPY(
  emissionPerSecond: string,
  rewardTokenPriceInEth: string,
  tokenTotalSupplyNormalized: string,
  tokenPriceInEth: string
): string {
  const emissionPerSecondNormalized = normalizeBN(emissionPerSecond, ETH_DECIMALS).multipliedBy(
    rewardTokenPriceInEth
  );
  const emissionPerYear = emissionPerSecondNormalized.multipliedBy(SECONDS_PER_YEAR);

  const totalSupplyNormalized = valueToBigNumber(tokenTotalSupplyNormalized).multipliedBy(
    tokenPriceInEth
  );

  return emissionPerYear.dividedBy(totalSupplyNormalized).toString(10);
}

export function calculateRewards(
  principalUserBalance: string,
  reserveIndex: string,
  userIndex: string,
  precision: number,
  rewardTokenDecimals: number,
  reserveIndexTimestamp: number,
  emissionPerSecond: string,
  totalSupply: BigNumber,
  currentTimestamp: number,
  emissionEndTimestamp: number
): string {
  const actualCurrentTimestamp =
    currentTimestamp > emissionEndTimestamp ? emissionEndTimestamp : currentTimestamp;

  const timeDelta = actualCurrentTimestamp - reserveIndexTimestamp;

  let currentReserveIndex;
  if (reserveIndexTimestamp == +currentTimestamp || reserveIndexTimestamp >= emissionEndTimestamp) {
    currentReserveIndex = valueToZDBigNumber(reserveIndex);
  } else {
    currentReserveIndex = valueToZDBigNumber(emissionPerSecond)
      .multipliedBy(timeDelta)
      .multipliedBy(pow10(precision))
      .dividedBy(totalSupply)
      .plus(reserveIndex);
  }

  const reward = valueToZDBigNumber(principalUserBalance)
    .multipliedBy(currentReserveIndex.minus(userIndex))
    .dividedBy(pow10(precision));

  return normalize(reward, rewardTokenDecimals);
}
