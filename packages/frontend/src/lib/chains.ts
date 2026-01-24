import { toCoinType } from "viem";
import {
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
  type Chain,
} from "viem/chains";

export interface SupportedChain {
  chain: Chain;
  coinType: number;
  isTestnet: boolean;
}

// Helper to get coinType as number (for JSON-safe storage)
function getCoinType(chainId: number): number {
  return Number(toCoinType(chainId));
}

// Mainnet chains
export const MAINNET_CHAINS: SupportedChain[] = [
  {
    chain: base,
    coinType: getCoinType(base.id),
    isTestnet: false,
  },
  {
    chain: optimism,
    coinType: getCoinType(optimism.id),
    isTestnet: false,
  },
  {
    chain: arbitrum,
    coinType: getCoinType(arbitrum.id),
    isTestnet: false,
  },
  {
    chain: scroll,
    coinType: getCoinType(scroll.id),
    isTestnet: false,
  },
  {
    chain: linea,
    coinType: getCoinType(linea.id),
    isTestnet: false,
  },
];

// Testnet chains
export const TESTNET_CHAINS: SupportedChain[] = [
  {
    chain: baseSepolia,
    coinType: getCoinType(baseSepolia.id),
    isTestnet: true,
  },
  {
    chain: optimismSepolia,
    coinType: getCoinType(optimismSepolia.id),
    isTestnet: true,
  },
  {
    chain: arbitrumSepolia,
    coinType: getCoinType(arbitrumSepolia.id),
    isTestnet: true,
  },
  {
    chain: scrollSepolia,
    coinType: getCoinType(scrollSepolia.id),
    isTestnet: true,
  },
  {
    chain: lineaSepolia,
    coinType: getCoinType(lineaSepolia.id),
    isTestnet: true,
  },
];

// All supported chains
export const SUPPORTED_CHAINS: SupportedChain[] = [
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
];

export function getChainByCoinType(
  coinType: number
): SupportedChain | undefined {
  return SUPPORTED_CHAINS.find((c) => c.coinType === coinType);
}

export function getMainnetChains(): SupportedChain[] {
  return MAINNET_CHAINS;
}

export function getTestnetChains(): SupportedChain[] {
  return TESTNET_CHAINS;
}
