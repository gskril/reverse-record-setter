import type { ChainResult } from "../lib/api";
import { getChainByCoinType } from "shared/chains";

interface TransactionResultsProps {
  results: ChainResult[];
}

export function TransactionResults({ results }: TransactionResultsProps) {
  if (results.length === 0) return null;

  const getExplorerUrl = (coinType: bigint, txHash: string): string => {
    const chain = getChainByCoinType(coinType);
    const explorerUrl = chain?.chain.blockExplorers?.default?.url;
    return explorerUrl ? `${explorerUrl}/tx/${txHash}` : "";
  };

  return (
    <div className="transaction-results">
      <h3>Transaction Results</h3>
      <div className="results-list">
        {results.map((result) => {
          const chain = getChainByCoinType(result.coinType);
          const explorerUrl = result.transactionHash
            ? getExplorerUrl(result.coinType, result.transactionHash)
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
