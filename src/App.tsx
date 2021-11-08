import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Market from './app/containers/market';
import Dao from './app/containers/dao';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/dao" component={Dao} />
      <Route path="/" component={Market} />
    </Switch>
  );
};

export default App;
