"use client";

import { useReadContract } from "wagmi";
import { base } from "wagmi/chains";

// ETH/USD on Base mainnet — verified on BaseScan.
const ETH_USD: `0x${string}` = "0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70";

// BRL/USD on Base mainnet — paste the proxy address here to activate this section.
// Get it from https://docs.chain.link/data-feeds/price-feeds/addresses
//   1) select network "Base"
//   2) find the "BRL / USD" row
//   3) tick "Show more details" and copy the proxy address (confirm decimals = 8)
const BRL_USD = "0x0b0E64c05083FdF9ED7C5D3d8262c4216eFc9394"; // e.g. "0x...."

const brlConfigured = BRL_USD.startsWith("0x") && BRL_USD.length === 42;

// Both feeds are USD-quoted with 8 decimals, so the 10**8 scaling cancels
// when we divide one by the other.
const aggregatorAbi = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function EthBrlPrice() {
  const { data: ethUsd, isLoading: loadingEth } = useReadContract({
    address: ETH_USD,
    abi: aggregatorAbi,
    functionName: "latestRoundData",
    chainId: base.id,
  });

  const { data: brlUsd, isLoading: loadingBrl } = useReadContract({
    address: brlConfigured ? (BRL_USD as `0x${string}`) : undefined,
    abi: aggregatorAbi,
    functionName: "latestRoundData",
    chainId: base.id,
    query: { enabled: brlConfigured }, // don't fire the read until an address is set
  });

  // ETH/BRL = (ETH in USD) / (BRL in USD). Both answers share 8 decimals, so
  // dividing the raw integers gives the price directly.
  const ethBrl =
    ethUsd && brlUsd ? Number(ethUsd[1]) / Number(brlUsd[1]) : null;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "18px" }}>4. Preço derivado ETH/BRL (Base)</h2>

      {!brlConfigured && (
        <p style={{ color: "#888" }}>
          Cole o endereço do feed BRL/USD (Base) em{" "}
          <code>eth-brl-price.tsx</code> para ativar.
        </p>
      )}

      {brlConfigured && (loadingEth || loadingBrl) && (
        <p style={{ color: "#888" }}>Carregando preços...</p>
      )}

      {ethBrl !== null && (
        <p>
          <strong>ETH/BRL:</strong> R$ {ethBrl.toFixed(2)}
        </p>
      )}
    </div>
  );
}
