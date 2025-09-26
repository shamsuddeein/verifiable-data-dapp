const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const { ethers } = require('ethers');
const path = require('path');

// --- CONFIGURATION ---
// IMPORTANT: Fill these in after you deploy your contract!
const MONAD_TESTNET_RPC_URL = 'https://testnet-rpc.monad.xyz';
const YOUR_PRIVATE_KEY = ''; // CAUTION: Use a new, dedicated wallet for this.
const NOTARY_CONTRACT_ADDRESS = '0x0871db5C5F0722ca1CF85883eE637f33c9E81687';


// The ABI from your deployment - this is now complete.
const NOTARY_CONTRACT_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "bytes32",
          "name": "documentHash",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "ProofCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "storeHash",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_hash",
          "type": "bytes32"
        }
      ],
      "name": "getProofTimestamp",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];



// --- INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Set up blockchain connection
const provider = new ethers.JsonRpcProvider(MONAD_TESTNET_RPC_URL);
const wallet = new ethers.Wallet(YOUR_PRIVATE_KEY, provider);
const notaryContract = new ethers.Contract(NOTARY_CONTRACT_ADDRESS, NOTARY_CONTRACT_ABI, wallet);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// --- API ENDPOINT ---
app.post('/api/notarize', upload.single('document'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    try {
        // 1. Calculate the file's hash
        const fileBuffer = req.file.buffer;
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const hashBytes32 = '0x' + hash;

        console.log(`Calculated hash: ${hashBytes32}`);

        // 2. Check if the hash is already on the blockchain
        const existingTimestamp = await notaryContract.getProofTimestamp(hashBytes32);
        if (Number(existingTimestamp) > 0) {
            return res.status(409).json({
                success: false,
                message: 'This document has already been notarized.',
                timestamp: Number(existingTimestamp),
            });
        }
        
        // 3. Record the hash on the Monad blockchain
        console.log('Sending transaction to store hash on Monad...');
        const tx = await notaryContract.storeHash(hashBytes32);
        
        // 4. Wait for the transaction to be mined
        await tx.wait(); 
        console.log(`Transaction successful! TX Hash: ${tx.hash}`);

        // 5. Send the success response
        res.status(200).json({
            success: true,
            message: 'File notarized successfully!',
            fileHash: hash,
            transactionHash: tx.hash
        });

    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).json({ success: false, message: 'An internal server error occurred.' });
    }
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
