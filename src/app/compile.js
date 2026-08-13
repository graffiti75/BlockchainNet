const fs = require("fs");
const solc = require("solc");

const input = {
  language: "Solidity",
  sources: {
    "Counter.sol": { content: fs.readFileSync("../Counter.sol", "utf8") },
  },
  settings: {
    optimizer: { enabled: true, runs: 200 },
    outputSelection: { "*": { "*": ["abi", "evm.bytecode.object"] } },
  },
};

const out = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("0x" + out.contracts["Counter.sol"]["Counter"].evm.bytecode.object);
