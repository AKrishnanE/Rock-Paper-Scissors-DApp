# Rock–Paper–Scissors — DApp

**Project description**

This is a small, beginner-friendly decentralized application (dApp) that implements a Rock–Paper–Scissors game on Ethereum-compatible testnets. A player chooses Rock / Paper / Scissors in the browser UI. Each play creates a blockchain transaction that calls the smart contract's `play(uint8 _move)` function. The contract selects a pseudo-random move, compares the moves, updates the player's score, and stores the last moves on-chain.

> **Important:** This simplified version uses on-chain pseudo-randomness (`keccak256(block.timestamp, block.prevrandao, msg.sender)`) which is NOT cryptographically secure. Use only for learning and on testnets.

---

## Features

* Simple Solidity smart contract (`RPS.sol`) implementing the game logic
* Per-address score tracking on-chain (`mapping(address => int256) scores`)
* UI with three buttons: Rock, Paper, Scissors
* MetaMask integration for signing transactions (ethers.js v6)
* Displays contract move, result (Win/Lose/Draw) and player's score
* Emits a `Played` event on every round

---

## Contract address + test network used

* **Contract address (example from development):** `0x67b9303BF2902A5c0761d1419Cfa4192b2640f4E`
* **Test network used:** `Hoodi` (custom testnet) — *Replace with the actual network you deployed to, e.g., Sepolia, Goerli, or your custom network.*

> If you deployed to a different testnet, update the address and network name in this README and in `script.js`.

---

## Steps to deploy the smart contract (Remix)

1. Open **[https://remix.ethereum.org](https://remix.ethereum.org)** in Chrome/Brave (where MetaMask extension is installed).
2. Create a new file named `RPS.sol` and paste the Solidity contract code.
3. In the **Solidity Compiler** tab set the compiler to `0.8.19` (or compatible `^0.8.x`) and click **Compile**.
4. Go to the **Deploy & Run Transactions** tab.

   * For **Environment** choose **Injected Provider - MetaMask**.
   * Make sure MetaMask is connected to the same test network you want to deploy to (Hoodi / Sepolia / etc.).
5. Click **Deploy** next to the `RPS` contract. Confirm the transaction in MetaMask.
6. After deployment copy the contract address and the ABI (Compilation → ABI).
7. Paste the contract address into `script.js` (replace the `CONTRACT_ADDRESS` constant). Also paste the ABI JSON into `CONTRACT_ABI`.

---

## Steps to run the frontend (local)

1. Clone the repository locally.

```bash
git clone <your-github-repo-url>
cd <repo-folder>
```

2. Ensure the frontend files are present: `index.html`, `script.js`, and (`rps-debug.js` if used for debugging).
3. Make sure `script.js` contains the deployed contract address and ABI.
4. Serve the frontend over HTTP (MetaMask does not reliably inject on `file://` origins):

* Using VS Code Live Server: Right-click `index.html` → **Open with Live Server**
* Or using Python builtin server:

```bash
python -m http.server 5500
# then open http://127.0.0.1:5500 in your browser
```

5. Open the served page in the same browser profile where MetaMask is installed.
6. Click **Connect Wallet** and confirm MetaMask’s account access.
7. Click Rock / Paper / Scissors — confirm the transaction in MetaMask — watch the UI update after the transaction is mined.

---

## Screenshots
<img width="721" height="690" alt="image" src="https://github.com/user-attachments/assets/2fe29bc6-8d80-48d7-b2e6-449192f9e498" /> 
