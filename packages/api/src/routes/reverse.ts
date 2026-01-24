import { Hono } from "hono";
import {
  createWalletClient,
  createPublicClient,
  http,
  type Hash,
  type Address,
  type Hex,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  SUPPORTED_CHAINS,
  getChainByCoinType,
  isSupportedCoinType,
} from "../config/chains";
import {
  L2_REVERSE_REGISTRAR_ADDRESS,
  L2_REVERSE_REGISTRAR_ABI,
} from "../lib/contract";
import type { Bindings } from "../types";

const app = new Hono<{ Bindings: Bindings }>();

interface SetReverseRequest {
  addr: Address;
  name: string;
  coinTypes: number[];
  signatureExpiry: number;
  signature: Hex;
}

interface ChainResult {
  chainId: number;
  chainName: string;
  coinType: number;
  transactionHash?: Hash;
  status: "pending" | "confirmed" | "failed";
  error?: string;
}

// GET /api/chains - Return supported chains
app.get("/chains", (c) => {
  const chains = SUPPORTED_CHAINS.map((config) => ({
    chainId: config.chain.id,
    chainName: config.chain.name,
    coinType: config.coinType,
    isTestnet: config.isTestnet,
  }));
  return c.json({ chains });
});

// POST /api/set-reverse - Broadcast reverse record transactions
app.post("/set-reverse", async (c) => {
  const privateKey = c.env.RELAYER_PRIVATE_KEY;

  if (!privateKey) {
    return c.json(
      { success: false, error: "Relayer private key not configured" },
      500
    );
  }

  let body: SetReverseRequest;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: "Invalid JSON body" }, 400);
  }

  const { addr, name, coinTypes, signatureExpiry, signature } = body;

  // Validate required fields
  if (!addr || !name || !coinTypes || !signatureExpiry || !signature) {
    return c.json(
      {
        success: false,
        error:
          "Missing required fields: addr, name, coinTypes, signatureExpiry, signature",
      },
      400
    );
  }

  // Validate coinTypes array
  if (!Array.isArray(coinTypes) || coinTypes.length === 0) {
    return c.json(
      { success: false, error: "coinTypes must be a non-empty array" },
      400
    );
  }

  // Check all coin types are supported
  const unsupportedCoinTypes = coinTypes.filter((ct) => !isSupportedCoinType(ct));
  if (unsupportedCoinTypes.length > 0) {
    return c.json(
      {
        success: false,
        error: `Unsupported coin types: ${unsupportedCoinTypes.join(", ")}`,
        supportedCoinTypes: SUPPORTED_CHAINS.map((c) => ({
          chainName: c.chain.name,
          coinType: c.coinType,
        })),
      },
      400
    );
  }

  // Check signature expiry
  const now = Math.floor(Date.now() / 1000);
  if (signatureExpiry <= now) {
    return c.json({ success: false, error: "Signature has expired" }, 400);
  }

  const account = privateKeyToAccount(privateKey as Hex);
  const results: ChainResult[] = [];

  // Process each chain in parallel
  const promises = coinTypes.map(async (coinType) => {
    const chainConfig = getChainByCoinType(coinType);
    if (!chainConfig) {
      return {
        chainId: 0,
        chainName: "Unknown",
        coinType,
        status: "failed" as const,
        error: "Chain not found",
      };
    }

    const result: ChainResult = {
      chainId: chainConfig.chain.id,
      chainName: chainConfig.chain.name,
      coinType,
      status: "pending",
    };

    try {
      const walletClient = createWalletClient({
        account,
        chain: chainConfig.chain,
        transport: http(),
      });

      const publicClient = createPublicClient({
        chain: chainConfig.chain,
        transport: http(),
      });

      // Send the transaction
      const txHash = await walletClient.writeContract({
        address: L2_REVERSE_REGISTRAR_ADDRESS,
        abi: L2_REVERSE_REGISTRAR_ABI,
        functionName: "setNameForAddrWithSignature",
        args: [addr, name, coinTypes.map(BigInt), BigInt(signatureExpiry), signature],
      });

      result.transactionHash = txHash;

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        timeout: 60_000, // 60 second timeout
      });

      result.status = receipt.status === "success" ? "confirmed" : "failed";
      if (receipt.status !== "success") {
        result.error = "Transaction reverted";
      }
    } catch (error) {
      result.status = "failed";
      result.error =
        error instanceof Error ? error.message : "Unknown error occurred";
    }

    return result;
  });

  const settledResults = await Promise.all(promises);
  results.push(...settledResults);

  const allSuccessful = results.every((r) => r.status === "confirmed");

  return c.json({
    success: allSuccessful,
    results,
  });
});

export default app;
