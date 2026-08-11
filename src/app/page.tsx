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
    isPending,
    error,
    reset,
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
                reset(); // clears any previous signature or error
                signMessage({ message });
              }}
              disabled={isPending}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                cursor: isPending ? "not-allowed" : "pointer",
              }}
            >
              {isPending ? "Confirme na carteira..." : "Assinar mensagem"}
            </button>

            {signature && (
              <p style={{ marginTop: "15px", wordBreak: "break-all" }}>
                <strong>Assinatura:</strong> {signature}
              </p>
            )}

            {error && (
              <p style={{ marginTop: "15px", color: "crimson" }}>
                Não foi possível assinar (você cancelou?).
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
