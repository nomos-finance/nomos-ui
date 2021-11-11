import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Market from './app/containers/market';
import Data from './app/containers/data';
import Dao from './app/containers/dao';
import Voting from './app/containers/voting';
import Staking from './app/containers/staking';
import Position from './app/containers/position';
import Protocol from './app/containers/protocol';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/data" component={Data} />
      <Route path="/dao" component={Dao} />
      <Route path="/voting" component={Voting} />
      <Route path="/staking" component={Staking} />
      <Route path="/position" component={Position} />
      <Route path="/protocol" component={Protocol} />
      <Route path="/" component={Market} />
    </Switch>
  );
};

export default App;
