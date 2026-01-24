import { http, createConfig } from "wagmi";
import {
  mainnet,
  sepolia,
  base,
  baseSepolia,
  optimism,
  optimismSepolia,
  arbitrum,
  arbitrumSepolia,
  scroll,
  scrollSepolia,
  linea,
  lineaSepolia,
} from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "";

export const config = createConfig({
  chains: [
    // Mainnets
    mainnet,
    base,
    optimism,
    arbitrum,
    scroll,
    linea,
    // Testnets
    sepolia,
    baseSepolia,
    optimismSepolia,
    arbitrumSepolia,
    scrollSepolia,
    lineaSepolia,
  ],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    // Mainnets
    [mainnet.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [scroll.id]: http(),
    [linea.id]: http(),
    // Testnets
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [scrollSepolia.id]: http(),
    [lineaSepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
