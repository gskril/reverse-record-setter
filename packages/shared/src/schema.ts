import { z } from "zod";
import { getAddress, isHex } from "viem";
import { isSupportedCoinType } from "./chains";

export const setReverseSchema = z.object({
  addr: z.string().transform((val) => getAddress(val)),
  name: z.string(),
  coinTypes: z
    .array(z.coerce.bigint())
    .min(1)
    .refine((val) => val.every((v) => isSupportedCoinType(v)), {
      message: "Unsupported coin types",
    }),
  signatureExpiry: z.coerce
    .bigint()
    .refine((val) => val > Math.floor(Date.now() / 1000), {
      message: "Signature expiry must be in the future",
    }),
  signature: z
    .string()
    .refine((val) => isHex(val), { message: "Invalid hex string" }),
});

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
