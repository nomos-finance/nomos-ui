export interface INetworkData {
  chainId: number;
  chainKey: string;
  chainName: string;
  publicJsonRPCUrl?: string;
  publicJsonRPCWSUrl?: string;
  privateJsonRPCUrl?: string;
  privateJsonRPCWSUrl?: string;
  walletBalanceProvider: string;
  uiPoolDataProvider: string;
  baseUniswapAdapter: string;
  rewardTokenSymbol?: string;
  rewardTokenAddress: string;
  rewardTokenDecimals: number;
  incentivePrecision: number;
  // market
  addresses: {
    LENDING_POOL_ADDRESS_PROVIDER: string;
    LENDING_POOL: string;
    WETH_GATEWAY?: string;
    SWAP_COLLATERAL_ADAPTER?: string;
    REPAY_WITH_COLLATERAL_ADAPTER?: string;
    FAUCET?: string;
    PERMISSION_MANAGER?: string;
  };
  incentives?: {
    INCENTIVES_CONTROLLER: string;
    INCENTIVES_CONTROLLER_REWARD_TOKEN: string;
  };
}
export interface INetwork {
  [key: string]: INetworkData;
}

export const NETWORK: INetwork = {
  mainnet: {
    chainId: 1,
    chainKey: 'mainnet',
    chainName: 'Mainnet',
    publicJsonRPCUrl: 'https://eth-mainnet.alchemyapi.io/v2/demo',
    publicJsonRPCWSUrl: 'wss://eth-mainnet.alchemyapi.io/v2/demo',
    walletBalanceProvider: '',
    uiPoolDataProvider: '0xcF08ebFF887D91AbA3Afc47f2eBFe720525B4C8E',
    baseUniswapAdapter: '',
    rewardTokenSymbol: 'stkAAVE',
    rewardTokenAddress: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    rewardTokenDecimals: 18,
    incentivePrecision: 18,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x67FB118A780fD740C8936511947cC4bE7bb7730c',
      LENDING_POOL: '0x762E2a3BBe729240ea44D31D5a81EAB44d34ef01',
      WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
      FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
    },
  },
  kovan: {
    chainId: 42,
    chainKey: 'kovan',
    chainName: 'Kovan',
    publicJsonRPCUrl: 'https://kovan.poa.network',
    // walletBalanceProvider: '0x16870ee700a556fE25F17345EF5E72324aCa3711',
    // uiPoolDataProvider: '0xcF08ebFF887D91AbA3Afc47f2eBFe720525B4C8E',
    walletBalanceProvider: '0x07DC923859b68e9399d787bf52c4Aa9eBe3490aF',
    uiPoolDataProvider: '0x04110Dc40B04b99B94840E53B2a33bE45E45A8Ed',
    baseUniswapAdapter: '',
    rewardTokenSymbol: 'stkAAVE',
    rewardTokenAddress: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    rewardTokenDecimals: 18,
    incentivePrecision: 18,
    addresses: {
      // LENDING_POOL_ADDRESS_PROVIDER: '0x04110Dc40B04b99B94840E53B2a33bE45E45A8Ed',
      // LENDING_POOL: '0x762E2a3BBe729240ea44D31D5a81EAB44d34ef01',
      // WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
      // FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
      LENDING_POOL_ADDRESS_PROVIDER: '0x88757f2f99175387ab4c6a4b3067c77a695b0349'.toLowerCase(),
      LENDING_POOL: '0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe',
      WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
      FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
    },
    incentives: {
      INCENTIVES_CONTROLLER: '0x01d83fe6a10d2f2b7af17034343746188272cac9',
      INCENTIVES_CONTROLLER_REWARD_TOKEN: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    },
  },
  polygon: {
    chainId: 137,
    chainKey: 'polygon',
    chainName: 'Polygon',
    publicJsonRPCUrl: 'https://polygon-rpc.com',
    publicJsonRPCWSUrl: 'wss://polygon-rpc.com',
    walletBalanceProvider: '',
    uiPoolDataProvider: '0xcF08ebFF887D91AbA3Afc47f2eBFe720525B4C8E',
    baseUniswapAdapter: '',
    rewardTokenSymbol: 'stkAAVE',
    rewardTokenAddress: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    rewardTokenDecimals: 18,
    incentivePrecision: 18,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x67FB118A780fD740C8936511947cC4bE7bb7730c',
      LENDING_POOL: '0x762E2a3BBe729240ea44D31D5a81EAB44d34ef01',
      WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
      FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
    },
  },
  avalanche: {
    chainId: 43114,
    chainKey: 'avalanche',
    chainName: 'Avalanche',
    walletBalanceProvider: '',
    uiPoolDataProvider: '0xcF08ebFF887D91AbA3Afc47f2eBFe720525B4C8E',
    baseUniswapAdapter: '',
    rewardTokenSymbol: 'stkAAVE',
    rewardTokenAddress: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    rewardTokenDecimals: 18,
    incentivePrecision: 18,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x67FB118A780fD740C8936511947cC4bE7bb7730c',
      LENDING_POOL: '0x762E2a3BBe729240ea44D31D5a81EAB44d34ef01',
      WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
      FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
    },
  },
  arbitrum_one: {
    chainId: 42161,
    chainKey: 'arbitrum_one',
    chainName: 'Arbitrum One',
    publicJsonRPCUrl: 'https://arb1.arbitrum.io/rpc',
    walletBalanceProvider: '',
    uiPoolDataProvider: '0xcF08ebFF887D91AbA3Afc47f2eBFe720525B4C8E',
    baseUniswapAdapter: '',
    rewardTokenSymbol: 'stkAAVE',
    rewardTokenAddress: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    rewardTokenDecimals: 18,
    incentivePrecision: 18,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x67FB118A780fD740C8936511947cC4bE7bb7730c',
      LENDING_POOL: '0x762E2a3BBe729240ea44D31D5a81EAB44d34ef01',
      WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
      FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
    },
  },
  arbitrum_rinkeby: {
    chainId: 421611,
    publicJsonRPCUrl: 'https://rinkeby.arbitrum.io/rpc',
    chainKey: 'arbitrum_rinkeby',
    chainName: 'Arbitrum Rinkeby',
    walletBalanceProvider: '',
    uiPoolDataProvider: '0xcF08ebFF887D91AbA3Afc47f2eBFe720525B4C8E',
    baseUniswapAdapter: '',
    rewardTokenSymbol: 'stkAAVE',
    rewardTokenAddress: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    rewardTokenDecimals: 18,
    incentivePrecision: 18,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0x67FB118A780fD740C8936511947cC4bE7bb7730c',
      LENDING_POOL: '0x762E2a3BBe729240ea44D31D5a81EAB44d34ef01',
      WETH_GATEWAY: '0xA61ca04DF33B72b235a8A28CfB535bb7A5271B70',
      FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604',
    },
  },
};

export const SupportedNetworks = [
  // NETWORK[isTest ? 'kovan' : 'mainnet'],
  NETWORK['kovan'],
  NETWORK['polygon'],
  NETWORK['avalanche'],
  NETWORK['arbitrum_rinkeby'],
  // NETWORK[isTest ? 'arbitrum_rinkeby' : 'arbitrum_one'],
];

export const supportedChainIds = (() => {
  const arr: Array<number> = [];

  Object.values(NETWORK).forEach((item) => {
    arr.push(item.chainId);
  });

  return arr;
})();
