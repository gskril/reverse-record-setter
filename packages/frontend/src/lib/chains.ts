import { base, optimism, arbitrum, scroll, linea, type Chain } from "viem/chains";

export interface SupportedChain {
  chain: Chain;
  coinType: number;
}

// Coin types derived from chain IDs using ENSIP-11:
// coinType = 0x80000000 | chainId
export const SUPPORTED_CHAINS: SupportedChain[] = [
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

export function getChainByCoinType(coinType: number): SupportedChain | undefined {
  return SUPPORTED_CHAINS.find((c) => c.coinType === coinType);
}
