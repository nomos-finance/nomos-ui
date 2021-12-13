import { useEffect, useState } from 'react';
import useNetworkInfo from '../hooks/useNetworkInfo';
import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';
import abi from 'abi/VotingEscrowReward.json';
import { contract as appContract, Contract } from 'app/contracts/contract';

const useVotingEscrowRewardContract = (): [Contract | undefined, () => void] => {
  const [contract, setContract] = useState<Contract>();
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async () => {
    if (!networkInfo?.addresses.VotingEscrowReward || !account) return;

    try {
      const res = await appContract(abi, networkInfo.addresses.VotingEscrowReward, account);
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
