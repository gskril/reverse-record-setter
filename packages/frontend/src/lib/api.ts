import type { Address, Hex } from "viem";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export interface ChainResult {
  chainId: number;
  chainName: string;
  coinType: number;
  transactionHash?: string;
  status: "pending" | "confirmed" | "failed";
  error?: string;
}

export interface SetReverseResponse {
  success: boolean;
  results?: ChainResult[];
  error?: string;
}

export interface SetReverseRequest {
  addr: Address;
  name: string;
  coinTypes: number[];
  signatureExpiry: number;
  signature: Hex;
}

export async function setReverseRecords(
  request: SetReverseRequest
): Promise<SetReverseResponse> {
  const response = await fetch(`${API_URL}/api/set-reverse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();
  return data;
}

export async function getChains(): Promise<
  { chainId: number; chainName: string; coinType: number }[]
> {
  const response = await fetch(`${API_URL}/api/chains`);
  const data = await response.json();
  return data.chains;
}
