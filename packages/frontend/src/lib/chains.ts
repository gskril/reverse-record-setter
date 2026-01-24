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

// Coin types derived from chain IDs using ENSIP-11:
// coinType = 0x80000000 | chainId

// Mainnet chains
export const MAINNET_CHAINS: SupportedChain[] = [
  {
    chain: base,
    coinType: 0x80000000 | base.id,
    isTestnet: false,
  },
  {
    chain: optimism,
    coinType: 0x80000000 | optimism.id,
    isTestnet: false,
  },
  {
    chain: arbitrum,
    coinType: 0x80000000 | arbitrum.id,
    isTestnet: false,
  },
  {
    chain: scroll,
    coinType: 0x80000000 | scroll.id,
    isTestnet: false,
  },
  {
    chain: linea,
    coinType: 0x80000000 | linea.id,
    isTestnet: false,
  },
];

// Testnet chains
export const TESTNET_CHAINS: SupportedChain[] = [
  {
    chain: baseSepolia,
    coinType: 0x80000000 | baseSepolia.id,
    isTestnet: true,
  },
  {
    chain: optimismSepolia,
    coinType: 0x80000000 | optimismSepolia.id,
    isTestnet: true,
  },
  {
    chain: arbitrumSepolia,
    coinType: 0x80000000 | arbitrumSepolia.id,
    isTestnet: true,
  },
  {
    chain: scrollSepolia,
    coinType: 0x80000000 | scrollSepolia.id,
    isTestnet: true,
  },
  {
    chain: lineaSepolia,
    coinType: 0x80000000 | lineaSepolia.id,
    isTestnet: true,
  },
];

// All supported chains
export const SUPPORTED_CHAINS: SupportedChain[] = [
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
];

export function getChainByCoinType(coinType: number): SupportedChain | undefined {
  return SUPPORTED_CHAINS.find((c) => c.coinType === coinType);
}

export function getMainnetChains(): SupportedChain[] {
  return MAINNET_CHAINS;
}

export function getTestnetChains(): SupportedChain[] {
  return TESTNET_CHAINS;
}
