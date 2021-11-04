/*eslint-disable import/no-anonymous-default-export */
import { assetsList, getAssetInfoFactory } from '@aave/aave-ui-kit';
import React from 'react';

interface IProps {
  symbol?: string;
  size?: number;
}

const getAssetInfo = getAssetInfoFactory(assetsList);

export default (props: IProps): React.ReactElement | null => {
  return props.symbol ? (
    <div
      className="symbolIcon"
      style={{ width: props.size || 32, height: props.size || 32, display: 'inline-block' }}
    >
      <img
        src={getAssetInfo(props.symbol).icon}
        alt=""
        style={{ width: '100%', display: 'inline-block' }}
      />
    </div>
  ) : null;
};
