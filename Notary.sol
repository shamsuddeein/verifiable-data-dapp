// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Notary
 * @dev This contract stores and verifies the existence of a document's hash
 * at a specific time, recorded by the transaction timestamp.
 */
contract Notary {
    // Mapping from a hash to the timestamp it was recorded
    mapping(bytes32 => uint256) private proofs;

    // Event to announce that a proof has been created
    event ProofCreated(bytes32 indexed documentHash, uint256 timestamp);

    /**
     * @dev Stores the hash of a document.
     * The timestamp is automatically recorded by the blockchain.
     * @param _hash The SHA-256 hash of the document.
     */
    function storeHash(bytes32 _hash) public {
        // Ensure the hash has not been stored before
        require(proofs[_hash] == 0, "This document hash has already been recorded.");
        
        // Record the timestamp of the transaction
        proofs[_hash] = block.timestamp;
        
        // Emit an event
        emit ProofCreated(_hash, block.timestamp);
    }

    /**
     * @dev Checks if a hash has been recorded and returns its timestamp.
     * @param _hash The SHA-256 hash of the document to check.
     * @return The timestamp when the hash was recorded (0 if not found).
     */
    function getProofTimestamp(bytes32 _hash) public view returns (uint256) {
        return proofs[_hash];
    }
}
