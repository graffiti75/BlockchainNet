"use client";

import { useState } from "react";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress } from "viem";

export function SendEth() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("0.001");
  const {
    data: hash, // the transaction hash, once broadcast
    sendTransaction,
    isPending: isSending, // true while MetaMask popup is open
    error: sendError,
    reset: resetSend,
  } = useSendTransaction();

  // Watches the hash and tells us when the network confirms it
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const validAddress = isAddress(to);

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ fontSize: "18px" }}>2. Enviar ETH de teste</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "520px",
        }}
      >
        <input
          placeholder="Endereço de destino (0x...)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ padding: "10px" }}
        />
        <input
          placeholder="Quantidade em ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{ padding: "10px" }}
        />
      </div>

      <button
        onClick={() => {
          resetSend();
          sendTransaction({
            to: to as `0x${string}`,
            value: parseEther(amount),
          });
        }}
        disabled={!validAddress || isSending || isConfirming}
        style={{
          marginTop: "12px",
          padding: "10px 20px",
          cursor:
            !validAddress || isSending || isConfirming
              ? "not-allowed"
              : "pointer",
        }}
      >
        {isSending
          ? "Confirme na carteira..."
          : isConfirming
            ? "Aguardando confirmação..."
            : "Enviar"}
      </button>

      {to.length > 0 && !validAddress && (
        <p style={{ marginTop: "10px", color: "#888" }}>
          Digite um endereço válido para habilitar o botão.
        </p>
      )}

      {isConfirmed && (
        <p style={{ marginTop: "15px", color: "green" }}>
          Confirmada! Ver no explorador:{" "}
          <a
            href={`https://sepolia.etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {hash}
          </a>
        </p>
      )}

      {sendError && (
        <p style={{ marginTop: "15px", color: "crimson" }}>
          Transação não enviada (você cancelou ou houve um erro).
        </p>
      )}
    </div>
  );
}
