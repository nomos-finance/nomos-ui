import { Contract } from 'ethers';

import { abi } from '../abi/misc/WalletBalanceProvider.sol/WalletBalanceProvider.json';
import { getProvider } from './provider';

const contract = (address: string, network: string): Contract => {
  return new Contract(address, abi, getProvider(network));
};

export default contract;