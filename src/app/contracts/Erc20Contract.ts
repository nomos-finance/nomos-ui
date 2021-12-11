import { Contract } from 'ethers';

import { getProvider, getSigner } from './provider';
import abi from 'abi/ERC20.json';

const contract = (address: string, network: string, account?: string | null): Contract => {
  if (account) return new Contract(address, abi, getSigner(network, account));
  return new Contract(address, abi, getProvider(network));
};

export default contract;
