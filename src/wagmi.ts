import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, mainnet, base, arbitrum } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Meu App Blockchain",
  projectId: "9d0cf55912bb1ea5b9cc40b0399f50bd", // ← coloque o ID que pegou no dashboard.reown.com
  chains: [sepolia, mainnet, base, arbitrum],
  ssr: true,
});
