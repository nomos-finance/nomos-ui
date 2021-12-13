import { Contract, ContractInterface, providers, Signer } from 'ethers';

import { NETWORK } from '../config';

let provider: providers.JsonRpcProvider;

const connect = async (): Promise<any> => {
  return window.ethereum?.request({ method: 'eth_requestAccounts' }).catch((error: any) => {
    if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.error('Please connect to MetaMask.');
    } else {
      console.error(error);
    }
  });
};

const setProvider = async (): Promise<void> => {
  if (window.ethereum) {
    await connect();
    provider = new providers.Web3Provider(window.ethereum);
  } else if (window.web3) {
    provider = new providers.Web3Provider(window.web3.currentProvider);
  } else {
    throw new Error("can't find default provider");
  }
};

const getSigner = async (account: string): Promise<Signer> => {
  return (await getProvider()).getSigner(account).connectUnchecked();
};

export const getProvider = (url?: string): Promise<providers.JsonRpcProvider> => {
  return new Promise(async (resolve, reject) => {
    if (url) {
      resolve(new providers.JsonRpcProvider(url));
    } else if (provider) {
      resolve(provider);
    } else {
      await setProvider();
      resolve(provider);
    }
  });
};

export const contract = async (
  abi: ContractInterface,
  address: string,
  account?: string | null
): Promise<Contract> => {
  if (account) return new Contract(address, abi, await getSigner(account));
  return new Contract(address, abi, await getProvider());
};

export type { Contract };

window.addEventListener('load', async () => {
  setProvider();
});
