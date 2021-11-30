import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Lending from './app/containers/lending';
import Market from './app/containers/market';
import Dao from './app/containers/dao';
import Governance from './app/containers/governance';
import GovernanceDetail from './app/containers/governance/governanceDetail';
import Staking from './app/containers/staking';
import Notification from './app/containers/notification';
import Subprotocol from './app/containers/subprotocol';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/market" component={Market} />
      <Route path="/dao" component={Dao} />
      <Route path="/governance/detail/:id" component={GovernanceDetail} exact />
      <Route path="/governance" component={Governance} />
      <Route path="/staking" component={Staking} />
      <Route path="/notification" component={Notification} />
      <Route path="/subprotocol" component={Subprotocol} />
      <Route path="/" component={Lending} />
    </Switch>
  );
};

export default App;
