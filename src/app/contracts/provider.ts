import * as ethers from 'ethers';

import { NETWORK } from '../config';

const providers: { [network: string]: ethers.providers.JsonRpcProvider } = {};

export const getProvider = (network: string): ethers.providers.JsonRpcProvider => {
  if (!providers[network]) {
    const config = NETWORK[network];
    const jsonRPCUrl = config?.privateJsonRPCUrl || config?.publicJsonRPCUrl;
    if (!jsonRPCUrl) {
      throw new Error(`${network} has no jsonRPCUrl configured`);
    }
    providers[network] = new ethers.providers.JsonRpcProvider(jsonRPCUrl);
  }
  return providers[network];
};

export function getSigner(network: string, account: string): ethers.Signer {
  return getProvider(network).getSigner(account).connectUnchecked();
}
