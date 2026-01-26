import {
  encodePacked,
  keccak256,
  type Address,
  toFunctionSelector,
} from "viem";
import { getL2ReverseRegistrarAddress } from "shared/chains";

// Function selector for setNameForAddrWithSignature
const FUNCTION_SELECTOR = toFunctionSelector(
  "setNameForAddrWithSignature(address,uint256,string,uint256[],bytes)"
);

// Construct the message hash that needs to be signed for setNameForAddrWithSignature
export function constructSignatureMessage(
  addr: Address,
  name: string,
  coinTypes: bigint[],
  signatureExpiry: bigint,
  isTestnet: boolean = false
) {
  // Construct the inner message
  const innerMessage = encodePacked(
    ["address", "bytes4", "address", "uint256", "string", "uint256[]"],
    [
      getL2ReverseRegistrarAddress(isTestnet),
      FUNCTION_SELECTOR,
      addr,
      signatureExpiry,
      name,
      coinTypes,
    ]
  );

  // Hash the inner message
  const messageHash = keccak256(innerMessage);

  return messageHash;
}

// Generate a signature expiry timestamp (1 hour from now)
export function generateSignatureExpiry() {
  const ONE_HOUR = 60 * 59; // Has to be 1 hour - 1 block if it's getting submitted immediately
  return BigInt(Math.floor(Date.now() / 1000) + ONE_HOUR);
}
