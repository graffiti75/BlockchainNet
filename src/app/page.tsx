"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { switchChain } = useSwitchChain();

  console.log("balance:", balance);
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
        </div>
      )}
    </main>
  );
}
