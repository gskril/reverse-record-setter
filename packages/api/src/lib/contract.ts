// L2ReverseRegistrar contract address (same across all L2s via CREATE3)
export const L2_REVERSE_REGISTRAR_ADDRESS =
  "0x0000000000D8e504002cC26E3Ec46D81971C1664" as const;

// ABI for setNameForAddrWithSignature function
export const L2_REVERSE_REGISTRAR_ABI = [
  { inputs: [], name: "CoinTypeNotFound", type: "error" },
  { inputs: [], name: "InvalidSignature", type: "error" },
  { inputs: [], name: "NotOwnerOfContract", type: "error" },
  { inputs: [], name: "SignatureExpired", type: "error" },
  { inputs: [], name: "SignatureExpiryTooHigh", type: "error" },
  { inputs: [], name: "Unauthorised", type: "error" },
  {
    inputs: [],
    name: "coinType",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "addr", type: "address" }],
    name: "nameForAddr",
    outputs: [{ internalType: "string", name: "name", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "addr", type: "address" },
      { internalType: "string", name: "name", type: "string" },
    ],
    name: "setNameForAddr",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "addr", type: "address" },
      { internalType: "uint256", name: "signatureExpiry", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256[]", name: "coinTypes", type: "uint256[]" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "setNameForAddrWithSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "contractAddr", type: "address" },
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "uint256", name: "signatureExpiry", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256[]", name: "coinTypes", type: "uint256[]" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "setNameForOwnableWithSignature",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
