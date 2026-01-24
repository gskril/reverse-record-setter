import {
  encodePacked,
  keccak256,
  toHex,
  type Address,
  type Hex,
  hashMessage,
} from "viem";

// L2ReverseRegistrar address (same across all L2s)
export const L2_REVERSE_REGISTRAR_ADDRESS =
  "0x0000000000D8e504002cC26E3Ec46D81971C1664" as const;

// Function selector for setNameForAddrWithSignature(address,string,uint256[],uint256,bytes)
export const FUNCTION_SELECTOR = "0x2023a04c" as const;

/**
 * Construct the message hash that needs to be signed for setNameForAddrWithSignature
 *
 * The message format (ERC-191 version 0):
 * keccak256(abi.encodePacked(
 *   contractAddress,      // L2ReverseRegistrar address
 *   functionSelector,     // 0x2023a04c
 *   addr,                 // Address to set reverse for
 *   signatureExpiry,      // Expiry timestamp
 *   name,                 // ENS name
 *   coinTypes             // Array of coin types
 * ))
 *
 * Then wrapped with Ethereum signed message prefix
 */
export function constructSignatureMessage(
  addr: Address,
  name: string,
  coinTypes: bigint[],
  signatureExpiry: bigint
): Hex {
  // Encode the coin types as packed uint256 values
  const encodedCoinTypes = coinTypes.map((ct) => toHex(ct, { size: 32 })).join("").slice(2);

  // Construct the inner message
  const innerMessage = encodePacked(
    ["address", "bytes4", "address", "uint256", "string", "bytes"],
    [
      L2_REVERSE_REGISTRAR_ADDRESS,
      FUNCTION_SELECTOR,
      addr,
      signatureExpiry,
      name,
      `0x${encodedCoinTypes}` as Hex,
    ]
  );

  // Hash the inner message
  const messageHash = keccak256(innerMessage);

  return messageHash;
}

/**
 * Get the hash that will be signed (with Ethereum signed message prefix)
 */
export function getSignatureHash(
  addr: Address,
  name: string,
  coinTypes: bigint[],
  signatureExpiry: bigint
): Hex {
  const messageHash = constructSignatureMessage(
    addr,
    name,
    coinTypes,
    signatureExpiry
  );

  // The final hash includes the Ethereum signed message prefix
  // This is what eth_sign / personal_sign produces
  return hashMessage({ raw: messageHash });
}

/**
 * Generate a signature expiry timestamp (1 hour from now)
 */
export function generateSignatureExpiry(): number {
  const ONE_HOUR = 60 * 60;
  return Math.floor(Date.now() / 1000) + ONE_HOUR;
}
