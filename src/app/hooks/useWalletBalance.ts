import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import WalletBalanceProviderContract from '../contracts/WalletBalanceProviderContract';

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
  network?: string,
  providerAddress?: string
): [IBalance, () => void] => {
  const [balance, setBalance] = useState<IBalance>({});

  const fetchData = async () => {
    if (!walletBalanceProvider || !account || !network) return;

    try {
      const { 0: reserves, 1: balances }: WalletBalanceContractData =
        await WalletBalanceProviderContract(walletBalanceProvider, network).getUserWalletBalances(
          providerAddress,
          account
        );
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
