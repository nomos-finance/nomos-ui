import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import VotingEscrowReward from '../contracts/VotingEscrowReward';
import { ethers } from 'ethers';
import useNetworkInfo from '../hooks/useNetworkInfo';
import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';

const useVotingEscrowRewardContract = (): [any | undefined, () => void] => {
  const [contract, setContract] = useState<any>();
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async () => {
    if (!networkInfo?.addresses.VotingEscrowReward || !account) return;

    try {
      const res: any = await VotingEscrowReward(
        networkInfo.addresses.VotingEscrowReward,
        networkInfo.chainKey,
        account
      );
      setContract(res);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setContract(undefined);
    };
  }, [networkInfo, account]);

  return [contract, fetchData];
};

export default useVotingEscrowRewardContract;
