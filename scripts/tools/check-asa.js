const { TokiCoinASA } = require('../core/tokicoin.js');
require('dotenv').config({ path: '../../.env.local' });

async function checkASA() {
    const tokiCoin = new TokiCoinASA('testnet');
    const ASSET_ID = parseInt(process.env.ASSET_ID);
    
    try {
        console.log('🔍 Checking ASA:', ASSET_ID);
        const assetInfo = await tokiCoin.getASAInfo(ASSET_ID);
        
        console.log('✅ ASA exists!');
        console.log('📊 Asset Info:');
        console.log('   Name:', assetInfo.params.name);
        console.log('   Unit Name:', assetInfo.params['unit-name']);
        console.log('   Total Supply:', Number(assetInfo.params.total) / 1000000, 'TOKI');
        console.log('   Decimals:', assetInfo.params.decimals);
        console.log('   Creator:', assetInfo.params.creator);
        console.log('   Manager:', assetInfo.params.manager);
        console.log('   Reserve:', assetInfo.params.reserve);
        
    } catch (error) {
        console.error('❌ ASA does not exist or error:', error.message);
    }
}

checkASA().catch(console.error);