import type { ChainResult } from "../lib/api";
import { getChainByCoinType } from "../lib/chains";

interface TransactionResultsProps {
  results: ChainResult[];
}

export function TransactionResults({ results }: TransactionResultsProps) {
  if (results.length === 0) return null;

  const getExplorerUrl = (chainId: number, txHash: string): string => {
    const explorers: Record<number, string> = {
      // Mainnets
      8453: "https://basescan.org/tx/",
      10: "https://optimistic.etherscan.io/tx/",
      42161: "https://arbiscan.io/tx/",
      534352: "https://scrollscan.com/tx/",
      59144: "https://lineascan.build/tx/",
      // Testnets
      84532: "https://sepolia.basescan.org/tx/",
      11155420: "https://sepolia-optimism.etherscan.io/tx/",
      421614: "https://sepolia.arbiscan.io/tx/",
      534351: "https://sepolia.scrollscan.com/tx/",
      59141: "https://sepolia.lineascan.build/tx/",
    };
    const baseUrl = explorers[chainId] || "";
    return baseUrl ? `${baseUrl}${txHash}` : "";
  };

  return (
    <div className="transaction-results">
      <h3>Transaction Results</h3>
      <div className="results-list">
        {results.map((result) => {
          const chain = getChainByCoinType(result.coinType);
          const explorerUrl = result.transactionHash
            ? getExplorerUrl(result.chainId, result.transactionHash)
            : "";

          return (
            <div
              key={result.coinType}
              className={`result-item status-${result.status}`}
            >
              <div className="result-header">
                <span className="chain-name">
                  {chain?.chain.name || result.chainName}
                </span>
                <span className={`status-badge ${result.status}`}>
                  {result.status}
                </span>
              </div>
              {result.transactionHash && (
                <div className="tx-hash">
                  {explorerUrl ? (
                    <a
                      href={explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.transactionHash.slice(0, 10)}...
                      {result.transactionHash.slice(-8)}
                    </a>
                  ) : (
                    <span>
                      {result.transactionHash.slice(0, 10)}...
                      {result.transactionHash.slice(-8)}
                    </span>
                  )}
                </div>
              )}
              {result.error && (
                <div className="error-message">{result.error}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
