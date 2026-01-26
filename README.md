# ENS Reverse Record Setter

## Overview

A monorepo containing an API and frontend for setting ENS reverse records across multiple L2 chains with a single signature.

## Architecture

```
reverse-record-setter/
├── packages/
│   ├── api/                    # Hono API (Bun or Cloudflare Workers)
│   │   ├── src/
│   │   │   ├── index.ts        # Main app (shared)
│   │   │   ├── bun.ts          # Bun entry point
│   │   │   ├── worker.ts       # Cloudflare Workers entry point
│   │   │   ├── types.ts        # TypeScript types
│   │   │   ├── config/
│   │   │   │   └── chains.ts   # Chain configurations
│   │   │   ├── lib/
│   │   │   │   └── contract.ts # Contract ABI & address
│   │   │   └── routes/
│   │   │       └── reverse.ts  # API routes
│   │   ├── wrangler.toml       # Cloudflare Workers config
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
│       ├── public/
│       │   ├── _headers        # Cloudflare Pages headers
│       │   └── _redirects      # SPA redirects
│       └── .env.example
├── package.json                # Root workspace config
└── plan.md
```

## Supported Chains

### Mainnets

| Chain        | Chain ID | Coin Type  |
| ------------ | -------- | ---------- |
| Base         | 8453     | 2147492101 |
| OP Mainnet   | 10       | 2147483658 |
| Arbitrum One | 42161    | 2147525809 |
| Scroll       | 534352   | 2148018000 |
| Linea        | 59144    | 2147542792 |

### Testnets

| Chain            | Chain ID | Coin Type  |
| ---------------- | -------- | ---------- |
| Base Sepolia     | 84532    | 2147568180 |
| OP Sepolia       | 11155420 | 2158639068 |
| Arbitrum Sepolia | 421614   | 2147905262 |
| Scroll Sepolia   | 534351   | 2148017999 |
| Linea Sepolia    | 59141    | 2147542789 |

**Coin Type Formula (ENSIP-11):** `coinType = 0x80000000 | chainId`

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
      "coinType": 2147492101,
      "transactionHash": "0x...",
      "status": "confirmed"
    }
  ]
}
```

### GET /api/chains

Returns list of supported chains with their coin types:

```json
{
  "chains": [
    {
      "chainId": 8453,
      "chainName": "Base",
      "coinType": 2147492101,
      "isTestnet": false
    },
    {
      "chainId": 84532,
      "chainName": "Base Sepolia",
      "coinType": 2147568180,
      "isTestnet": true
    }
  ]
}
```

## Frontend Flow

1. **Connect Wallet** - User connects via wagmi (injected wallet)
2. **Enter ENS Name** - Input field for the ENS name to set as reverse
3. **Select Network** - Toggle between Mainnet and Testnet chains
4. **Select Chains** - Checkboxes for which L2s to set the reverse record on
5. **Sign Message** - Frontend constructs the message and requests signature
6. **Submit to API** - Send the payload to the API
7. **Display Results** - Show transaction hashes and confirmation status for each chain

## Environment Variables

### API

- `RELAYER_PRIVATE_KEY` - Private key for the relayer wallet that pays gas
- `PORT` - Server port (default: 3001, Bun only)

### Frontend

- `VITE_API_URL` - URL of the API (defaults to http://localhost:3001)

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

## Local Development

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)

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

---

## Cloudflare Deployment

The project supports deployment to Cloudflare with:

- **API**: Cloudflare Workers
- **Frontend**: Cloudflare Pages

### Option 1: Separate Deployments

#### Deploy API to Cloudflare Workers

```bash
cd packages/api

# Login to Cloudflare (first time only)
npx wrangler login

# Set the secret (private key for relayer wallet)
npx wrangler secret put RELAYER_PRIVATE_KEY
# Enter your private key when prompted

# Deploy to production
bun run deploy

# Or deploy to staging
npx wrangler deploy --env staging
```

The API will be available at `https://ens-reverse-record-api.<your-subdomain>.workers.dev`

#### Deploy Frontend to Cloudflare Pages

```bash
cd packages/frontend

# Build the frontend
bun run build

# Deploy to Cloudflare Pages
bun run deploy
```

Or connect your GitHub repository to Cloudflare Pages:

1. Go to Cloudflare Dashboard > Pages
2. Create a new project and connect your repository
3. Configure build settings:
   - **Build command:** `cd packages/frontend && bun install && bun run build`
   - **Build output directory:** `packages/frontend/dist`
4. Add environment variable: `VITE_API_URL` = your Workers API URL

### Option 2: Single Origin (Pages + Functions)

You can also deploy everything to Cloudflare Pages with Functions for the API.

1. Create `functions/api/[[route]].ts` in the frontend package:

```typescript
// packages/frontend/functions/api/[[route]].ts
import app from "../../packages/api/src/index";

export const onRequest = app.fetch;
```

2. Configure Pages to build both packages
3. The API will be available at `/api/*` on the same domain

### Cloudflare Dashboard Configuration

#### Workers (API)

1. Go to Workers & Pages > Create > Worker
2. Name: `ens-reverse-record-api`
3. After deployment, go to Settings > Variables
4. Add `RELAYER_PRIVATE_KEY` as an encrypted secret

#### Pages (Frontend)

1. Go to Workers & Pages > Create > Pages
2. Connect your Git repository
3. Framework preset: None
4. Build command: `cd packages/frontend && bun install && bun run build`
5. Build output: `packages/frontend/dist`
6. Add environment variable: `VITE_API_URL`

### Custom Domains

1. Go to your Worker/Pages project
2. Click "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com` for the API)
4. Update DNS records as instructed

---

## Implementation Tasks

### Phase 1: Project Setup

- [x] Create plan.md
- [x] Set up monorepo with workspaces
- [x] Configure TypeScript for both packages

### Phase 2: API Implementation

- [x] Set up Hono server with Bun
- [x] Install viem (v2.44.1)
- [x] Create chain configurations (mainnet + testnet)
- [x] Implement coin type to chain ID conversion
- [x] Implement POST /api/set-reverse endpoint
- [x] Implement GET /api/chains endpoint
- [x] Add transaction confirmation waiting
- [x] Add Cloudflare Workers support

### Phase 3: Frontend Implementation

- [x] Set up Vite + React project
- [x] Install wagmi (v2.14.0) + viem + @tanstack/react-query
- [x] Configure wallet connectors
- [x] Create wallet connection UI
- [x] Create ENS name input form
- [x] Create chain selection with mainnet/testnet toggle
- [x] Implement message signing logic
- [x] Create API submission and result display
- [x] Add loading states and error handling
- [x] Add Cloudflare Pages deployment config

## Notes

- The API uses a "naive" approach where it requires manual ETH funding on each chain
- All L2 transactions should confirm quickly (< 10 seconds typically)
- The signature includes the coin types array, so one signature authorizes all selected chains
- The L2ReverseRegistrar validates that the contract's own coin type is in the coinTypes array
- Testnet chains use the same L2ReverseRegistrar contract address
