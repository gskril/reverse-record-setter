// L2ReverseRegistrar contract address (same across all L2s via CREATE3)
export const L2_REVERSE_REGISTRAR_ADDRESS =
  "0x0000000000D8e504002cC26E3Ec46D81971C1664" as const;

// ABI for setNameForAddrWithSignature function
export const L2_REVERSE_REGISTRAR_ABI = [
  {
    inputs: [
      { name: "addr", type: "address" },
      { name: "name", type: "string" },
      { name: "coinTypes", type: "uint256[]" },
      { name: "signatureExpiry", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    name: "setNameForAddrWithSignature",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "coinType",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
