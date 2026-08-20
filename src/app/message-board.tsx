"use client";

import { useEffect, useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
} from "wagmi";
import { sepolia } from "wagmi/chains";

// Paste your deployed MessageBoard address here (from Foundry).
const MESSAGE_BOARD_ADDRESS = "0x8aD36cDd951De189FB767B0794aBF64040b8727b"; // e.g. "0x...."

const isConfigured =
  MESSAGE_BOARD_ADDRESS.startsWith("0x") && MESSAGE_BOARD_ADDRESS.length === 42;

const messageBoardAbi = [
  {
    inputs: [],
    name: "message",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastSender",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "newMessage", type: "string" }],
    name: "setMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "sender", type: "address" },
      { indexed: false, name: "message", type: "string" },
    ],
    name: "MessagePosted",
    type: "event",
  },
] as const;

export function MessageBoard() {
  const [text, setText] = useState("");

  const readCfg = {
    address: isConfigured
      ? (MESSAGE_BOARD_ADDRESS as `0x${string}`)
      : undefined,
    abi: messageBoardAbi,
    chainId: sepolia.id,
    query: { enabled: isConfigured },
  } as const;

  const { data: message, refetch: refetchMessage } = useReadContract({
    ...readCfg,
    functionName: "message",
  });
  const { data: lastSender, refetch: refetchSender } = useReadContract({
    ...readCfg,
    functionName: "lastSender",
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // After a write confirms, re-read both values
  useEffect(() => {
    if (isSuccess) {
      refetchMessage();
      refetchSender();
    }
  }, [isSuccess, refetchMessage, refetchSender]);

  // Live: subscribe to the MessagePosted event. Fires whenever the message
  // changes on-chain — even if someone else posts, or you use Etherscan.
  useWatchContractEvent({
    address: isConfigured
      ? (MESSAGE_BOARD_ADDRESS as `0x${string}`)
      : undefined,
    abi: messageBoardAbi,
    eventName: "MessagePosted",
    chainId: sepolia.id,
    enabled: isConfigured,
    onLogs() {
      refetchMessage();
      refetchSender();
    },
  });

  const busy = isPending || isConfirming;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "18px" }}>6. MessageBoard (string + evento)</h2>

      {!isConfigured && (
        <p style={{ color: "#888" }}>
          Faça o deploy do <code>MessageBoard.sol</code> na Sepolia e cole o
          endereço em <code>message-board.tsx</code> para ativar.
        </p>
      )}

      {isConfigured && (
        <>
          <p>
            <strong>Mensagem atual:</strong>{" "}
            {message ? String(message) : "(vazia)"}
          </p>
          <p style={{ wordBreak: "break-all" }}>
            <strong>Último a postar:</strong>{" "}
            {lastSender ? String(lastSender) : "(ninguém ainda)"}
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "10px",
              maxWidth: "520px",
            }}
          >
            <input
              placeholder="Nova mensagem"
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ padding: "10px", flex: 1 }}
            />
            <button
              onClick={() =>
                writeContract({
                  address: MESSAGE_BOARD_ADDRESS as `0x${string}`,
                  abi: messageBoardAbi,
                  functionName: "setMessage",
                  args: [text],
                  chainId: sepolia.id,
                })
              }
              disabled={busy || text.length === 0}
              style={{
                padding: "10px 20px",
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              {isPending
                ? "Confirme..."
                : isConfirming
                  ? "Enviando..."
                  : "Postar"}
            </button>
          </div>

          {error && (
            <p style={{ marginTop: "10px", color: "crimson" }}>
              A transação falhou (você cancelou ou houve um erro).
            </p>
          )}
        </>
      )}
    </div>
  );
}
