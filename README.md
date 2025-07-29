# TokiCoin (TOKI) 🪙

A completely pointless memecoin built on the Algorand blockchain as an Algorand Standard Asset (ASA).

![TokiCoin](https://img.shields.io/badge/TokiCoin-TOKI-gold) ![Algorand](https://img.shields.io/badge/Blockchain-Algorand-blue) ![ASA](https://img.shields.io/badge/Type-ASA-green) ![License](https://img.shields.io/badge/License-MIT-brightgreen)

> **Warning**: This is a memecoin with absolutely no utility or value. Created purely for fun and educational purposes.

## Overview

TokiCoin is a memecoin created purely for fun and to share with friends. It has no utility, no roadmap, and no grand mission - just like a good memecoin should be. Built on Algorand for fast, cheap transactions.

## Token Economics

- **Total Supply**: 20,000,000 TOKI
- **Initial Market Cap**: $20
- **Initial Price**: $0.000001 per TOKI
- **Decimals**: 6
- **Symbol**: TOKI
- **Network**: Algorand (Mainnet)

## Technical Requirements

### Prerequisites

- Node.js 22.0.0 or higher
- npm 10.0.0 or higher
- AlgoKit Utils v9.1.2+ (automatically installs with `npm install`)
- Algorand SDK v3.3.1+ (automatically installs with `npm install`)
- Algorand wallet with ALGO for transaction fees
- Basic understanding of blockchain transactions

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/tokicoin-asa.git
cd tokicoin-asa
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables for local testing:
```bash
cp .env.example .env.local
# Edit .env.local with your testnet configuration
# NEVER commit .env.local to version control!
```

4. Set up website (optional):
```bash
cd website
npm install
cp .env.example .env.local
# Edit website/.env.local with your asset configuration
```

## Usage

### Creating the ASA on Testnet

1. Generate a new account and create ASA:
```bash
node scripts/core/tokicoin.js
```

2. Fund the generated account with testnet ALGOs:
   - Visit [Algorand Testnet Dispenser](https://bank.testnet.algorand.network/)
   - Enter your account address
   - Request testnet ALGOs

3. Update .env.local with your mnemonic and run creation script again

### Creating the ASA on Mainnet

⚠️ **Warning**: This will create a real asset on Algorand mainnet and cost real ALGOs.

1. Change network to 'mainnet' in the script
2. Use a funded mainnet account
3. Run the creation script

### Token Distribution

Use the batch distribution script for multiple recipients:

```bash
node scripts/core/distrbute.js
```

### Testing Transfers

Test single token transfers:

```bash
node scripts/test/test-transfer.js
```

### Utility Scripts

Check account balances and ASA information:

```bash
# Check account balance
node scripts/tools/check-account.js

# Check ASA information
node scripts/tools/check-asa.js

# Generate new recipient account
node scripts/tools/generate-recipient.js
```

## API Reference

### TokiCoinASA Class

#### Constructor
```javascript
const tokiCoin = new TokiCoinASA(network);
```
- `network`: 'testnet' or 'mainnet'

#### Methods

##### `createASA(creatorMnemonic)`
Creates the TokiCoin ASA on the specified network.

**Parameters:**
- `creatorMnemonic`: 25-word mnemonic phrase of the creator account

**Returns:** Promise resolving to `{ assetId, txId, creatorAddress }`

##### `optInToASA(assetId, accountMnemonic)`
Opts an account into the ASA (required before receiving tokens).

**Parameters:**
- `assetId`: The ASA ID
- `accountMnemonic`: 25-word mnemonic phrase of the account

**Returns:** Promise resolving to transaction ID

##### `transferASA(assetId, fromMnemonic, toAddress, amount)`
Transfers tokens between accounts.

**Parameters:**
- `assetId`: The ASA ID
- `fromMnemonic`: Sender's mnemonic
- `toAddress`: Recipient's address
- `amount`: Amount to transfer (in micro-units)

**Returns:** Promise resolving to transaction ID

##### `getASAInfo(assetId)`
Gets information about the ASA.

**Parameters:**
- `assetId`: The ASA ID

**Returns:** Promise resolving to ASA information

##### `generateNewAccount()`
Generates a new Algorand account.

**Returns:** `{ address, mnemonic, secretKey }`

## Security Considerations

### 🔒 Critical Security Features
- **Comprehensive `.gitignore`**: Blocks all sensitive files (`*.mnemonic`, `*private*`, `*secret*`, etc.)
- **Environment Variables**: All sensitive data in `.env.local` (never committed)
- **Input Validation**: Address validation and balance checks before transactions
- **Mnemonic Protection**: Console logging of sensitive data is masked/disabled
- **Network Separation**: Mainnet files are blocked from accidental commits

### 🛡️ Best Practices
1. **NEVER store mnemonics in code** - Use environment variables only
2. **Test on testnet first** - Always validate functionality before mainnet
3. **Use environment variables** - Keep all configuration in `.env.local`
4. **Verify recipients** - Ensure recipients have opted-in before transfers
5. **Check balances** - Validate sufficient funds before transactions
6. **Backup safely** - Store mnemonics securely offline, never in digital files
7. **Remove test files** - Delete any scripts with real addresses/mnemonics
8. **Check git status** - Ensure no sensitive files are staged for commit

### 🚨 CRITICAL Security Reminders
- Run `git status` before every commit to check for sensitive files
- Use `export CREATOR_MNEMONIC="..."` for temporary environment variables
- Delete test files with real data after use
- Never commit files ending in `*-test.js`, `test-*.js`, or `TESTING_*.md`

## Deployment Steps

### Testnet Deployment

1. Generate creator account
2. Fund with testnet ALGOs
3. Create ASA
4. Test transfers
5. Verify functionality

### Mainnet Deployment

1. Prepare funded mainnet account
2. Update network configuration
3. Create ASA on mainnet
4. Update website with Asset ID
5. Begin distribution

## File Structure

```
tokicoin-asa/
├── package.json                # Node.js dependencies
├── README.md                   # This file  
├── CLAUDE.md                   # Project instructions and status
├── SECURITY_AUDIT.md           # Security review documentation
├── scripts/
│   ├── README.md              # Scripts documentation
│   ├── core/                  # Core ASA operations
│   │   ├── tokicoin.js       # Main TokiCoinASA class
│   │   └── distrbute.js      # Batch distribution script
│   ├── test/                  # Testing scripts
│   │   ├── test-transfer.js  # Transfer testing
│   │   └── test.js           # General testing utilities
│   └── tools/                 # Utility scripts
│       ├── check-account.js  # Account balance checker
│       ├── check-asa.js      # ASA information checker
│       └── generate-recipient.js # Account generator
└── website/                   # Modern Vite website
    ├── index.html             # Main HTML file with SEO meta tags
    ├── package.json           # Website dependencies
    ├── netlify.toml           # Netlify deployment config
    ├── public/
    │   └── tokicoin-favicon.svg # Custom favicon
    └── src/
        ├── main.js            # Main JavaScript with copy functionality
        └── style.css          # Responsive CSS with animations
```

## Website Features

The TokiCoin website has been modernized with Vite and includes:

### Enhanced Features
- ✅ **Copy-to-clipboard** functionality for Asset ID
- ✅ **Responsive design** for mobile and desktop
- ✅ **SEO optimized** with proper meta tags
- ✅ **PWA ready** with custom favicon
- ✅ **Modern build system** with Vite
- ✅ **Netlify deployment** configuration
- ✅ **Interactive buttons** for wallet integration
- ✅ **Loading animations** and smooth transitions

### Website Development

To run the website locally:

```bash
cd website
npm install
npm run dev
```

To build for production:
```bash
npm run build
```

To preview production build:
```bash
npm run preview
```

### Deployment

#### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set base directory to `website`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Netlify will automatically detect the configuration from `netlify.toml`

#### Manual Deployment
1. Run `npm run build` in the website directory
2. Upload the `dist` folder to your hosting provider
3. Configure redirects to `index.html` for SPA routing

#### Netlify CLI Deployment
```bash
cd website
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Common Issues

### "Account not found" Error
- Ensure account is funded with ALGOs
- Check account address is correct

### "Asset not found" Error
- Verify Asset ID is correct
- Check if ASA creation was successful

### "Invalid transaction" Error
- Ensure recipient has opted-in to ASA
- Check account has sufficient ALGO for fees

### "Network timeout" Error
- Switch to different Algorand node
- Check internet connection

## Frequently Asked Questions

### Q: What can I do with TOKI?
A: Absolutely nothing! It's a memecoin with no utility. Share it with friends for fun.

### Q: Will TOKI increase in value?
A: Probably not. It's designed to be worthless and fun.

### Q: Can I trade TOKI?
A: Technically yes, but there's no official exchange listing planned.

### Q: How do I get more TOKI?
A: Ask someone who has it, or create your own ASA!

### Q: Is this a scam?
A: No, it's clearly stated as pointless. There's no deception about utility or value.

## Contributing

This is a simple memecoin project, but contributions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to create your own pointless memecoin!

## Disclaimer

⚠️ **Important**: TokiCoin is a memecoin created for entertainment purposes only. It has no inherent value, utility, or investment potential. Do not invest money you cannot afford to lose. This token is experimental and provided "as-is" without any warranties.

The creator is not responsible for any financial losses or technical issues. Use at your own risk.

## Support

For technical issues or questions:
- Open an issue on GitHub
- Check Algorand documentation
- Visit Algorand Developer Discord

---

*Built with ❤️ on Algorand • Completely Pointless by Design*