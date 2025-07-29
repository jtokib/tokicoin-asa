const { TokiCoinASA } = require('../core/tokicoin.js');
require('dotenv').config({ path: '../../.env.local' });

async function optInRecipient() {
    const tokiCoin = new TokiCoinASA('testnet');
    const ASSET_ID = parseInt(process.env.ASSET_ID);
    const RECIPIENT_ADDRESS = 'MXHJFVIIYEPA5Q2VFKDAAFEOJUFQLURG3JQZOFW7JY7XLYRNVP6PL6CEFM';
    
    // New recipient mnemonic
    const RECIPIENT_MNEMONIC = 'limit chat clock evidence drill cash process push inner uncover village wrist live rifle balance again novel acquire arrange that seek grit crane ability spoon';
    
    try {
        console.log('🔗 Opting recipient into new ASA:', ASSET_ID);
        const txId = await tokiCoin.optInToASA(ASSET_ID, RECIPIENT_MNEMONIC);
        console.log('✅ Opt-in successful!');
        console.log('📄 Transaction ID:', txId);
        
    } catch (error) {
        console.error('❌ Opt-in failed:', error.message);
    }
}

optInRecipient().catch(console.error);