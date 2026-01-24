Lightweight API for broadcasting ENS reverse record setting transactions to multiple chains in a single request.

Effectively this is a single endpoint that receives a `setNameForAddrWithSignature` payload (https://docs.ens.domains/registry/reverse#signatures) and broadcasts it to all chains from the `coinTypes` array in the payload.

The smart version auto balances a small amount of ETH across all chains via Across or something so it doesn't run out of gas. Naive version requires manual ETH transfers to each chain.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
