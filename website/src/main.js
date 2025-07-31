import './style.css'

const ASSET_ID = '3145241720'; // TokiCoin Mainnet Asset ID

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showCopyNotification('Copied!');
  }).catch(() => {
    showCopyNotification('Copy failed');
  });
}

function showCopyNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'copy-notification show';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

function setupCopyButtons() {
  const copyableElements = document.querySelectorAll('.spec-value.copyable');
  copyableElements.forEach(element => {
    element.addEventListener('click', () => {
      copyToClipboard(element.textContent);
    });
  });
}

function generateWalletAddUrl() {
  return `algorand://asset/${ASSET_ID}`;
}

function setupButtons() {
  const addToWalletBtn = document.querySelector('#add-to-wallet');
  if (addToWalletBtn) {
    addToWalletBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (ASSET_ID === 'TBD') {
        alert('Asset ID not yet available. Token is still being deployed.');
        return;
      }
      window.open(generateWalletAddUrl(), '_blank');
    });
  }

  const explorerBtn = document.querySelector('#view-explorer');
  if (explorerBtn) {
    explorerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (ASSET_ID === 'TBD') {
        alert('Asset ID not yet available. Token is still being deployed.');
        return;
      }
      window.open(`https://explorer.perawallet.app/asset/${ASSET_ID}`, '_blank');
    });
  }
}

document.querySelector('#app').innerHTML = `
  <div class="header-wrapper">
    <img src="/TokiCoin Adventures.png" alt="TokiCoin Adventures" class="header-bg">
    <header>
    </header>
  </div>

  <div class="container">
 <div class="subtitle">
          <span class="badge blue">Algorand</span>
          <span class="badge green">ASA Token</span>
          <span class="badge orange">Memecoin</span>
        </div>
    <div class="stats">
      <div class="stat-card">
        <div class="stat-value">20M</div>
        <div class="stat-label">Total Supply</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">$0.000001</div>
        <div class="stat-label">Initial Price</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">$20</div>
        <div class="stat-label">Market Cap</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">TOKI</div>
        <div class="stat-label">Symbol</div>
      </div>
    </div>

    <div class="section">
      <h2>What is TokiCoin?</h2>
      <p>TokiCoin (TOKI) is a memecoin built on the Algorand blockchain as an Algorand Standard Asset (ASA). 
      It serves absolutely no purpose other than being a fun token to share with friends.</p>
      <p>Inspired by the spirit of Dogecoin, TokiCoin embraces the fact that it's completely pointless. 
      No grand mission, no world-changing utility - just a simple, secure token on one of the fastest blockchains.</p>
    </div>

    <div class="section">
      <h2>Technical Specifications</h2>
      <div class="technical-specs">
        <div class="spec-item">
          <span class="spec-label">Blockchain:</span>
          <span class="spec-value">Algorand</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Token Type:</span>
          <span class="spec-value">ASA (Algorand Standard Asset)</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Total Supply:</span>
          <span class="spec-value">20,000,000 TOKI</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Decimals:</span>
          <span class="spec-value">6</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Initial Price:</span>
          <span class="spec-value">$0.000001</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Market Cap:</span>
          <span class="spec-value">$20</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Asset ID:</span>
          <span class="spec-value copyable">${ASSET_ID}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Network:</span>
          <span class="spec-value">Mainnet</span>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Why Algorand?</h2>
      <p>Algorand offers fast, secure, and low-cost transactions, making it perfect for a memecoin like TokiCoin. 
      With near-instant finality and minimal fees, sending TOKI to friends is seamless and affordable.</p>
      <p>The Algorand Standard Asset (ASA) framework ensures TokiCoin is built with the same security and 
      reliability as any other token on the network.</p>
    </div>

    <div class="warning">
      <h3>⚠️ Important Disclaimer</h3>
      <p>TokiCoin is a memecoin with no inherent value or utility. It's created purely for entertainment and 
      educational purposes. Do not invest money you cannot afford to lose. This token has no roadmap, 
      no team behind it, and no plans for development. It's just for fun!</p>
    </div>

    <div class="buttons">
      <button id="add-to-wallet" class="button">Add to Wallet</button>
      <button id="view-explorer" class="button secondary">View on Explorer</button>
    </div>

    <div class="section">
      <h2>How to Get TOKI</h2>
      <p><strong>Step 1:</strong> Set up an Algorand wallet (Pera Wallet, MyAlgo, etc.)</p>
      <p><strong>Step 2:</strong> Add TokiCoin ASA to your wallet using the Asset ID</p>
      <p><strong>Step 3:</strong> Ask a friend who has TOKI to send you some, or contact the creator</p>
      <p><strong>Step 4:</strong> Share the pointless joy with others!</p>
    </div>
  </div>

  <div class="footer-wrapper">
    <img src="/TokiCoin – Fun with Crypto.png" alt="TokiCoin Fun with Crypto" class="footer-bg">
    <footer>
    </footer>
  </div>
  
  <div class="container">
      <p>&copy; 2025 TokiCoin • Built with ❤️ on Algorand • Completely Pointless by Design</p>
  </div>
`

setupCopyButtons();
setupButtons();
