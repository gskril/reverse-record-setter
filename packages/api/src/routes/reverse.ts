import { Hono } from "hono";
import {
  createWalletClient,
  http,
  publicActions,
  type Hex,
  type WaitForTransactionReceiptErrorType,
  type WriteContractErrorType,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  SUPPORTED_CHAINS,
  getChainByCoinType,
  getL2ReverseRegistrarAddress,
} from "shared/chains";
import { L2_REVERSE_REGISTRAR_ABI } from "../lib/contract";
import type { Bindings } from "../types";
import { ChainResult, setReverseSchema } from "shared/schema";

const app = new Hono<{ Bindings: Bindings }>();

// GET /api/chains - Return supported chains
app.get("/chains", (c) => {
  return c.json(
    SUPPORTED_CHAINS.map((config) => ({
      chainId: config.chain.id,
      chainName: config.chain.name,
      coinType: Number(config.coinType),
      isTestnet: config.isTestnet,
    }))
  );
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

  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ success: false, error: "Missing JSON body" }, 400);
  }

  const safeParse = setReverseSchema.safeParse(body);

  if (!safeParse.success) {
    return c.json({ success: false, error: safeParse.error.message }, 400);
  }

  const { addr, name, coinTypes, signatureExpiry, signature } = safeParse.data;

  const account = privateKeyToAccount(privateKey as Hex);
  const results: ChainResult[] = [];

  // Process each chain in parallel
  const promises = coinTypes.map(async (coinType) => {
    const chainConfig = getChainByCoinType(coinType);

    let result: ChainResult;

    if (!chainConfig) {
      result = {
        chainId: 0,
        chainName: "Unknown",
        coinType: Number(coinType),
        status: "failed",
        error: "Chain not found",
      };

      return result;
    }

    result = {
      chainId: chainConfig.chain.id,
      chainName: chainConfig.chain.name,
      coinType: Number(coinType),
      status: "pending",
    };

    try {
      const client = createWalletClient({
        account,
        chain: chainConfig.chain,
        transport: http(),
      }).extend(publicActions);

      // Send the transaction
      const txHash = await client.writeContract({
        address: getL2ReverseRegistrarAddress(chainConfig.isTestnet),
        abi: L2_REVERSE_REGISTRAR_ABI,
        functionName: "setNameForAddrWithSignature",
        args: [addr, signatureExpiry, name, coinTypes.map(BigInt), signature],
      });

      result.transactionHash = txHash;

      // Wait for confirmation
      const receipt = await client.waitForTransactionReceipt({
        hash: txHash,
        timeout: 10_000, // 10 second timeout
      });

      result.status = receipt.status === "success" ? "confirmed" : "failed";
      if (receipt.status !== "success") {
        result.error = "Transaction reverted";
      }
    } catch (e) {
      result.status = "failed";

      const error = e as
        | WriteContractErrorType
        | WaitForTransactionReceiptErrorType;

      result.error = error.message ?? "Unknown error occurred";
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
