import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import type { Address, Hex } from "viem";
import { ChainSelector } from "./ChainSelector";
import { TransactionResults } from "./TransactionResults";
import {
  constructSignatureMessage,
  generateSignatureExpiry,
} from "../lib/signature";
import { setReverseRecords, type ChainResult } from "../lib/api";

export function ReverseRecordForm() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync, isPending: isSigning } = useSignMessage();

  const [ensName, setEnsName] = useState("");
  const [selectedChains, setSelectedChains] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ChainResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    "input" | "signing" | "submitting" | "done"
  >("input");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !ensName || selectedChains.length === 0) return;

    setError(null);
    setResults([]);

    try {
      setStep("signing");
      const signatureExpiry = generateSignatureExpiry();

      // Convert to bigint for viem signature construction
      const coinTypesBigInt = selectedChains.map(BigInt);

      const messageHash = constructSignatureMessage(
        address as Address,
        ensName,
        coinTypesBigInt,
        BigInt(signatureExpiry)
      );

      const signature = await signMessageAsync({
        message: { raw: messageHash },
      });

      setStep("submitting");
      setIsSubmitting(true);

      const response = await setReverseRecords({
        addr: address as Address,
        name: ensName,
        coinTypes: selectedChains,
        signatureExpiry,
        signature: signature as Hex,
      });

      if (response.results) {
        setResults(response.results);
      }

      if (!response.success) {
        setError(response.error || "Failed to set reverse records");
      }

      setStep("done");
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setStep("input");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setResults([]);
    setError(null);
    setStep("input");
  };

  if (!isConnected) {
    return (
      <div className="form-placeholder">
        <p>Connect your wallet to set reverse records</p>
      </div>
    );
  }

  return (
    <div className="reverse-record-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ensName">ENS Name</label>
          <input
            type="text"
            id="ensName"
            value={ensName}
            onChange={(e) => setEnsName(e.target.value)}
            placeholder="vitalik.eth"
            disabled={isSubmitting || isSigning}
            required
          />
          <small>
            The ENS name to set as your primary name on the selected chains
          </small>
        </div>

        <ChainSelector
          selectedChains={selectedChains}
          onChange={setSelectedChains}
          disabled={isSubmitting || isSigning}
        />

        {error && <div className="error-banner">{error}</div>}

        <div className="form-actions">
          {step === "done" ? (
            <button type="button" onClick={handleReset} className="reset-btn">
              Set Another Name
            </button>
          ) : (
            <button
              type="submit"
              disabled={
                !ensName ||
                selectedChains.length === 0 ||
                isSubmitting ||
                isSigning
              }
              className="submit-btn"
            >
              {isSigning
                ? "Waiting for Signature..."
                : isSubmitting
                  ? "Broadcasting Transactions..."
                  : `Sign & Set on ${selectedChains.length} Chain${selectedChains.length !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </form>

      <TransactionResults results={results} />
    </div>
  );
}
