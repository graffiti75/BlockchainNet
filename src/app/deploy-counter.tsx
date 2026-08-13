"use client";

import { useDeployContract, useWaitForTransactionReceipt } from "wagmi";
import { sepolia } from "wagmi/chains";

// ABI of the Counter contract.
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

// Compiled bytecode of Counter.sol (solc 0.8.26, optimizer on).
const counterBytecode =
  "0x6080604052348015600e575f80fd5b506101628061001c5f395ff3fe608060405234801561000f575f80fd5b506004361061003f575f3560e01c806306661abd146100435780632baeceb71461005d578063d09de08a14610067575b5f80fd5b61004b5f5481565b60405190815260200160405180910390f35b61006561006f565b005b6100656100db565b5f8054116100c35760405162461bcd60e51b815260206004820152601d60248201527f436f756e7465723a2063616e6e6f7420676f2062656c6f77207a65726f000000604482015260640160405180910390fd5b60015f808282546100d49190610100565b9091555050565b60015f808282546100d49190610119565b634e487b7160e01b5f52601160045260245ffd5b81810381811115610113576101136100ec565b92915050565b80820180821115610113576101136100ec56fea26469706673582212208e8d3ca4735714258ec8faf687b00b1b06e09e309890d0070e397b9007e2a2dc64736f6c634300081a0033" as `0x${string}`;

// TEMPORARY: use this once to deploy Counter, copy the address, then delete this component.
export function DeployCounter() {
  const { deployContract, data: hash, isPending, error } = useDeployContract();

  const { data: receipt, isLoading: isConfirming } =
    useWaitForTransactionReceipt({ hash });

  const deployedAddress = receipt?.contractAddress;

  return (
    <div
      style={{ marginTop: "40px", padding: "16px", border: "2px dashed #888" }}
    >
      <h2 style={{ fontSize: "18px" }}>⚙️ Deploy do Counter (temporário)</h2>
      <p style={{ color: "#888" }}>
        Conecte a Account 1 (0.199 ETH) na Sepolia e clique para publicar.
      </p>

      <button
        onClick={() =>
          deployContract({
            abi: counterAbi,
            bytecode: counterBytecode,
            chainId: sepolia.id,
          })
        }
        disabled={isPending || isConfirming}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          cursor: isPending || isConfirming ? "not-allowed" : "pointer",
        }}
      >
        {isPending
          ? "Confirme na carteira..."
          : isConfirming
            ? "Publicando na blockchain..."
            : "Deploy Counter"}
      </button>

      {deployedAddress && (
        <p
          style={{ marginTop: "15px", color: "green", wordBreak: "break-all" }}
        >
          <strong>Publicado!</strong> Endereço: {deployedAddress}
          <br />
          Copie esse endereço e cole em <code>COUNTER_ADDRESS</code> no arquivo{" "}
          <code>counter.tsx</code>. Depois pode apagar este componente.
        </p>
      )}

      {error && (
        <p
          style={{
            marginTop: "15px",
            color: "crimson",
            wordBreak: "break-all",
          }}
        >
          Falhou: {error.message}
        </p>
      )}
    </div>
  );
}
