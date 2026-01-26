import { z } from "zod";
import { ChainResult, setReverseSchema } from "shared/schema";
import { replaceBigInts } from "./replaceBigInts";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface SetReverseResponse {
  success: boolean;
  results?: ChainResult[];
  error?: string;
}

export async function setReverseRecords(
  request: z.infer<typeof setReverseSchema>
): Promise<SetReverseResponse> {
  const response = await fetch(`${API_URL}/api/set-reverse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(replaceBigInts(request, (x) => x.toString())),
  });

  if (!response.ok) {
    const text = await response.text();
    return {
      success: false,
      error: text || `Request failed with status ${response.status}`,
    };
  }

  return response.json();
}

export async function getChains(): Promise<
  { chainId: number; chainName: string; coinType: number }[]
> {
  const response = await fetch(`${API_URL}/api/chains`);

  if (!response.ok) {
    throw new Error(`Failed to fetch chains: ${response.status}`);
  }

  const data = await response.json();
  return data.chains;
}
