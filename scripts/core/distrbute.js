const { TokiCoinASA } = require('./tokicoin.js');

// TokiCoin Distribution Script
// Use this to distribute TOKI tokens to friends

class TokiDistributor {
    constructor(network = 'mainnet') {
        this.tokiCoin = new TokiCoinASA(network);
        this.network = network;
    }

    async distributeToFriends(assetId, creatorMnemonic, recipients, batchSize = 5) {
        // Validate inputs
        if (!assetId || !creatorMnemonic || !Array.isArray(recipients)) {
            throw new Error('Invalid distribution parameters');
        }
        
        if (recipients.length === 0) {
            throw new Error('No recipients provided');
        }
        
        // Check creator balance before starting
        const algosdk = require('algosdk');
        const creatorAccount = algosdk.mnemonicToSecretKey(creatorMnemonic);
        const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);
        
        const accountInfo = await this.tokiCoin.algorand.client.algod.accountInformation(creatorAccount.addr).do();
        const assetHolding = accountInfo.assets.find(asset => asset.assetId === BigInt(assetId));
        
        if (!assetHolding || Number(assetHolding.amount) < totalAmount) {
            throw new Error(`Insufficient balance. Need ${totalAmount}, have ${assetHolding?.amount || 0}`);
        }
        
        console.log(`Starting distribution of TOKI tokens on ${this.network}`);
        console.log(`Asset ID: ${assetId}`);
        console.log(`Recipients: ${recipients.length}`);

        let successful = 0;
        let failed = 0;

