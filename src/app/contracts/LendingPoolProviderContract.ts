import { Contract } from 'ethers';

import { abi } from '../abi/lendingpool/LendingPool.sol/LendingPool.json';
import { getProvider, getSigner } from './provider';

const contract = (address: string, network: string, account?: string | null): Contract => {
  if (account) return new Contract(address, abi, getSigner(network, account));
  return new Contract(address, abi, getProvider(network));
};

export default contract;
