import { useEffect, useState } from 'react';
import { NETWORK, INetworkData, INetwork } from '../config';
import { useSelector } from 'react-redux';
import { IRootState } from '../reducers/RootState';

const useNetworkInfo = (): [INetworkData | undefined, INetwork] => {
  const { network } = useSelector((store: IRootState) => store.base);
  const [networkInfo, setNetworkInfo] = useState<INetworkData>();

  useEffect(() => {
    if (!network) return;
    const info = NETWORK[network];
    setNetworkInfo(info);
  }, [network]);

  return [networkInfo, NETWORK];
};

export default useNetworkInfo;
