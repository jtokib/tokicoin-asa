const algosdk = require('algosdk');

// TokiCoin (TOKI) ASA Creation Script
// This script creates the TokiCoin ASA on Algorand blockchain

class TokiCoinASA {
    constructor(network = 'testnet') {
        // Network configuration
        this.network = network;

        if (network === 'testnet') {
            this.algodClient = new algosdk.Algodv2(
                '',
                'https://testnet-api.algonode.cloud',
                ''
            );
        } else if (network === 'mainnet') {
            this.algodClient = new algosdk.Algodv2(
                '',
                'https://mainnet-api.algonode.cloud',
                ''
            );
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
            
            // Recover creator account from mnemonic
            const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);
            console.log('Creator Address:', creatorAccount.addr.substring(0, 8) + '...');

            // Set creator as manager, reserve, freeze, and clawback
            this.asaParams.manager = creatorAccount.addr;
            this.asaParams.reserve = creatorAccount.addr;
            this.asaParams.freeze = creatorAccount.addr;
            this.asaParams.clawback = creatorAccount.addr;

            // Get network parameters
            const suggestedParams = await this.algodClient.getTransactionParams().do();

            // Create asset creation transaction
            const txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
                creatorAccount.addr,
                undefined, // note
                this.asaParams.total,
                this.asaParams.decimals,
                this.asaParams.defaultFrozen,
                this.asaParams.manager,
                this.asaParams.reserve,
                this.asaParams.freeze,
                this.asaParams.clawback,
                this.asaParams.unitName,
                this.asaParams.assetName,
                this.asaParams.assetURL,
                this.asaParams.assetMetadataHash,
                suggestedParams
            );

            // Sign the transaction
            const signedTxn = txn.signTxn(creatorAccount.sk);

            // Submit to network
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
            console.log('Asset creation transaction sent. TxID:', txId);

            // Wait for confirmation
            const confirmedTxn = await this.waitForConfirmation(txId);
            const assetId = confirmedTxn['asset-index'];

            console.log('TokiCoin ASA created successfully!');
            console.log('Asset ID:', assetId);
            console.log('Transaction ID:', txId);

            return {
                assetId,
                txId,
                creatorAddress: creatorAccount.addr
            };

        } catch (error) {
            console.error('Error creating ASA:', error);
            throw error;
        }
    }

    async waitForConfirmation(txId) {
        let lastRound = (await this.algodClient.status().do())['last-round'];
        while (true) {
            const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
            if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
                return pendingInfo;
            }
            lastRound++;
            await this.algodClient.statusAfterBlock(lastRound).do();
        }
    }

    async getASAInfo(assetId) {
        try {
            const assetInfo = await this.algodClient.getAssetByID(assetId).do();
            return assetInfo;
        } catch (error) {
            console.error('Error getting ASA info:', error);
            throw error;
        }
    }

    async optInToASA(assetId, accountMnemonic) {
        try {
            const account = algosdk.mnemonicToSecretKey(accountMnemonic);
            const suggestedParams = await this.algodClient.getTransactionParams().do();

            const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
                account.addr,
                account.addr,
                undefined, // closeRemainderTo
                undefined, // revocationTarget
                0, // amount (0 for opt-in)
                undefined, // note
                assetId,
                suggestedParams
            );

            const signedTxn = txn.signTxn(account.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

            await this.waitForConfirmation(txId);
            console.log('Successfully opted in to ASA:', assetId);
            return txId;

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
            
            // Check sender balance
            const accountInfo = await this.algodClient.accountInformation(fromAccount.addr).do();
            const assetHolding = accountInfo.assets.find(asset => asset['asset-id'] === assetId);
            
            if (!assetHolding || assetHolding.amount < amount) {
                throw new Error('Insufficient balance for transfer');
            }
            const suggestedParams = await this.algodClient.getTransactionParams().do();

            const txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
                fromAccount.addr,
                toAddress,
                undefined, // closeRemainderTo
                undefined, // revocationTarget
                amount,
                undefined, // note
                assetId,
                suggestedParams
            );

            const signedTxn = txn.signTxn(fromAccount.sk);
            const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

            await this.waitForConfirmation(txId);
            console.log(`Successfully transferred ${amount} TOKI to ${toAddress}`);
            return txId;

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

    // Generate new account for testing (save this mnemonic securely!)
    const newAccount = tokiCoin.generateNewAccount();
    console.log('New account generated:');
    console.log('Address:', newAccount.address);
    console.log('Mnemonic:', newAccount.mnemonic);
    console.log('⚠️  SAVE THIS MNEMONIC SECURELY! ⚠️');

    // Fund the account with testnet ALGOs from: https://testnet.algoexplorer.io/dispenser
    console.log('\n📝 Next steps:');
    console.log('1. Fund your account with testnet ALGOs');
    console.log('2. Uncomment the createASA call below');
    console.log('3. Run the script again to create your ASA');

    // Uncomment to create ASA (ensure account is funded first)
    /*
    try {
        const result = await tokiCoin.createASA(newAccount.mnemonic);
        console.log('TokiCoin created:', result);
    } catch (error) {
        console.error('Failed to create TokiCoin:', error);
    }
    */
}

// Export for use in other scripts
module.exports = { TokiCoinASA };

// Run if called directly
if (require.main === module) {
    main();
}