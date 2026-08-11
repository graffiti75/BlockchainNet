"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useBalance,
  useChainId,
  useSwitchChain,
  useSignMessage,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import { SendEth } from "./send-eth";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { switchChain } = useSwitchChain();

  console.log("balance:", balance);

  // --- Sign a message (no gas, nothing on-chain) ---
  const {
    signMessage,
    data: signature,
    isPending: isSigning,
    error: signError,
    reset: resetSign,
  } = useSignMessage();

  const message =
    "Olá! Esta é minha primeira mensagem assinada com a carteira.";

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

          {/* --- Send test ETH (extracted into its own component) --- */}
          <SendEth />
        </div>
      )}
    </main>
  );
}
