import { ConnectButton } from "./components/ConnectButton";
import { ReverseRecordForm } from "./components/ReverseRecordForm";
import "./index.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <h1>ENS Reverse Record Setter</h1>
        <p className="subtitle">
          Set your ENS primary name across multiple L2 chains with a single
          signature
        </p>
      </header>

      <main className="main">
        <ConnectButton />
        <ReverseRecordForm />
      </main>

      <footer className="footer">
        <p>
          Powered by{" "}
          <a
            href="https://docs.ens.domains/ensip/19/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ENSIP-19
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
