import React, { useState } from 'react';
import { AnimationArrow, DropdownWrapper, useThemeContext } from '@aave/aave-ui-kit';
import { Network } from '@nomosfinance/protocol';

interface SelectPreferredNetworkProps {
  preferredNetwork: Network;
  onSelectPreferredNetwork: (network: Network) => void;
  supportedNetworks: Network[];
}

export default function SelectPreferredNetwork({
  preferredNetwork,
  onSelectPreferredNetwork,
  supportedNetworks,
}: SelectPreferredNetworkProps) {
  const { currentTheme } = useThemeContext();

  const [visible, setVisible] = useState(false);

  const formattedNetwork = (network: Network) =>
    network === Network.mainnet ? 'Ethereum' : network;

  return (
    <div className="SelectPreferredNetwork">
      <DropdownWrapper
        visible={visible}
        setVisible={setVisible}
        buttonComponent={
          <button
            className="SelectPreferredNetwork__select"
            type="button"
            onClick={() => setVisible(true)}
          >
            <span>{formattedNetwork(preferredNetwork)}</span>
            <AnimationArrow
              className="SelectPreferredNetwork__select-arrow"
              active={visible}
              width={12}
              height={6}
              arrowTopPosition={1}
              arrowWidth={7}
              arrowHeight={1}
              color={currentTheme.textDarkBlue.hex}
            />
          </button>
        }
        verticalPosition="bottom"
        horizontalPosition="center"
      >
        {supportedNetworks.map((network) => (
          <button
            type="button"
            className="SelectPreferredNetwork__option"
            onClick={() => {
              onSelectPreferredNetwork(network);
              setVisible(false);
            }}
            key={network}
            disabled={network === preferredNetwork}
          >
            <span>{formattedNetwork(network)}</span>
          </button>
        ))}
      </DropdownWrapper>
    </div>
  );
}
