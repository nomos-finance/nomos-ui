import { useEffect, useState } from 'react';
import { NETWORK, INetworkData } from '../config';
import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';

const useNetworkInfo = (): [INetworkData | undefined] => {
  const { network } = useSelector((store: IRootState) => store.base);
  const [networkInfo, setNetworkInfo] = useState<INetworkData>();

  useEffect(() => {
    if (!network) return;
    const info = NETWORK[network];
    setNetworkInfo(info);
  }, [network]);

  return [networkInfo];
};

export default useNetworkInfo;
