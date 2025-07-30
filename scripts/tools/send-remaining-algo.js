const { TokiCoinASA } = require('../core/tokicoin.js');
const { microAlgos } = require('@algorandfoundation/algokit-utils');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

async function sendRemainingAlgo() {
    const network = process.env.NETWORK || 'mainnet';
    const tokiCoin = new TokiCoinASA(network);
    
    // Get creator account from mnemonic
    const creatorAccount = require('algosdk').mnemonicToSecretKey(process.env.CREATOR_MNEMONIC);
    const recipientAddress = process.env.TEST_RECIPIENT_ADDRESS || process.env.TARGET_RECIPIENT_ADDRESS;
    
    if (!recipientAddress) {
        console.error('❌ No recipient address found in .env.local');
        console.error('   Please set TEST_RECIPIENT_ADDRESS or TARGET_RECIPIENT_ADDRESS');
        return;
    }
    
    try {
        console.log('🔍 Checking creator account balance...');
        const accountInfo = await tokiCoin.algorand.client.algod.accountInformation(creatorAccount.addr).do();
        const currentBalance = Number(accountInfo.amount);
        
        console.log('💰 Current ALGO Balance:', currentBalance / 1000000, 'ALGO');
        console.log('📤 Recipient Address:', recipientAddress);
        
        // Reserve minimum balance for account with assets (0.2 ALGO = 200,000 microAlgos)  
        // Base account: 100,000 + (Number of assets * 100,000)
        const assetsCount = accountInfo.assets.length;
        const minimumBalance = 100000 + (assetsCount * 100000);
        // Transaction fee (typically 1000 microAlgos)
        const transactionFee = 1000;
        
        console.log('📊 Account has', assetsCount, 'assets');
        console.log('💰 Required minimum balance:', minimumBalance / 1000000, 'ALGO');
        
        const availableToSend = currentBalance - minimumBalance - transactionFee;
        
        if (availableToSend <= 0) {
            console.log('❌ Insufficient balance to send ALGO');
            console.log('   Current:', currentBalance / 1000000, 'ALGO');
            console.log('   Minimum required:', (minimumBalance + transactionFee) / 1000000, 'ALGO');
            return;
        }
        
        console.log('💸 Amount to send:', availableToSend / 1000000, 'ALGO');
        console.log('💸 Raw micro-algos:', availableToSend);
        
        // Get suggested transaction parameters
        const suggestedParams = await tokiCoin.algorand.client.algod.getTransactionParams().do();
        
        // Validate addresses
        const fromAddress = creatorAccount.addr.toString();
        console.log('🔍 Creator address:', fromAddress);
        console.log('🔍 Recipient address:', recipientAddress);
        
        if (!require('algosdk').isValidAddress(recipientAddress)) {
            throw new Error(`Invalid recipient address: ${recipientAddress}`);
        }
        
        if (!require('algosdk').isValidAddress(fromAddress)) {
            throw new Error(`Invalid creator address: ${fromAddress}`);
        }
        
        console.log('📤 Creating and sending payment transaction...');
        
        // Set the sender's private key for signing
        tokiCoin.algorand.setSignerFromAccount(creatorAccount);
        
        // Use AlgorandClient to send payment
        const result = await tokiCoin.algorand.send.payment({
            sender: String(creatorAccount.addr),
            receiver: recipientAddress,
            amount: microAlgos(availableToSend)
        });
        
        console.log('✅ Transaction sent!');
        console.log('🔗 Transaction ID:', result.txId);
        
        // Wait for confirmation
        console.log('⏳ Waiting for confirmation...');
        const confirmedTxn = result;
        
        console.log('✅ Transaction confirmed in round:', confirmedTxn.confirmedRound || 'confirmed');
        
        // Show final balances
        console.log('\n📊 Final Status:');
        const finalAccountInfo = await tokiCoin.algorand.client.algod.accountInformation(creatorAccount.addr).do();
        console.log('💰 Creator remaining balance:', Number(finalAccountInfo.amount) / 1000000, 'ALGO');
        
        const explorerUrl = network === 'mainnet' 
            ? `https://explorer.perawallet.app/tx/${result.txId}`
            : `https://testnet.explorer.perawallet.app/tx/${result.txId}`;
        console.log('🔗 View on explorer:', explorerUrl);
        
    } catch (error) {
        console.error('❌ Error sending ALGO:', error.message);
        if (error.response && error.response.body) {
            console.error('Response details:', error.response.body);
        }
    }
}

// Run if called directly
if (require.main === module) {
    sendRemainingAlgo().catch(console.error);
}

module.exports = { sendRemainingAlgo };