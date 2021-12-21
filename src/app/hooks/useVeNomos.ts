import { useEffect, useState } from 'react';
import useNetworkInfo from './useNetworkInfo';
import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';
import abi from 'abi/VotingEscrow.json';
import { contract as appContract, Contract } from 'app/contracts/contract';

const useVeNomos = (): [Contract | undefined, () => void] => {
  const [contract, setContract] = useState<Contract>();
  const [networkInfo] = useNetworkInfo();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async () => {
    if (!networkInfo?.addresses.veNomos || !account) return;

    try {
      const res = await appContract(abi, networkInfo.addresses.veNomos, account);
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

export default useVeNomos;
