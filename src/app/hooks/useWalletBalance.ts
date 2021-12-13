import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import abi from 'abi/WalletBalanceProvider.json';
import { contract as appContract, Contract } from 'app/contracts/contract';

type WalletBalanceContractData = {
  0: string[];
  1: BigNumber[];
};

interface IBalance {
  [key: string]: string;
}

const useWalletBalance = (
  walletBalanceProvider?: string,
  account?: string | null | undefined,
  providerAddress?: string
): [IBalance, () => void] => {
  const [balance, setBalance] = useState<IBalance>({});

  const fetchData = async () => {
    if (!walletBalanceProvider) return;

    const userAddress = account || ethers.constants.AddressZero;

    try {
      const wallet = await appContract(abi, walletBalanceProvider);
      const { 0: reserves, 1: balances }: WalletBalanceContractData =
        await wallet.getUserWalletBalances(providerAddress, userAddress);
      let obj: IBalance = {};
      reserves.forEach((item, index) => {
        obj[item.toLowerCase()] = balances[index].toString();
      });
      setBalance(obj);
    } catch (error) {
      console.log(error);
    }
  };

  return [balance, fetchData];
};

export default useWalletBalance;
