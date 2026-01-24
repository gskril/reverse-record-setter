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
} from "viem/chains";
import type { Chain } from "viem";

export interface ChainConfig {
  chain: Chain;
  coinType: number;
  isTestnet: boolean;
}

// Coin types are derived from chain IDs using ENSIP-11:
// coinType = 0x80000000 | chainId

// Mainnet chains
export const MAINNET_CHAINS: ChainConfig[] = [
  {
    chain: base,
    coinType: 0x80000000 | base.id, // 2147492101
    isTestnet: false,
  },
  {
    chain: optimism,
    coinType: 0x80000000 | optimism.id, // 2147483658
    isTestnet: false,
  },
  {
    chain: arbitrum,
    coinType: 0x80000000 | arbitrum.id, // 2147525809
    isTestnet: false,
  },
  {
    chain: scroll,
    coinType: 0x80000000 | scroll.id, // 2148018000
    isTestnet: false,
  },
  {
    chain: linea,
    coinType: 0x80000000 | linea.id, // 2147542792
    isTestnet: false,
  },
];

// Testnet chains
export const TESTNET_CHAINS: ChainConfig[] = [
  {
    chain: baseSepolia,
    coinType: 0x80000000 | baseSepolia.id, // 2147568180
    isTestnet: true,
  },
  {
    chain: optimismSepolia,
    coinType: 0x80000000 | optimismSepolia.id, // 2158639068
    isTestnet: true,
  },
  {
    chain: arbitrumSepolia,
    coinType: 0x80000000 | arbitrumSepolia.id, // 2147905262
    isTestnet: true,
  },
  {
    chain: scrollSepolia,
    coinType: 0x80000000 | scrollSepolia.id, // 2148017999
    isTestnet: true,
  },
  {
    chain: lineaSepolia,
    coinType: 0x80000000 | lineaSepolia.id, // 2147542789
    isTestnet: true,
  },
];

// All supported chains
export const SUPPORTED_CHAINS: ChainConfig[] = [
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
];

export const CHAIN_BY_COIN_TYPE = new Map<number, ChainConfig>(
  SUPPORTED_CHAINS.map((config) => [config.coinType, config])
);

export const CHAIN_BY_ID = new Map<number, ChainConfig>(
  SUPPORTED_CHAINS.map((config) => [config.chain.id, config])
);

/**
 * Convert a coin type to a chain ID using ENSIP-11
 * For EVM chains: chainId = coinType & 0x7fffffff
 */
export function coinTypeToChainId(coinType: number): number {
  return coinType & 0x7fffffff;
}

/**
 * Convert a chain ID to a coin type using ENSIP-11
 * For EVM chains: coinType = 0x80000000 | chainId
 */
export function chainIdToCoinType(chainId: number): number {
  return 0x80000000 | chainId;
}

/**
 * Get chain config by coin type
 */
export function getChainByCoinType(coinType: number): ChainConfig | undefined {
  return CHAIN_BY_COIN_TYPE.get(coinType);
}

/**
 * Check if a coin type is supported
 */
export function isSupportedCoinType(coinType: number): boolean {
  return CHAIN_BY_COIN_TYPE.has(coinType);
}

/**
 * Get mainnet chains only
 */
export function getMainnetChains(): ChainConfig[] {
  return MAINNET_CHAINS;
}

/**
 * Get testnet chains only
 */
export function getTestnetChains(): ChainConfig[] {
  return TESTNET_CHAINS;
}
