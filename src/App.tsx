import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Market from './app/containers/market';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Market} />
    </Switch>
  );
};

export default App;
