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
import { toCoinType } from "viem";

export interface ChainConfig {
  chain: Chain;
  coinType: bigint;
  isTestnet: boolean;
}

// Mainnet chains
export const MAINNET_CHAINS: ChainConfig[] = [
  {
    chain: base,
    coinType: toCoinType(base.id),
    isTestnet: false,
  },
  {
    chain: optimism,
    coinType: toCoinType(optimism.id),
    isTestnet: false,
  },
  {
    chain: arbitrum,
    coinType: toCoinType(arbitrum.id),
    isTestnet: false,
  },
  {
    chain: scroll,
    coinType: toCoinType(scroll.id),
    isTestnet: false,
  },
  {
    chain: linea,
    coinType: toCoinType(linea.id),
    isTestnet: false,
  },
];

// Testnet chains
export const TESTNET_CHAINS: ChainConfig[] = [
  {
    chain: baseSepolia,
    coinType: toCoinType(baseSepolia.id),
    isTestnet: true,
  },
  {
    chain: optimismSepolia,
    coinType: toCoinType(optimismSepolia.id),
    isTestnet: true,
  },
  {
    chain: arbitrumSepolia,
    coinType: toCoinType(arbitrumSepolia.id),
    isTestnet: true,
  },
  {
    chain: scrollSepolia,
    coinType: toCoinType(scrollSepolia.id),
    isTestnet: true,
  },
  {
    chain: lineaSepolia,
    coinType: toCoinType(lineaSepolia.id),
    isTestnet: true,
  },
];

// All supported chains
export const SUPPORTED_CHAINS: ChainConfig[] = [
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
];

export const CHAIN_BY_COIN_TYPE = new Map(
  SUPPORTED_CHAINS.map((config) => [config.coinType, config])
);

export const CHAIN_BY_ID = new Map(
  SUPPORTED_CHAINS.map((config) => [config.chain.id, config])
);

/**
 * Get chain config by coin type
 */
export function getChainByCoinType(coinType: bigint): ChainConfig | undefined {
  return CHAIN_BY_COIN_TYPE.get(coinType);
}

/**
 * Check if a coin type is supported
 */
export function isSupportedCoinType(coinType: bigint): boolean {
  return CHAIN_BY_COIN_TYPE.has(coinType);
}

/**
 * Get chain config by chain ID
 */
export function getChainById(chainId: number) {
  return CHAIN_BY_ID.get(chainId);
}

export function getMainnetChains(): ChainConfig[] {
  return MAINNET_CHAINS;
}

export function getTestnetChains(): ChainConfig[] {
  return TESTNET_CHAINS;
}
