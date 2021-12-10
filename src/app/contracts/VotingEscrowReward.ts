import { Contract } from 'ethers';

import abi from 'abi/VotingEscrowReward.json';
import { getProvider, getSigner } from './provider';

const contract = (address: string, network: string, account?: string | null): Contract => {
  if (account) return new Contract(address, abi, getSigner(network, account));
  return new Contract(address, abi, getProvider(network));
};

export default contract;
