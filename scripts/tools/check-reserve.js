const { TokiCoinASA } = require('../core/tokicoin.js');
require('dotenv').config({ path: '../../.env.local' });

async function checkReserve() {
    const tokiCoin = new TokiCoinASA('testnet');
    const ASSET_ID = parseInt(process.env.ASSET_ID);
    
    try {
        const assetInfo = await tokiCoin.getASAInfo(ASSET_ID);
        const reserveAddress = assetInfo.params.reserve;
        
        console.log('🏦 Reserve Address:', reserveAddress);
        
        if (reserveAddress) {
            const accountInfo = await tokiCoin.algorand.client.algod.accountInformation(reserveAddress).do();
            const assetHolding = accountInfo.assets.find(asset => Number(asset.assetId) === ASSET_ID);
            
            if (assetHolding) {
                console.log('💰 Reserve holds:', Number(assetHolding.amount) / 1000000, 'TOKI');
            } else {
                console.log('❌ Reserve has no TOKI tokens');
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

checkReserve().catch(console.error);