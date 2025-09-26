# Verifiable Data Solutions: Digital Notary dApp

**Verifiable Data Solutions** is a decentralized application (dApp) that provides a trustless, immutable, and permanent way to prove the existence and integrity of any digital file. By leveraging the power of the **Monad blockchain**, this tool acts as a *digital notary*, creating a public record that can be verified by anyone, at any time, without relying on a central authority.

---

## Core Features

- **File Notarization**: Users can upload any digital file (documents, images, code, etc.) to create a permanent, timestamped proof of its existence on the Monad blockchain.
- **File Verification**: Users can upload a file to instantly check if it has been notarized previously and, if so, retrieve the exact date and time it was recorded.
- **Decentralized & Trustless**: The entire process is managed by a public smart contract, ensuring that no single entity can alter, delete, or censor a record.
- **User-Controlled**: Users interact with the dApp directly from their own crypto wallets (e.g., MetaMask), maintaining full control over their assets and actions.
- **Built for Monad**: Specifically designed to utilize the high-throughput, low-cost, and scalable infrastructure of the Monad network.

---

## Technology Stack

This project is built with modern, standard web technologies, making it robust and easy to maintain.

### Frontend
- **HTML5**: For the core structure and content.
- **CSS3**: For modern styling and a responsive user interface.
- **JavaScript (ES6+)**: For all client-side logic, interactivity, and wallet communication.

### Blockchain Integration
- **Ethers.js (v6)**: A complete and compact library for interacting with the Ethereum blockchain and its ecosystem (including EVM-compatible chains like Monad).
- **MetaMask**: The primary interface for users to manage their wallets and sign transactions.

### Smart Contract
- **Solidity**: The programming language used to write the `Notary.sol` smart contract.

### Target Blockchain
- **Monad Devnet**: The high-performance, EVM-compatible blockchain where the smart contract is deployed and all data is recorded.

---

## How It Works

The workflow is designed to be secure and efficient, with critical operations happening on the client-side.

1. **Wallet Connection**  
   The user connects their MetaMask wallet to the dApp. The application ensures the user is connected to the correct network (Monad Devnet).

2. **File Hashing (Client-Side)**  
   When a user uploads a file for notarization or verification, the file is never sent to a server. Instead, the browser uses JavaScript's built-in `crypto.subtle` API to calculate the file's unique SHA-256 hash.  
   > This is a critical security feature that preserves user privacy.

3. **Smart Contract Interaction**
   - **To Notarize**: The dApp prompts the user to sign a transaction that calls the `storeHash` function on the `Notary.sol` smart contract, passing the file's hash as an argument. The blockchain records the hash along with the current timestamp.
   - **To Verify**: The dApp makes a read-only call to the `getProofTimestamp` function on the contract, passing the file's hash. The contract checks its records and returns the timestamp if the hash exists, or `0` if it does not.

4. **Displaying Results**  
   The frontend interprets the result from the smart contract and displays a clear success or failure message to the user, including a link to the transaction on the Monad block explorer for independent verification.

---

## Setup & Deployment

To run this project, you need two main components: the deployed smart contract and the hosted frontend.

1. **Smart Contract**  
   The `Notary.sol` contract must be deployed to the Monad Devnet. This is done once using a tool like Remix IDE.

2. **Frontend Configuration**  
   The deployed contract address must be pasted into the `NOTARY_CONTRACT_ADDRESS` variable in the `index.html` file.

3. **Hosting**  
   The `index.html` file can be hosted on any static web hosting service, such as Netlify, Vercel, or GitHub Pages.

---

## Future Roadmap

This project has a strong foundation and can be expanded with several valuable features:

- **User Dashboard**: Allow users to see a history of all the files they have personally notarized.
- **Batch Notarization**: Enable businesses to notarize thousands of documents in a single transaction.
- **API Service**: Offer a paid API for other applications and businesses to integrate the notarization service into their own workflows.
- **Certificate Generation**: Create downloadable PDF certificates for each notarized file as a user-friendly proof.