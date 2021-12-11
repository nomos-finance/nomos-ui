import { useEffect, useState } from 'react';
import Erc20Contract from '../contracts/Erc20Contract';
import useNetworkInfo from './useNetworkInfo';
import { Contract } from 'ethers';
import { useSelector } from 'react-redux';
import { IRootState } from 'app/reducers/RootState';

const useErc20Contract = (
  address?: string
): [Contract | undefined, (address?: string) => Promise<Contract | undefined>] => {
  const [networkInfo] = useNetworkInfo();
  const [contract, setContract] = useState<Contract>();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async (address?: string) => {
    if (!networkInfo || !address || !account) return;
    const res = Erc20Contract(address, networkInfo?.chainKey, account);
    setContract(res);
    return res;
  };

  useEffect(() => {
    fetchData(address);
  }, [networkInfo, account]);

  return [contract, fetchData];
};

export default useErc20Contract;
