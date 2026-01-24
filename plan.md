# ENS Reverse Record Setter - Implementation Plan

## Overview

A monorepo containing an API and frontend for setting ENS reverse records across multiple L2 chains with a single signature.

## Architecture

```
reverse-record-setter/
├── packages/
│   ├── api/                    # Bun + Hono API with viem
│   │   ├── src/
│   │   │   ├── index.ts        # Server entry point
│   │   │   ├── config/
│   │   │   │   └── chains.ts   # Chain configurations
│   │   │   ├── lib/
│   │   │   │   └── contract.ts # Contract ABI & address
│   │   │   └── routes/
│   │   │       └── reverse.ts  # API routes
│   │   └── .env.example
│   └── frontend/               # React + Vite + wagmi
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── index.css
│       │   ├── lib/
│       │   │   ├── wagmi.ts    # Wagmi config
│       │   │   ├── chains.ts   # Chain configs
│       │   │   ├── signature.ts # Signature construction
│       │   │   └── api.ts      # API client
│       │   └── components/
│       │       ├── ConnectButton.tsx
│       │       ├── ChainSelector.tsx
│       │       ├── ReverseRecordForm.tsx
│       │       └── TransactionResults.tsx
│       └── .env.example
├── package.json                # Root workspace config
└── plan.md
```

## Supported Chains

| Chain | Chain ID | Coin Type (0x80000000 \| chainId) |
|-------|----------|-----------------------------------|
| Base | 8453 | 2147492101 |
| OP Mainnet | 10 | 2147483658 |
| Arbitrum One | 42161 | 2147525809 |
| Scroll | 534352 | 2148018000 |
| Linea | 59144 | 2147542792 |

## Signature Format (ERC-191)

The user signs a message with this structure:
```
keccak256(abi.encodePacked(
    L2ReverseRegistrarAddress,  // 0x0000000000D8e504002cC26E3Ec46D81971C1664
    0x2023a04c,                 // setNameForAddrWithSignature selector
    addr,
    signatureExpiry,
    name,
    coinTypes
)).toEthSignedMessageHash()
```

The `toEthSignedMessageHash()` adds the prefix: `"\x19Ethereum Signed Message:\n32"`

## API Design

### POST /api/set-reverse

**Request Body:**
```json
{
  "addr": "0x...",
  "name": "vitalik.eth",
  "coinTypes": [2147492101, 2147483658, 2147525809],
  "signatureExpiry": 1706140800,
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "chainId": 8453,
      "chainName": "Base",
      "transactionHash": "0x...",
      "status": "confirmed"
    },
    {
      "chainId": 10,
      "chainName": "OP Mainnet",
      "transactionHash": "0x...",
      "status": "confirmed"
    }
  ]
}
```

### GET /api/chains

Returns list of supported chains with their coin types.

## Frontend Flow

1. **Connect Wallet** - User connects via wagmi (injected wallet or WalletConnect)
2. **Enter ENS Name** - Input field for the ENS name to set as reverse
3. **Select Chains** - Checkboxes for which L2s to set the reverse record on
4. **Sign Message** - Frontend constructs the message and requests signature
5. **Submit to API** - Send the payload to the API
6. **Display Results** - Show transaction hashes and confirmation status for each chain

## Environment Variables

### API
- `RELAYER_PRIVATE_KEY` - Private key for the relayer wallet that pays gas
- `PORT` - Server port (default: 3001)

### Frontend
- `VITE_API_URL` - URL of the API (defaults to http://localhost:3001)
- `VITE_WALLETCONNECT_PROJECT_ID` - WalletConnect project ID (optional)

## L2ReverseRegistrar Contract

The L2ReverseRegistrar is deployed at the same address across all L2s using CREATE3.

**Contract Address:** `0x0000000000D8e504002cC26E3Ec46D81971C1664`

**ABI (relevant function):**
```solidity
function setNameForAddrWithSignature(
    address addr,
    string calldata name,
    uint256[] calldata coinTypes,
    uint256 signatureExpiry,
    bytes calldata signature
) external returns (bytes32)
```

## Implementation Tasks

### Phase 1: Project Setup
- [x] Create plan.md
- [x] Set up monorepo with workspaces
- [x] Configure TypeScript for both packages

### Phase 2: API Implementation
- [x] Set up Hono server with Bun
- [x] Install viem (v2.44.1)
- [x] Create chain configurations
- [x] Implement coin type to chain ID conversion
- [x] Implement POST /api/set-reverse endpoint
- [x] Implement GET /api/chains endpoint
- [x] Add transaction confirmation waiting

### Phase 3: Frontend Implementation
- [x] Set up Vite + React project
- [x] Install wagmi (v2.14.0) + viem + @tanstack/react-query
- [x] Configure wallet connectors
- [x] Create wallet connection UI
- [x] Create ENS name input form
- [x] Create chain selection checkboxes
- [x] Implement message signing logic
- [x] Create API submission and result display
- [x] Add loading states and error handling

### Phase 4: Testing & Polish
- [ ] Test with real wallet
- [ ] Verify transactions on block explorers
- [ ] Add better error messages
- [ ] Polish UI

## Running the Project

### Prerequisites
- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Node.js 18+ (for some tooling)

### Install Dependencies
```bash
bun install
```

### Start Development
```bash
# Start both API and frontend
bun run dev

# Or start individually
bun run dev:api      # API on http://localhost:3001
bun run dev:frontend # Frontend on http://localhost:5173
```

### Environment Setup

1. Copy `.env.example` to `.env` in both packages
2. Add your relayer private key to `packages/api/.env`
3. (Optional) Add WalletConnect project ID to `packages/frontend/.env`

## Notes

- The API uses a "naive" approach where it requires manual ETH funding on each chain
- All L2 transactions should confirm quickly (< 10 seconds typically)
- The signature includes the coin types array, so one signature authorizes all selected chains
- The L2ReverseRegistrar validates that the contract's own coin type is in the coinTypes array
