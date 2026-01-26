import { createConfig, http } from "wagmi";
import {
  arbitrum,
  arbitrumSepolia,
  base,
  baseSepolia,
  linea,
  lineaSepolia,
  mainnet,
  optimism,
  optimismSepolia,
  scroll,
  scrollSepolia,
  sepolia,
} from "wagmi/chains";
import { injected } from "wagmi/connectors";

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
  connectors: [injected()],
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
