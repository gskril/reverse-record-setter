import { base, optimism, arbitrum, scroll, linea } from "viem/chains";
import type { Chain } from "viem";

export interface ChainConfig {
  chain: Chain;
  coinType: number;
  rpcUrl?: string;
}

// Coin types are derived from chain IDs using ENSIP-11:
// coinType = 0x80000000 | chainId
export const SUPPORTED_CHAINS: ChainConfig[] = [
  {
    chain: base,
    coinType: 0x80000000 | base.id, // 2147492101
  },
  {
    chain: optimism,
    coinType: 0x80000000 | optimism.id, // 2147483658
  },
  {
    chain: arbitrum,
    coinType: 0x80000000 | arbitrum.id, // 2147525809
  },
  {
    chain: scroll,
    coinType: 0x80000000 | scroll.id, // 2148018000
  },
  {
    chain: linea,
    coinType: 0x80000000 | linea.id, // 2147542792
  },
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
