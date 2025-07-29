const algosdk = require('algosdk');

const account = algosdk.generateAccount();
const mnemonic = algosdk.secretKeyToMnemonic(account.sk);

console.log('🔑 New recipient account generated:');
console.log('Address:', account.addr.toString());
console.log('Mnemonic:', mnemonic);
console.log('\n📝 Steps:');
console.log('1. Fund this address with testnet ALGOs from https://bank.testnet.algorand.network/');
console.log('2. Update test-transfer.js with this address');
console.log('3. Opt this account into the ASA');
console.log('4. Transfer tokens to this account');