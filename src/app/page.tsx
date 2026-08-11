"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
  useSignMessage,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { parseEther, isAddress } from "viem";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { switchChain } = useSwitchChain();

  console.log("balance:", balance);

  // Message signing: no gas, no transaction, nothing goes on-chain.
  // `signature` is the result, `isPending` is true while MetaMask is open,
  // `error` is set if the user rejects the request.
  const {
    signMessage,
    data: signature,
    isPending: isSigning,
    error: signError,
    reset: resetSign,
  } = useSignMessage();

  const message =
    "Olá! Esta é minha primeira mensagem assinada com a carteira.";

  // --- Send a transaction (costs gas, goes on-chain) ---
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
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>App Blockchain com RainbowKit</h1>

      <div style={{ margin: "30px 0" }}>
        <ConnectButton />
      </div>

      {isConnected && (
        <div style={{ marginTop: "30px", lineHeight: "1.8" }}>
          <p>
            <strong>Endereço:</strong> {address}
          </p>
          <p>
            <strong>Rede atual (chainId):</strong> {chainId}
          </p>
          <p>
            <strong>Saldo:</strong>{" "}
            {balance
              ? `${(Number(balance.value) / 10 ** balance.decimals).toFixed(4)} ${balance.symbol}`
              : "Carregando..."}
          </p>
          {chainId !== sepolia.id && (
            <button
              onClick={() => switchChain({ chainId: sepolia.id })}
              style={{
                marginTop: "15px",
                padding: "10px 20px",
                cursor: "pointer",
              }}
            >
              Trocar para Sepolia (Testnet)
            </button>
          )}

          {/* --- New: sign a message --- */}
          <div style={{ marginTop: "40px" }}>
            <h2 style={{ fontSize: "18px" }}>Assinar uma mensagem</h2>
            <p style={{ color: "#666" }}>Mensagem: &quot;{message}&quot;</p>

            <button
              onClick={() => {
                resetSign(); // clears any previous signature or error
                signMessage({ message });
              }}
              disabled={isSigning}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                cursor: isSigning ? "not-allowed" : "pointer",
              }}
            >
              {isSigning ? "Confirme na carteira..." : "Assinar mensagem"}
            </button>

            {signature && (
              <p style={{ marginTop: "15px", wordBreak: "break-all" }}>
                <strong>Assinatura:</strong> {signature}
              </p>
            )}

            {signError && (
              <p style={{ marginTop: "15px", color: "crimson" }}>
                Não foi possível assinar (você cancelou?).
              </p>
            )}
          </div>

          {/* --- Send test ETH --- */}
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
        </div>
      )}
    </main>
  );
}
