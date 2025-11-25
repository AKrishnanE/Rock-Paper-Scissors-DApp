// script.js
// Replace CONTRACT_ADDRESS with the address you deployed in Remix
const CONTRACT_ADDRESS = "0x67b9303BF2902A5c0761d1419Cfa4192b2640f4E";
const CONTRACT_ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum RPS.Move",
				"name": "playerMove",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum RPS.Move",
				"name": "contractMove",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "int8",
				"name": "result",
				"type": "int8"
			},
			{
				"indexed": false,
				"internalType": "int256",
				"name": "newScore",
				"type": "int256"
			}
		],
		"name": "Played",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getMyScore",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastContractMove",
		"outputs": [
			{
				"internalType": "enum RPS.Move",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastPlayerMove",
		"outputs": [
			{
				"internalType": "enum RPS.Move",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "lastResult",
		"outputs": [
			{
				"internalType": "int8",
				"name": "",
				"type": "int8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_move",
				"type": "uint8"
			}
		],
		"name": "play",
		"outputs": [
			{
				"internalType": "enum RPS.Move",
				"name": "contractMove",
				"type": "uint8"
			},
			{
				"internalType": "int8",
				"name": "result",
				"type": "int8"
			},
			{
				"internalType": "int256",
				"name": "newScore",
				"type": "int256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "scores",
		"outputs": [
			{
				"internalType": "int256",
				"name": "",
				"type": "int256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// ---------- UI Elements ----------
const connectBtn = document.getElementById("connectButton");
const accountEl = document.getElementById("accountDisplay");
const netEl = document.getElementById("networkDisplay");
const resultEl = document.getElementById("resultText");
const contractMoveEl = document.getElementById("contractMove");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");

const rockBtn = document.getElementById("rockBtn");
const paperBtn = document.getElementById("paperBtn");
const scissorsBtn = document.getElementById("scissorsBtn");

// ---------- State ----------
let provider, signer, contract;

// ---------- Helpers ----------
function logStatus(msg, error = false) {
    statusEl.textContent = msg;
    (error ? console.error : console.log)("STATUS:", msg);
}

function moveToString(n) {
    return ["Rock", "Paper", "Scissors"][n] || "Unknown";
}

function extractError(err) {
    return err?.reason || err?.error?.message || err?.message || JSON.stringify(err);
}

// ---------- Debug Provider Setup ----------
async function setupProvider() {
    console.log("Checking for window.ethereum...");
    if (!window.ethereum) {
        logStatus("MetaMask not found.", true);
        alert("MetaMask not detected.");
        return false;
    }

    if (typeof ethers === "undefined") {
        logStatus("ethers.js not loaded!", true);
        return false;
    }

    try {
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        const net = await provider.getNetwork();
        const addr = await signer.getAddress();

        accountEl.textContent = "Connected: " + addr;
        netEl.textContent = `Network: ${net.name} (chainId ${net.chainId})`;

        console.log("Provider OK:", { net, addr, contract });

        return true;
    } catch (err) {
        console.error("setupProvider error:", err);
        logStatus("setupProvider failed: " + extractError(err), true);
        return false;
    }
}

// ---------- Connect Wallet ----------
async function connectWallet() {
    console.log("Connect Wallet clicked");

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        console.log("Accounts returned:", accounts);

        await setupProvider();
    } catch (err) {
        console.error("connectWallet error:", err);
        logStatus("Connect error: " + extractError(err), true);
    }
}

// ---------- Play Move ----------
async function playMove(move) {
    if (!contract) {
        const ok = await setupProvider();
        if (!ok) return;
    }

    logStatus("Sending transaction...");

    try {
        const tx = await contract.play(move);
        console.log("TX object:", tx);
        logStatus("Waiting for confirmation...");

        await tx.wait();
        logStatus("Tx confirmed. Reading results...");

        const pMove = await contract.lastPlayerMove();
        const cMove = await contract.lastContractMove();
        const myAddr = await signer.getAddress();
        const sc = await contract.getMyScore(myAddr);

        const pm = Number(pMove);
        const cm = Number(cMove);

        let result = "Draw";
        if (pm !== cm) {
            if ((pm + 1) % 3 === cm) result = "You Lose";
            else result = "You Win";
        }

        resultEl.textContent = "Result: " + result;
        contractMoveEl.textContent = "Contract played: " + moveToString(cm);
        scoreEl.textContent = "Your score: " + sc.toString();

    } catch (err) {
        console.error("playMove error:", err);
        logStatus("Error: " + extractError(err), true);
    }
}

// ---------- Attach Handlers Safely ----------
function attachHandlers() {
    console.log("Attaching event handlers...");

    connectBtn.onclick = () => connectWallet();
    rockBtn.onclick = () => playMove(0);
    paperBtn.onclick = () => playMove(1);
    scissorsBtn.onclick = () => playMove(2);

    console.log("Handlers attached.");
}

// ---------- Bootstrap ----------
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM Ready");
    attachHandlers();

    if (window.ethereum) {
        console.log("ethereum detected. Initializing...");
        setupProvider().catch(e => console.warn("Auto setup failed:", e));
    }
});