        // Process recipients in batches to avoid overwhelming the network
        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);

            console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(recipients.length / batchSize)}`);

            const batchPromises = batch.map(async (recipient) => {
                try {
                    // Check if recipient needs to opt-in first
                    if (recipient.needsOptIn) {
                        console.log(`${recipient.name} needs to opt-in first: ${recipient.address}`);
                        return { success: false, reason: 'needs_opt_in', recipient };
                    }

                    const txId = await this.tokiCoin.transferASA(
                        assetId,
                        creatorMnemonic,
                        recipient.address,
                        recipient.amount
                    );

                    console.log(`✅ Sent ${recipient.amount / 1000000} TOKI to ${recipient.name} (${recipient.address})`);
                    console.log(`   Transaction ID: ${txId}`);

                    return { success: true, txId, recipient };

                } catch (error) {
                    console.error(`❌ Failed to send to ${recipient.name} (${recipient.address}):`, error.message);
                    return { success: false, error: error.message, recipient };
                }
            });

            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach((result) => {
                if (result.status === 'fulfilled') {
                    if (result.value.success) {
                        successful++;
                    } else {
                        failed++;
                    }
                } else {
                    failed++;
                }
            });

            // Wait between batches to be nice to the network
            if (i + batchSize < recipients.length) {
                console.log('Waiting 2 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        console.log(`\n📊 Distribution Summary:`);
        console.log(`✅ Successful: ${successful}`);
        console.log(`❌ Failed: ${failed}`);
        console.log(`📈 Success Rate: ${((successful / recipients.length) * 100).toFixed(1)}%`);

        return { successful, failed };
    }

    async checkOptInStatus(assetId, addresses) {
        console.log('Checking opt-in status for recipients...');

        for (const address of addresses) {
            try {
                const accountInfo = await this.tokiCoin.algorand.client.algod.accountInformation(address).do();
                const hasOptedIn = accountInfo.assets.some(asset => asset.assetId === BigInt(assetId));

                console.log(`${address}: ${hasOptedIn ? '✅ Opted in' : '❌ Not opted in'}`);
            } catch (error) {
                console.log(`${address}: ❓ Account not found or error`);
            }
        }
    }

    generateDistributionReport(assetId, recipients) {
        const totalAmount = recipients.reduce((sum, r) => sum + r.amount, 0);
        const averageAmount = totalAmount / recipients.length;

        console.log(`\n📋 Distribution Plan Report:`);
        console.log(`Asset ID: ${assetId}`);
        console.log(`Total Recipients: ${recipients.length}`);
        console.log(`Total Amount: ${totalAmount / 1000000} TOKI`);
        console.log(`Average Amount: ${averageAmount / 1000000} TOKI`);
        console.log(`Network: ${this.network}`);

        console.log(`\nRecipients:`);
        recipients.forEach((recipient, index) => {
            console.log(`${index + 1}. ${recipient.name}: ${recipient.amount / 1000000} TOKI`);
        });
    }
}

// Example usage and configuration
async function main() {
    // Configuration - UPDATE THESE VALUES
    const CONFIG = {
        network: 'testnet', // Change to 'mainnet' for production
        assetId: 743521125, // Your TokiCoin Asset ID
        creatorMnemonic: process.env.CREATOR_MNEMONIC || 'YOUR_CREATOR_MNEMONIC_HERE', // Use environment variable
    };

    // Friend list - UPDATE WITH ACTUAL ADDRESSES
    const friends = [
        {
            name: 'Alice',
            address: 'ALICE_ALGORAND_ADDRESS_HERE',
            amount: 1000000, // 1 TOKI (1,000,000 micro-units)
            needsOptIn: false
        },
        {
            name: 'Bob',
            address: 'BOB_ALGORAND_ADDRESS_HERE',
            amount: 5000000, // 5 TOKI
            needsOptIn: false
        },
        {
            name: 'Charlie',
            address: 'CHARLIE_ALGORAND_ADDRESS_HERE',
            amount: 2000000, // 2 TOKI
            needsOptIn: true // This person needs to opt-in first
        },
        {
            name: 'Diana',
            address: 'DIANA_ALGORAND_ADDRESS_HERE',
            amount: 1000000, // 1 TOKI
            needsOptIn: false
        }
    ];

    // Validation
    if (CONFIG.assetId === 0) {
        console.error('❌ Please set the Asset ID in CONFIG');
        return;
    }

    if (CONFIG.creatorMnemonic === 'YOUR_CREATOR_MNEMONIC_HERE' || !CONFIG.creatorMnemonic) {
        console.error('❌ Please set your creator mnemonic in CONFIG or CREATOR_MNEMONIC environment variable');
        return;
    }

    if (friends.some(f => f.address.includes('_ADDRESS_HERE'))) {
        console.error('❌ Please update friend addresses in the friends array');
        return;
    }

    const distributor = new TokiDistributor(CONFIG.network);

    try {
        // Generate report
        distributor.generateDistributionReport(CONFIG.assetId, friends);

        // Check opt-in status
        const addresses = friends.map(f => f.address);
        await distributor.checkOptInStatus(CONFIG.assetId, addresses);

        // Confirm before proceeding
        console.log('\n⚠️  Are you sure you want to proceed with distribution?');
        console.log('This will send real tokens and cost ALGO in transaction fees.');
        console.log('Uncomment the distribution call below to proceed.\n');

        // Uncomment the line below to actually distribute tokens
        // await distributor.distributeToFriends(CONFIG.assetId, CONFIG.creatorMnemonic, friends);

    } catch (error) {
        console.error('Distribution failed:', error);
    }
}

// Helper function to create a recipient list from CSV
function createRecipientsFromCSV(csvData) {
    // Example CSV format: name,address,amount
    const recipients = [];
    const lines = csvData.trim().split('\n');

    for (let i = 1; i < lines.length; i++) { // Skip header
        const [name, address, amount] = lines[i].split(',');
        recipients.push({
            name: name.trim(),
            address: address.trim(),
            amount: parseInt(amount.trim()) * 1000000, // Convert to micro-units
            needsOptIn: false
        });
    }

    return recipients;
}

// Export for use in other scripts
module.exports = { TokiDistributor, createRecipientsFromCSV };

// Run if called directly
if (require.main === module) {
    main();
}