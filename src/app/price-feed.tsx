"use client";

import { useReadContract } from "wagmi";
import { sepolia } from "wagmi/chains";

// Chainlink ETH/USD price feed on Sepolia.
const FEED_ADDRESS: `0x${string}` =
  "0x694AA1769357215DE4FAC081bf1f309aDC325306";

// Chainlink USD feeds report the price with 8 decimals.
const DECIMALS = 8;

// The ABI: just the one function we call. `as const` lets wagmi/viem
// infer the exact return types for us.
const aggregatorAbi = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" }, // <-- the price
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function PriceFeed() {
  const { data, isLoading, error } = useReadContract({
    address: FEED_ADDRESS,
    abi: aggregatorAbi,
    functionName: "latestRoundData",
    chainId: sepolia.id, // read from Sepolia no matter what network the wallet is on
  });

  // `data` is a tuple: [roundId, answer, startedAt, updatedAt, answeredInRound]
  const answer = data?.[1];
  const price = answer ? Number(answer) / 10 ** DECIMALS : null;
  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "18px" }}>3. Ler um contrato (preço ETH/USD)</h2>

      {isLoading && <p style={{ color: "#888" }}>Carregando preço...</p>}

      {error && (
        <p style={{ color: "crimson" }}>Não foi possível ler o preço.</p>
      )}

      {price !== null && (
        <p>
          <strong>ETH/USD:</strong> ${price.toFixed(2)}
        </p>
      )}
    </div>
  );
}
