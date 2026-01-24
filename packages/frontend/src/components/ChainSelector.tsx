import { useState } from "react";
import {
  MAINNET_CHAINS,
  TESTNET_CHAINS,
  type SupportedChain,
} from "../lib/chains";

interface ChainSelectorProps {
  selectedChains: number[];
  onChange: (coinTypes: number[]) => void;
  disabled?: boolean;
}

export function ChainSelector({
  selectedChains,
  onChange,
  disabled,
}: ChainSelectorProps) {
  const [showTestnets, setShowTestnets] = useState(false);

  const currentChains = showTestnets ? TESTNET_CHAINS : MAINNET_CHAINS;

  const handleToggle = (coinType: number) => {
    if (selectedChains.includes(coinType)) {
      onChange(selectedChains.filter((ct) => ct !== coinType));
    } else {
      onChange([...selectedChains, coinType]);
    }
  };

  const handleSelectAll = () => {
    onChange(currentChains.map((c) => c.coinType));
  };

  const handleSelectNone = () => {
    onChange([]);
  };

  const handleNetworkToggle = () => {
    setShowTestnets(!showTestnets);
    onChange([]);
  };

  return (
    <div className="chain-selector">
      <div className="chain-selector-header">
        <h3>Select Chains</h3>
        <div className="chain-selector-actions">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled}
            className="link-btn"
          >
            Select All
          </button>
          <span className="separator">|</span>
          <button
            type="button"
            onClick={handleSelectNone}
            disabled={disabled}
            className="link-btn"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="network-toggle">
        <button
          type="button"
          onClick={handleNetworkToggle}
          disabled={disabled}
          className={`toggle-btn ${!showTestnets ? "active" : ""}`}
        >
          Mainnet
        </button>
        <button
          type="button"
          onClick={handleNetworkToggle}
          disabled={disabled}
          className={`toggle-btn ${showTestnets ? "active" : ""}`}
        >
          Testnet
        </button>
      </div>

      <div className="chain-list">
        {currentChains.map((chain: SupportedChain) => (
          <label key={chain.coinType} className="chain-item">
            <input
              type="checkbox"
              checked={selectedChains.includes(chain.coinType)}
              onChange={() => handleToggle(chain.coinType)}
              disabled={disabled}
            />
            <span className="chain-name">{chain.chain.name}</span>
            <span className="chain-id">Chain ID: {chain.chain.id}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
