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
    [key: string]: string;
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
    walletBalanceProvider: '0x35196997299F6B5EAa621C38c60c9728DcA968A8',
    uiPoolDataProvider: '0x1BEeb7d42bbE40157e5B9Bf79e746b490CB2F9E3',
    baseUniswapAdapter: '',
    rewardTokenSymbol: 'stkAAVE',
    rewardTokenAddress: '0xb597cd8d3217ea6477232f9217fa70837ff667af',
    rewardTokenDecimals: 18,
    incentivePrecision: 18,
    addresses: {
      LENDING_POOL_ADDRESS_PROVIDER: '0xd09E6705210924dd5465af93Ce34580D6e0672A3',
      LENDING_POOL: '0xd1810e4bE9bf1dA552c6167514622d41d168b266',
      WETH_GATEWAY: '0xfB3B2E4Be1c2d40Ad83eb588A27fD4CAD57e489c',
      FAUCET: '0x600103d518cC5E8f3319D532eB4e5C268D32e604', //
      Nomos: '0xE2892084f7bbBB485F869930D10f52c19fD450Fb',
      veNomos: '0xe4303e401dcf9257FB477621b7dB96189516dFd0',
      VotingEscrowReward: '0xcfc0E1167BA7e462b6063F68FcB04cfcFB3F24cf',
      LendingDAO: '0x77C136034d5B3D5E3556B13fc73B6F86f88D4F3D',
      AaveOracle: '0x3DBf9Fb6929D573C07EAD7F75f26248648c4C89C',
    },
    incentives: {
      //
      INCENTIVES_CONTROLLER: '0x77C136034d5B3D5E3556B13fc73B6F86f88D4F3D',
      INCENTIVES_CONTROLLER_REWARD_TOKEN: '0xe4303e401dcf9257FB477621b7dB96189516dFd0',
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

export function getFortmaticKeyByNetwork(network: string): string {
  if (network === NETWORK.mainnet.chainKey) {
    return process.env.REACT_APP_FORTMATIC_KEY_MAINNET || '';
  } else {
    return process.env.REACT_APP_FORTMATIC_KEY_TESTNET || '';
  }
}

export const getNetworkByChainId = (id: number): INetworkData | undefined => {
  return Object.values(NETWORK).filter((item) => item.chainId === id)[0];
};
