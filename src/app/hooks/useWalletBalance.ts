import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import WalletBalanceProviderContract from '../contracts/WalletBalanceProviderContract';
// import { CustomMarket, marketsData } from '../../ui-config';
// import { getNetworkConfig, getProvider } from '../../helpers/markets/markets-data';

type WalletBalanceContractData = {
  0: string[];
  1: BigNumber[];
};

export enum CustomMarket {
  proto_kovan = 'proto_kovan',
  proto_mainnet = 'proto_mainnet',
  proto_avalanche = 'proto_avalanche',
  avalanche_fork = 'avalanche_fork',
  proto_matic = 'proto_matic',
  proto_mumbai = 'proto_mumbai',
  proto_fork = 'proto_fork',
  amm_kovan = 'amm_kovan',
  amm_mainnet = 'amm_mainnet',
  amm_fork = 'amm_fork',
  polygon_fork = 'polygon_fork',
  proto_fuji = 'proto_fuji',
}

const useWalletBalance = async (
  walletBalanceProvider?: string,
  account?: string | null | undefined,
  network?: string,
  providerAddress?: string
) => {
  const [markets, setMarkets] = useState<
    {
      [key in keyof typeof CustomMarket]?: {
        [address: string]: string;
      };
    }
  >({});

  console.log(walletBalanceProvider, account, network, providerAddress);

  const fetchData = async () => {
    if (!walletBalanceProvider || !account || !network) return;
    try {
      const { 0: reserves, 1: balances }: WalletBalanceContractData =
        await WalletBalanceProviderContract(walletBalanceProvider, network).getUserWalletBalances(
          providerAddress,
          account
        );
      console.log(reserves);
      const aggregatedBalance = reserves.reduce((acc, reserve, i) => {
        acc[reserve.toLowerCase()] = balances[i].toString();
        return acc;
      }, {} as { [address: string]: string });
      setMarkets(aggregatedBalance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!account) return;
    setMarkets({});
    fetchData();
    const interval = setInterval(async () => {
      fetchData();
    }, 30000);
    return () => clearInterval(interval);
  }, [account]);

  return;
};

export default useWalletBalance;
