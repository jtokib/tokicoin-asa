# TokiCoin Scripts

This directory contains all scripts for TokiCoin ASA management, organized by purpose.

## Directory Structure

### `/core` - Core ASA Operations
- **`tokicoin.js`** - Main TokiCoinASA class with all core functionality
- **`distrbute.js`** - Batch distribution script for sending tokens to multiple addresses

### `/test` - Testing Scripts
- **`test-transfer.js`** - Test single token transfers
- **`test-distribution-EXAMPLE.js`** - Example distribution test
- **`test.js`** - General testing utilities

### `/tools` - Utility & Diagnostic Tools
- **`check-account.js`** - Check account balance and ASA holdings
- **`check-asa.js`** - Verify ASA information and parameters
- **`check-reserve.js`** - Check reserve address holdings
- **`generate-recipient.js`** - Generate new test recipient accounts
- **`opt-in-recipient.js`** - Opt accounts into ASA
- **`check-mnemonic.js`** - Verify mnemonic to address conversion

## Usage Examples

### Create a new ASA
```bash
node scripts/core/tokicoin.js
```

### Test a transfer
```bash
node scripts/test/test-transfer.js
```

### Check account balance
```bash
node scripts/tools/check-account.js
```

### Distribute tokens to multiple addresses
```bash
node scripts/core/distrbute.js
```

## Environment Variables

All scripts require `.env.local` in the project root with:
- `CREATOR_MNEMONIC` - Creator account mnemonic
- `ASSET_ID` - TokiCoin Asset ID
- Other configuration as documented in `.env.example`

## Security Notes

- Never commit `.env.local` or any file containing mnemonics
- Always test on testnet before mainnet deployment
- Ensure recipients have opted into the ASA before transfers
- Verify all addresses and amounts before executing transfers