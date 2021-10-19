import './assets/index.scss';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import * as serviceWorker from './serviceWorker';
import App from './App';
import { ThemeProvider } from './app/theme';
import './app/utils/i18n';
import { Provider } from 'react-redux';
import store from './app/store';

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <HashRouter>
        <Web3ReactProvider getLibrary={(provider) => new ethers.providers.Web3Provider(provider)}>
          <App />
        </Web3ReactProvider>
      </HashRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
