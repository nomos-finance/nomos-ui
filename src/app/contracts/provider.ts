import * as ethers from 'ethers';

import { NETWORK } from '../config';

const providers: { [network: string]: ethers.providers.Provider } = {};

export const getProvider = (network: string): ethers.providers.Provider => {
  if (!providers[network]) {
    const config = NETWORK[network];
    const jsonRPCUrl = config?.privateJsonRPCUrl || config?.publicJsonRPCUrl;
    if (!jsonRPCUrl) {
      throw new Error(`${network} has no jsonRPCUrl configured`);
    }
    providers[network] = new ethers.providers.StaticJsonRpcProvider(jsonRPCUrl);
  }
  return providers[network];
};
