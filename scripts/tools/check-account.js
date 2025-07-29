const { TokiCoinASA } = require('../core/tokicoin.js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env.local') });

async function checkAccount() {
    const tokiCoin = new TokiCoinASA('testnet');
    const ASSET_ID = parseInt(process.env.ASSET_ID);
    const creatorAccount = require('algosdk').mnemonicToSecretKey(process.env.CREATOR_MNEMONIC);
    const ADDRESS = creatorAccount.addr.toString();
    
    try {
        console.log('🔍 Checking account:', ADDRESS);
        const accountInfo = await tokiCoin.algorand.client.algod.accountInformation(ADDRESS).do();
        
        console.log('💰 ALGO Balance:', Number(accountInfo.amount) / 1000000, 'ALGO');
        console.log('📊 Assets:', accountInfo.assets.length);
        
        const assetHolding = accountInfo.assets.find(asset => Number(asset.assetId) === ASSET_ID || asset['asset-id'] === ASSET_ID);
        
        if (assetHolding) {
            console.log('✅ Has opted into Asset ID:', ASSET_ID);
            console.log('💎 TOKI Balance:', Number(assetHolding.amount) / 1000000, 'TOKI');
            console.log('💎 Raw micro-units:', Number(assetHolding.amount));
        } else {
            console.log('❌ Has NOT opted into Asset ID:', ASSET_ID);
            console.log('📝 All assets:');
            accountInfo.assets.forEach(asset => {
                console.log(`   - Asset ID: ${asset['asset-id'] || 'undefined'}, Balance: ${asset.amount || 0}`);
                console.log(`   - Asset object keys:`, Object.keys(asset));
                for (const key in asset) {
                    console.log(`     ${key}: ${asset[key]}`);
                }
            });
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkAccount().catch(console.error);