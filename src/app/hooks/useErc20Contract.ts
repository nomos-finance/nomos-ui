import { useEffect, useState } from 'react';
import useNetworkInfo from './useNetworkInfo';
import { useSelector } from 'react-redux';
import { IRootState } from 'app/reducers/RootState';
import abi from 'abi/ERC20.json';
import { contract as appContract, Contract } from 'app/contracts/contract';

const useErc20Contract = (
  address?: string
): [Contract | undefined, (address?: string) => Promise<Contract | undefined>] => {
  const [contract, setContract] = useState<Contract>();
  const { account } = useSelector((store: IRootState) => store.base);

  const fetchData = async (address?: string) => {
    if (!address || !account) return;
    const res = await appContract(abi, address, account);
    setContract(res);
    return res;
  };

  useEffect(() => {
    fetchData(address);
  }, [account]);

  return [contract, fetchData];
};

export default useErc20Contract;
