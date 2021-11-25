import { Contract } from 'ethers';

import { getProvider } from './provider';
import abi from 'abi/ERC20.json';

const contract = (address: string, network: string): Contract => {
  return new Contract(address, abi, getProvider(network));
};

export default contract;
