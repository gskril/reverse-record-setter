# ENS Reverse Record Setter

An API and demo frontend for setting ENS reverse records across multiple L2 chains with a single signature.

## Supported Chains

The following chains were defined in [ENSIP-19](https://docs.ens.domains/ensip/19/).

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

**Coin Type Formula (ENSIP-11):** `coinType = (0x80000000 | chainId) >>> 0`

## Signature Format (ERC-191)

The user signs a message with this structure:

```solidity
keccak256(abi.encodePacked(
    address(this),    // L2ReverseRegistrar address
    0x64752d0b,       // `setNameForAddrWithSignature` selector
    addr,             // Address to set the name for
    signatureExpiry,  // Maxiumum 1 hour - 1 block
    name,             // Name to set
    coinTypes         // ENSIP-11 coin types to authorize
)).toEthSignedMessageHash()
```

That signature gets executed on relevant chains via this method:

```solidity
/// @param addr The address to set the name for.
/// @param name The name to set.
/// @param coinTypes The coin types to set. Must be inclusive of the coin type for the contract.
/// @param signatureExpiry Date when the signature expires.
/// @param signature The signature from the addr.
function setNameForAddrWithSignature(
    address addr,
    uint256 signatureExpiry,
    string memory name,
    uint256[] memory coinTypes,
    bytes memory signature
) external;
```

## API Design

### POST /api/set-reverse

**Request Body:**

```json
{
  "addr": "0x...",
  "name": "vitalik.eth",
  "coinTypes": [2147492101, 2147483658, 2147525809],
  "signatureExpiry": 1769000000,
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

## Environment Variables

### API

- `RELAYER_PRIVATE_KEY` - Private key for the relayer wallet that pays gas. Needs ETH on all supported chains.
- `PORT` - Server port (default: 3001, Bun only)

### Frontend

- `VITE_API_URL` - URL of the API (defaults to http://localhost:3001)

## Local Development

Install Dependencies

```bash
bun install
```

Setup your environment variables

1. Copy `.env.example` to `.env` in both packages
2. Add your relayer private key to `packages/api/.env`

Start the dev API and frontend

```bash
bun run dev:api      # API on http://localhost:3001
bun run dev:frontend # Frontend on http://localhost:5173
```

## Cloudflare Deployment

The recommended way to deploy is to fork this repository and use Cloudfare's GitHub integration. This will automatically build and deploy the frontend and API when you push to your fork.

For manual deployment:

```bash
# Build frontend first
bun run build --filter=frontend

# Set secret and deploy
npx wrangler secret put RELAYER_PRIVATE_KEY
npx wrangler deploy
```

The Worker serves:

- `/api/*` routes handled by Hono
- All other routes serve static files from the frontend build

### Cloudflare Dashboard Configuration

1. Go to Workers & Pages > Your Worker (`ens-reverse-records`)
2. Go to Settings > Variables
3. Add `RELAYER_PRIVATE_KEY` as an encrypted secret

### Custom Domains

1. Go to your Worker/Pages project
2. Click "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com` for the API)
4. Update DNS records as instructed
