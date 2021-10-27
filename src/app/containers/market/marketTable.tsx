import React, { useRef } from 'react';
import {
  valueToBigNumber,
  normalize,
  ComputedReserveData,
  UserSummaryData,
} from '@aave/protocol-js';
import {
  Borrow,
  Deposit,
  Swap,
  IBorrowDialog,
  IDepositDialog,
  ISwapDialog,
} from '../../components/ChangeDialog/';
import { formatMoney, pow10 } from '../../utils/tool';

interface IProps {
  reserves: ComputedReserveData[];
  usdPriceEth: string;
  balance: IBalance;
  user?: UserSummaryData;
}

interface IBalance {
  [key: string]: string;
}

export default function MarketTable(props: IProps) {
  let totalLockedInUsd = valueToBigNumber('0');
  const marketRefPriceInUsd = normalize(props.usdPriceEth, 18);
  const BorrowDialogRef = useRef<IBorrowDialog>();
  const DepositDialogRef = useRef<IDepositDialog>();

  let sortedData = props.reserves
    .filter((res) => res.isActive)
    .map((reserve) => {
      totalLockedInUsd = totalLockedInUsd.plus(
        valueToBigNumber(reserve.totalLiquidity)
          .multipliedBy(reserve.price.priceInEth)
          .dividedBy(marketRefPriceInUsd)
      );

      const totalLiquidity = Number(reserve.totalLiquidity);
      const totalLiquidityInUSD = valueToBigNumber(reserve.totalLiquidity)
        .multipliedBy(reserve.price.priceInEth)
        .dividedBy(marketRefPriceInUsd)
        .toNumber();

      const totalBorrows = Number(reserve.totalDebt);
      const totalBorrowsInUSD = valueToBigNumber(reserve.totalDebt)
        .multipliedBy(reserve.price.priceInEth)
        .dividedBy(marketRefPriceInUsd)
        .toNumber();

      return {
        reserve,
        totalLiquidity,
        totalLiquidityInUSD,
        totalBorrows: reserve.borrowingEnabled ? totalBorrows : -1,
        totalBorrowsInUSD: reserve.borrowingEnabled ? totalBorrowsInUSD : -1,
        id: reserve.id,
        underlyingAsset: reserve.underlyingAsset,
        currencySymbol: reserve.symbol,
        depositAPY: reserve.borrowingEnabled ? Number(reserve.liquidityRate) : -1,
        avg30DaysLiquidityRate: Number(reserve.avg30DaysLiquidityRate),
        stableBorrowRate:
          reserve.stableBorrowRateEnabled && reserve.borrowingEnabled
            ? Number(reserve.stableBorrowRate)
            : -1,
        variableBorrowRate: reserve.borrowingEnabled ? Number(reserve.variableBorrowRate) : -1,
        avg30DaysVariableRate: Number(reserve.avg30DaysVariableBorrowRate),
        borrowingEnabled: reserve.borrowingEnabled,
        stableBorrowRateEnabled: reserve.stableBorrowRateEnabled,
        isFreezed: reserve.isFrozen,
        aIncentivesAPY: reserve.aIncentivesAPY,
        vIncentivesAPY: reserve.vIncentivesAPY,
        sIncentivesAPY: reserve.sIncentivesAPY,
      };
    });

  return (
    <div className="marketBlock">
      <div className="main">
        <div className="title">存款市场</div>
        <div className="block">
          <table>
            <thead>
              <tr>
                <th>资产</th>
                <th>存款APY</th>
                <th>钱包余额</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() =>
                    DepositDialogRef.current?.show({
                      type: 'Withdraw',
                      data: item.reserve,
                      balance: props.balance[item.underlyingAsset],
                      marketRefPriceInUsd,
                    })
                  }
                >
                  {/* const availableBorrows = availableBorrowsETH.gt(0)
          ? BigNumber.min(
              // one percent margin to don't fail tx
              availableBorrowsETH
                .div(reserve.price.priceInEth)
                .multipliedBy(user && user.totalBorrowsETH !== '0' ? '0.99' : '1'),
              reserve.availableLiquidity
            ).toNumber()
          : 0; */}
                  <td>{item.currencySymbol}</td>
                  <td>{item.depositAPY}</td>
                  <td>
                    {formatMoney(pow10(props.balance[item.underlyingAsset], item.reserve.decimals))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="main">
        <div className="title">贷款市场</div>
        <div className="block">
          <table>
            <thead>
              <tr>
                <th>资产</th>
                <th>stable 贷款APY</th>
                <th>variable 贷款APY</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() =>
                    BorrowDialogRef.current?.show({
                      type: 'Borrow',
                      data: item.reserve,
                      user: props.user,
                    })
                  }
                >
                  <td>{item.currencySymbol}</td>
                  <td>{item.stableBorrowRate}</td>
                  <td>{item.variableBorrowRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Borrow ref={BorrowDialogRef} />
      <Deposit ref={DepositDialogRef} />
    </div>
  );
}
