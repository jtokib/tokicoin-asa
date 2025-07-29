const { AlgorandClient } = require('@algorandfoundation/algokit-utils');
const algosdk = require('algosdk');

// TokiCoin (TOKI) ASA Creation Script
// This script creates the TokiCoin ASA on Algorand blockchain using AlgoKit

class TokiCoinASA {
    constructor(network = 'testnet') {
        // Network configuration using AlgoKit
        this.network = network;
        
        // Initialize AlgorandClient with modern AlgoKit patterns
        if (network === 'testnet') {
            this.algorand = AlgorandClient.testNet();
        } else if (network === 'mainnet') {
            this.algorand = AlgorandClient.mainNet();
        } else {
            throw new Error('Invalid network. Use "testnet" or "mainnet"');
        }

        // TokiCoin ASA Parameters
        this.asaParams = {
            total: 20000000,           // 20 million tokens
            decimals: 6,               // 6 decimal places for micro-units
            defaultFrozen: false,      // Tokens not frozen by default
            unitName: 'TOKI',          // Unit name
            assetName: 'TokiCoin',     // Asset name
            assetURL: 'https://tokicoin.algo',  // Project website
            assetMetadataHash: undefined,       // Optional metadata hash
            manager: undefined,        // Will be set to creator address
            reserve: undefined,        // Will be set to creator address
            freeze: undefined,         // Will be set to creator address
            clawback: undefined,       // Will be set to creator address
        };
    }

    async createASA(creatorMnemonic) {
        try {
            // Validate mnemonic format
            if (!creatorMnemonic || typeof creatorMnemonic !== 'string') {
                throw new Error('Invalid mnemonic provided');
            }
            
            // Recover creator account from mnemonic and create AlgoKit signer
            const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);
            console.log('Creator Address:', creatorAccount.addr);
            
            // Create signer function for AlgoKit
            const signer = (txnGroup) => {
                return txnGroup.map(txn => txn.signTxn(creatorAccount.sk));
            };

            // Create ASA using AlgoKit's simplified interface
            const result = await this.algorand.send.assetCreate({
                sender: creatorAccount.addr,
                total: BigInt(this.asaParams.total * Math.pow(10, this.asaParams.decimals)),
                decimals: this.asaParams.decimals,
                defaultFrozen: this.asaParams.defaultFrozen,
                manager: creatorAccount.addr,
                reserve: creatorAccount.addr,
                freeze: creatorAccount.addr,
                clawback: creatorAccount.addr,
                unitName: this.asaParams.unitName,
                assetName: this.asaParams.assetName,
                url: this.asaParams.assetURL,
                metadataHash: this.asaParams.assetMetadataHash,
                signer: signer
            });

            console.log('TokiCoin ASA created successfully!');
            console.log('Asset ID:', result.confirmation.assetIndex);
            console.log('Transaction ID:', result.txIds[0]);

            return {
                assetId: result.confirmation.assetIndex,
                txId: result.txIds[0],
                creatorAddress: creatorAccount.addr
            };

        } catch (error) {
            console.error('Error creating ASA:', error);
            throw error;
        }
    }

    // AlgoKit handles transaction confirmation automatically

    async getASAInfo(assetId) {
        try {
            const assetInfo = await this.algorand.client.algod.getAssetByID(assetId).do();
            return assetInfo;
        } catch (error) {
            console.error('Error getting ASA info:', error);
            throw error;
        }
    }

    async optInToASA(assetId, accountMnemonic) {
        try {
            const account = algosdk.mnemonicToSecretKey(accountMnemonic);
            
            // Create signer function for AlgoKit
            const signer = (txnGroup) => {
                return txnGroup.map(txn => txn.signTxn(account.sk));
            };

            // Use AlgoKit's simplified asset opt-in
            const result = await this.algorand.send.assetOptIn({
                sender: account.addr,
                assetId: assetId,
                signer: signer
            });

            console.log('Successfully opted in to ASA:', assetId);
            return result.txIds[0];

        } catch (error) {
            console.error('Error opting in to ASA:', error);
            throw error;
        }
    }

    async transferASA(assetId, fromMnemonic, toAddress, amount) {
        try {
            // Validate inputs
            if (!assetId || !fromMnemonic || !toAddress || amount <= 0) {
                throw new Error('Invalid transfer parameters');
            }
            
            if (!algosdk.isValidAddress(toAddress)) {
                throw new Error('Invalid recipient address');
            }
            
            const fromAccount = algosdk.mnemonicToSecretKey(fromMnemonic);
            
            // Check sender balance using AlgoKit
            const accountInfo = await this.algorand.client.algod.accountInformation(fromAccount.addr).do();
            const assetHolding = accountInfo.assets.find(asset => Number(asset.assetId) === assetId || asset['asset-id'] === assetId);
            
            if (!assetHolding || assetHolding.amount < amount) {
                throw new Error('Insufficient balance for transfer');
            }

            // Create signer function for AlgoKit
            const signer = (txnGroup) => {
                return txnGroup.map(txn => txn.signTxn(fromAccount.sk));
            };

            // Use AlgoKit's simplified asset transfer
            const result = await this.algorand.send.assetTransfer({
                sender: fromAccount.addr,
                receiver: toAddress,
                assetId: assetId,
                amount: BigInt(amount),
                signer: signer
            });

            console.log(`Successfully transferred ${amount} TOKI to ${toAddress}`);
            return result.txIds[0];

        } catch (error) {
            console.error('Error transferring ASA:', error);
            throw error;
        }
    }

    generateNewAccount() {
        const account = algosdk.generateAccount();
        const mnemonic = algosdk.secretKeyToMnemonic(account.sk);

        return {
            address: account.addr,
            mnemonic: mnemonic,
            secretKey: account.sk
        };
    }
}

// Usage example
async function main() {
    const tokiCoin = new TokiCoinASA('testnet'); // Use 'mainnet' for production

    // Use existing mnemonic from environment
    require('dotenv').config({ path: '.env.local' });
    const existingMnemonic = process.env.CREATOR_MNEMONIC;
    
    if (!existingMnemonic) {
        console.error('❌ No CREATOR_MNEMONIC found in .env.local');
        return;
    }
    
    console.log('🚀 Creating new TokiCoin ASA with existing mnemonic...');
    
    try {
        const result = await tokiCoin.createASA(existingMnemonic);
        console.log('✅ TokiCoin created successfully!');
        console.log('📊 New Asset ID:', result.assetId);
        console.log('📄 Transaction ID:', result.txId);
        console.log('🔗 View on AlgoExplorer:');
        console.log(`https://testnet.explorer.perawallet.app/tx/${result.txId}`);
        console.log('\n📝 Update your .env.local with the new Asset ID:', result.assetId);
    } catch (error) {
        console.error('❌ Failed to create TokiCoin:', error.message);
    }
    
}

// Export for use in other scripts
module.exports = { TokiCoinASA };

// Run if called directly
if (require.main === module) {
    main();
}