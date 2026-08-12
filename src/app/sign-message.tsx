"use client";

import { useSignMessage } from "wagmi";

export function SignMessage() {
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
  );
}
