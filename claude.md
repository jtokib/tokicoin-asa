# TokiCoin ASA Project - Production Ready

## Project Status: ✅ COMPLETE & SECURE
**Code reviewed, security hardened, and ready for GitHub deployment.**

## Overview
TokiCoin (TOKI) is a professionally developed memecoin built on the Algorand blockchain as an Algorand Standard Asset (ASA). This project includes secure ASA creation scripts, intelligent distribution tools, and a modern Vite-powered website with Netlify deployment.

## Project Structure
```
tokicoin-asa/
├── .gitignore                   # Comprehensive security exclusions
├── .env.example                 # Environment variable template
├── package.json                 # Root dependencies (Algorand SDK)
├── README.md                   # Complete documentation
├── claude.md                   # Project summary (this file)
├── scripts/
│   ├── tokicoin.js            # Secure ASA creation & management
│   ├── distrbute.js           # Intelligent batch distribution
│   └── test.js               # Testing utilities
└── website/                   # Modern Vite website
    ├── .gitignore            # Website-specific exclusions
    ├── .env.example          # Website environment template
    ├── package.json          # Vite & website dependencies
    ├── netlify.toml          # Netlify deployment config
    ├── index.html            # SEO-optimized HTML
    ├── public/
    │   └── tokicoin-favicon.svg  # Custom TokiCoin favicon
    └── src/
        ├── main.js           # Interactive JS with copy features
        └── style.css         # Responsive CSS with animations
```

## Token Economics
- **Name**: TokiCoin
- **Symbol**: TOKI
- **Total Supply**: 20,000,000 TOKI
- **Decimals**: 6
- **Initial Market Cap**: $20
- **Initial Price**: $0.000001 per TOKI
- **Blockchain**: Algorand (ASA)

## Development Stack
- **Backend**: Node.js v22+ with AlgoKit Utils & Algorand SDK v3+
- **Frontend**: Vite + Vanilla JS
- **Deployment**: Netlify
- **Blockchain**: Algorand (using modern AlgoKit patterns)

## Key Features
- Secure ASA creation and management
- Batch token distribution system
- Modern responsive website
- Testnet and mainnet support
- Comprehensive error handling
- Professional documentation

## 🔒 Security Features Implemented
### Code-Level Security
- ✅ **Mnemonic masking** in console outputs (`tokicoin.js:45`)
- ✅ **Input validation** for addresses and amounts (`tokicoin.js:153`)
- ✅ **Balance verification** before transfers (`tokicoin.js:167`)
- ✅ **Environment variable protection** (`distrbute.js:120`)
- ✅ **Parameter validation** in distribution (`distrbute.js:15`)

### File System Security
- ✅ **Comprehensive `.gitignore`** blocks sensitive files
- ✅ **Environment separation** (`.env.local` never committed)
- ✅ **Sensitive pattern blocking** (`*.mnemonic`, `*private*`, `*secret*`)
- ✅ **Mainnet file protection** (`mainnet-*.js` blocked)

### Network Security
- ✅ **Testnet-first development** workflow
- ✅ **Network validation** and error handling
- ✅ **Transaction retry logic** with exponential backoff
- ✅ **Batch processing** to avoid network overload

## Environment Variables
```
VITE_ASSET_ID=           # ASA Asset ID
VITE_NETWORK=mainnet     # Network (testnet/mainnet)
VITE_EXPLORER_URL=       # Algorand explorer URL
```

## Scripts
- `npm install` - Install dependencies (AlgoKit Utils & Algorand SDK v3+)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `node scripts/tokicoin.js` - Create ASA on blockchain (AlgoKit pattern)
- `npm run distribute` - Distribute tokens
- `npm run test` - Run tests

## Prerequisites (Always Required)
- **Node.js**: v22.0.0 or higher
- **npm**: v10.0.0 or higher
- **AlgoKit Utils**: v9.1.2+ (automatically installs with `npm install`)
- **Algorand SDK**: v3.3.1+ (automatically installs with `npm install`)

## Deployment
The website is configured for automatic deployment on Netlify with:
- Optimized build process
- Environment variable support
- Custom domain configuration
- Form handling capabilities
- Edge functions support

## Usage Notes
1. Always test on Algorand testnet first
2. Ensure accounts are funded before transactions
3. Recipients must opt-in to ASA before receiving tokens
4. Keep private keys and mnemonics secure
5. Monitor transaction fees and network status

## Links
- **NEW Developer Portal**: [dev.algorand.co](https://dev.algorand.co/)
- **AlgoKit Documentation**: [AlgoKit Utils TypeScript](https://github.com/algorandfoundation/algokit-utils-ts)
- **Tutorials**: [tutorials.dev.algorand.co](https://tutorials.dev.algorand.co/1-basics/1-introduction/1-welcome/)
- **Testnet Dispenser**: [bank.testnet.algorand.network](https://bank.testnet.algorand.network/)
- [Algorand SDK Documentation](https://algorand.github.io/js-algorand-sdk/)
- [Vite Documentation](https://vitejs.dev/)
- [Netlify Documentation](https://docs.netlify.com/)

## Support
For technical issues:
- **Testnet Funding**: Use [bank.testnet.algorand.network](https://bank.testnet.algorand.network/)
- **Always run `npm install`** to ensure latest AlgoKit Utils & SDK v3+
- **Check Node.js version**: Must be v22+ (`node --version`)
- **Verify NPM version**: Must be v10+ (`npm --version`)
- Verify Asset ID and network configuration
- Ensure proper opt-in procedures
- Review transaction fees and limits

## 🔄 Development Workflow (AlgoKit Pattern)
1. **Install modern dependencies**: `npm install`
2. **Generate account**: `node scripts/tokicoin.js`
3. **Fund account**: Visit [bank.testnet.algorand.network](https://bank.testnet.algorand.network/)
4. **Create ASA**: Uncomment creation code and run `node scripts/tokicoin.js`
5. **Deploy website**: Use Asset ID in Vite environment variables