"use client";

import { useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { sepolia } from "wagmi/chains";

// Paste your deployed Counter address here (Remix shows it after "Deploy").
const COUNTER_ADDRESS = "0xd93c150c972012ca91ee3839b6ab1ca9327e6f27"; // e.g. "0x...."

const isConfigured =
  COUNTER_ADDRESS.startsWith("0x") && COUNTER_ADDRESS.length === 42;

// The contract's ABI. count() is a free read; increment/decrement are writes.
const counterAbi = [
  {
    inputs: [],
    name: "count",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decrement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export function Counter() {
  // READ the current count
  const { data: count, refetch } = useReadContract({
    address: isConfigured ? (COUNTER_ADDRESS as `0x${string}`) : undefined,
    abi: counterAbi,
    functionName: "count",
    chainId: sepolia.id,
    query: { enabled: isConfigured },
  });

  // WRITE (increment / decrement)
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Wait for the write to be mined
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  // Once a write confirms, re-read the count so the UI updates
  useEffect(() => {
    if (isConfirmed) refetch();
  }, [isConfirmed, refetch]);

  const call = (functionName: "increment" | "decrement") =>
    writeContract({
      address: COUNTER_ADDRESS as `0x${string}`,
      abi: counterAbi,
      functionName,
      chainId: sepolia.id,
    });

  const busy = isPending || isConfirming;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "18px" }}>5. Contrato Counter (ler + escrever)</h2>

      {!isConfigured && (
        <p style={{ color: "#888" }}>
          Faça o deploy do <code>Counter.sol</code> na Sepolia e cole o endereço
          em <code>counter.tsx</code> para ativar.
        </p>
      )}

      {isConfigured && (
        <>
          <p>
            <strong>count:</strong>{" "}
            {count !== undefined ? count.toString() : "..."}
          </p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <button
              onClick={() => call("increment")}
              disabled={busy}
              style={{
                padding: "10px 20px",
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              +1
            </button>
            <button
              onClick={() => call("decrement")}
              disabled={busy}
              style={{
                padding: "10px 20px",
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              -1
            </button>
          </div>

          {busy && (
            <p style={{ marginTop: "10px", color: "#888" }}>
              {isPending
                ? "Confirme na carteira..."
                : "Aguardando confirmação..."}
            </p>
          )}

          {error && (
            <p style={{ marginTop: "10px", color: "crimson" }}>
              A transação falhou (você cancelou ou o require reverteu).
            </p>
          )}
        </>
      )}
    </div>
  );
}
