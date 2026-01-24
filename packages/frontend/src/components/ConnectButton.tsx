import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="connect-section">
        <div className="connected-info">
          <span className="address">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <button onClick={() => disconnect()} className="disconnect-btn">
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-section">
      <h3>Connect Wallet</h3>
      <div className="connector-buttons">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isPending}
            className="connect-btn"
          >
            {isPending ? "Connecting..." : connector.name}
          </button>
        ))}
      </div>
    </div>
  );
}
