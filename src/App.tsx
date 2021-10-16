import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { useStaticPoolDataContext } from './libs/pool-data-provider';
import { CURRENCY_ROUTE_PARAMS } from './helpers/router-types';
import ScreensWrapper from './components/wrappers/ScreensWrapper';

import {
  Markets,
  ReserveOverview,
  History,
  Deposit,
  Withdraw,
  Borrow,
  Repay,
  Faucet,
  Dashboard,
  Governance,
  Staking,
  AssetSwap,
} from './modules';
import SwapBorrowRateModeConfirmation from './modules/swap/SwapBorrowRateModeConfirmation';
import SwapUsageAsCollateralModeConfirmation from './modules/swap/SwapUsageAsCollateralModeConfirmation';
import { RewardConfirm } from './modules/reward/screens/RewardConfirm';
import { governanceConfig, stakeConfig } from './ui-config';
import { useProtocolDataContext } from './libs/protocol-data-provider';
import { isFeatureEnabled } from './helpers/markets/markets-data';
import Menu from './components/menu/Menu';

import Market from './app/containers/market';

function ModulesWithMenu() {
  const { isUserHasDeposits, userId } = useStaticPoolDataContext();
  const { currentMarketData } = useProtocolDataContext();

  return (
    <ScreensWrapper>
      <Switch>
        <Route path="/markets" component={Markets} />
        <Route path="/dashboard" component={Dashboard} />

        <Route path="/deposit" component={Deposit} />
        <Route path={`/withdraw/${CURRENCY_ROUTE_PARAMS}`} component={Withdraw} />

        <Route path="/borrow" component={Borrow} />
        <Route path={`/repay/${CURRENCY_ROUTE_PARAMS}`} component={Repay} />

        <Route
          exact={true}
          path={`/interest-swap/${CURRENCY_ROUTE_PARAMS}/confirmation`}
          component={SwapBorrowRateModeConfirmation}
        />

        <Route
          exact={true}
          path={`/usage-as-collateral/${CURRENCY_ROUTE_PARAMS}/confirmation`}
          component={SwapUsageAsCollateralModeConfirmation}
        />

        <Route
          exact={true}
          path={`/reserve-overview/${CURRENCY_ROUTE_PARAMS}`}
          component={ReserveOverview}
        />

        {!!governanceConfig && [
          <Route path="/governance" component={Governance} key="Governance" />,
        ]}
        {!!stakeConfig && [<Route path="/staking" component={Staking} key="Staking" />]}

        <Route path="/asset-swap" component={AssetSwap} key="AssetSwap" />
        <Route path="/rewards/confirm" component={RewardConfirm} key="Reward confirm" />

        {userId && [<Route exact={true} path="/history" component={History} key="History" />]}

        {isFeatureEnabled.faucet(currentMarketData) && [
          <Route path="/faucet" component={Faucet} key="Faucet" />,
        ]}

        <Redirect to={isUserHasDeposits ? '/dashboard' : '/markets'} />
      </Switch>
    </ScreensWrapper>
  );
}

const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/markets" component={Market} />
    </Switch>
  );
};

export default App;
