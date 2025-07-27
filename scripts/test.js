const { TokiCoinASA } = require('./tokicoin.js');

async function test() {
    const tokiCoin = new TokiCoinASA('testnet');

    // Replace with your actual values
    const assetId = 123456789; // Your Asset ID from Step 5
    const creatorMnemonic = 'your 25 word mnemonic here';

    // Generate a test recipient account
    const testAccount = tokiCoin.generateNewAccount();
    console.log('Test account:', testAccount.address);

    try {
        // Test opt-in
        await tokiCoin.optInToASA(assetId, testAccount.mnemonic);
        console.log('✅ Opt-in successful');

        // Test transfer
        await tokiCoin.transferASA(assetId, creatorMnemonic, testAccount.address, 1000000);
        console.log('✅ Transfer successful');

        // Get ASA info
        const info = await tokiCoin.getASAInfo(assetId);
        console.log('ASA Info:', info);

    } catch (error) {
        console.error('Test failed:', error);
    }
}

test();