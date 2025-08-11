import './style.css'

const ASSET_ID = '3145241720'; // TokiCoin Mainnet Asset ID

// Input sanitization function
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Secure text content setting
function setTextContent(element, text) {
  element.textContent = text;
}

function copyToClipboard(text) {
  // Validate input before copying
  if (typeof text !== 'string' || text.length === 0) {
    showCopyNotification('Invalid input');
    return;
  }
  
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

// Secure DOM creation function
function createSecureDOM() {
  const app = document.querySelector('#app');
  
  // Clear existing content safely
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
  
  // Create header wrapper
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'header-wrapper';
  
  const headerImg = document.createElement('img');
  headerImg.src = '/TokiCoin Adventures.webp';
  headerImg.alt = 'TokiCoin Adventures banner featuring the official Algorand memecoin logo and branding';
  headerImg.className = 'header-bg';
  headerImg.loading = 'eager';
  headerImg.decoding = 'async';
  headerImg.fetchPriority = 'high';
  
  const header = document.createElement('header');
  const h1 = document.createElement('h1');
  h1.textContent = 'TokiCoin (TOKI)';
  h1.style.position = 'absolute';
  h1.style.left = '-9999px'; // Screen reader accessible but visually hidden
  header.appendChild(h1);
  
  headerWrapper.appendChild(headerImg);
  headerWrapper.appendChild(header);
  app.appendChild(headerWrapper);
  
  // Create main container
  const main = document.createElement('main');
  const container = document.createElement('div');
  container.className = 'container';
  
  // Create subtitle with badges
  const subtitle = document.createElement('div');
  subtitle.className = 'subtitle';
  
  const badges = [
    { text: 'Algorand', class: 'badge blue' },
    { text: 'ASA Token', class: 'badge green' },
    { text: 'Memecoin', class: 'badge orange' }
  ];
  
  badges.forEach(badge => {
    const span = document.createElement('span');
    span.className = badge.class;
    span.textContent = badge.text;
    subtitle.appendChild(span);
  });
  
  container.appendChild(subtitle);
  
  // Create stats section
  const stats = document.createElement('div');
  stats.className = 'stats';
  
  const statsData = [
    { value: '20M', label: 'Total Supply' },
    { value: '$0.000001', label: 'Initial Price' },
    { value: '$20', label: 'Market Cap' },
    { value: 'TOKI', label: 'Symbol' }
  ];
  
  statsData.forEach(stat => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    const value = document.createElement('div');
    value.className = 'stat-value';
    value.textContent = stat.value;
    
    const label = document.createElement('div');
    label.className = 'stat-label';
    label.textContent = stat.label;
    
    card.appendChild(value);
    card.appendChild(label);
    stats.appendChild(card);
  });
  
  container.appendChild(stats);
  
  // Create sections safely
  createSection(container, 'What is TokiCoin?', [
    'TokiCoin (TOKI) is a memecoin built on the Algorand blockchain as an Algorand Standard Asset (ASA). It serves absolutely no purpose other than being a fun token to share with friends.',
    'Inspired by the spirit of Dogecoin, TokiCoin embraces the fact that it\'s completely pointless. No grand mission, no world-changing utility - just a simple, secure token on one of the fastest blockchains.'
  ]);
  
  // Technical specifications section
  createTechnicalSpecs(container);
  
  createSection(container, 'Why Algorand?', [
    'Algorand offers fast, secure, and low-cost transactions, making it perfect for a memecoin like TokiCoin. With near-instant finality and minimal fees, sending TOKI to friends is seamless and affordable.',
    'The Algorand Standard Asset (ASA) framework ensures TokiCoin is built with the same security and reliability as any other token on the network.'
  ]);
  
  // Warning section
  createWarningSection(container);
  
  // Buttons section
  createButtonsSection(container);
  
  createSection(container, 'How to Get TOKI', [
    'Step 1: Set up an Algorand wallet (Pera Wallet, MyAlgo, etc.)',
    'Step 2: Add TokiCoin ASA to your wallet using the Asset ID',
    'Step 3: Ask a friend who has TOKI to send you some, or contact the creator',
    'Step 4: Share the pointless joy with others!'
  ]);
  
  main.appendChild(container);
  app.appendChild(main);
  
  // Create footer
  createFooter(app);
}

function createSection(parent, title, paragraphs) {
  const section = document.createElement('section');
  section.className = 'section';
  
  const h2 = document.createElement('h2');
  h2.textContent = title;
  section.appendChild(h2);
  
  paragraphs.forEach(text => {
    const p = document.createElement('p');
    if (text.includes('Step')) {
      const parts = text.split(': ');
      const strong = document.createElement('strong');
      strong.textContent = parts[0] + ': ';
      p.appendChild(strong);
      p.appendChild(document.createTextNode(parts[1]));
    } else {
      p.textContent = text;
    }
    section.appendChild(p);
  });
  
  parent.appendChild(section);
}

function createTechnicalSpecs(parent) {
  const section = document.createElement('section');
  section.className = 'section';
  
  const h2 = document.createElement('h2');
  h2.textContent = 'Technical Specifications';
  section.appendChild(h2);
  
  const specs = document.createElement('div');
  specs.className = 'technical-specs';
  
  const specData = [
    { label: 'Blockchain:', value: 'Algorand' },
    { label: 'Token Type:', value: 'ASA (Algorand Standard Asset)' },
    { label: 'Total Supply:', value: '20,000,000 TOKI' },
    { label: 'Decimals:', value: '6' },
    { label: 'Initial Price:', value: '$0.000001' },
    { label: 'Market Cap:', value: '$20' },
    { label: 'Asset ID:', value: ASSET_ID, copyable: true },
    { label: 'Network:', value: 'Mainnet' }
  ];
  
  specData.forEach(spec => {
    const item = document.createElement('div');
    item.className = 'spec-item';
    
    const label = document.createElement('span');
    label.className = 'spec-label';
    label.textContent = spec.label;
    
    const value = document.createElement('span');
    value.className = spec.copyable ? 'spec-value copyable' : 'spec-value';
    value.textContent = spec.value;
    
    item.appendChild(label);
    item.appendChild(value);
    specs.appendChild(item);
  });
  
  section.appendChild(specs);
  parent.appendChild(section);
}

function createWarningSection(parent) {
  const warning = document.createElement('div');
  warning.className = 'warning';
  
  const h3 = document.createElement('h3');
  h3.textContent = '⚠️ Important Disclaimer';
  
  const p = document.createElement('p');
  p.textContent = 'TokiCoin is a memecoin with no inherent value or utility. It\'s created purely for entertainment and educational purposes. Do not invest money you cannot afford to lose. This token has no roadmap, no team behind it, and no plans for development. It\'s just for fun!';
  
  warning.appendChild(h3);
  warning.appendChild(p);
  parent.appendChild(warning);
}

function createButtonsSection(parent) {
  const buttons = document.createElement('div');
  buttons.className = 'buttons';
  
  const addButton = document.createElement('button');
  addButton.id = 'add-to-wallet';
  addButton.className = 'button';
  addButton.textContent = 'Add to Wallet';
  
  const explorerButton = document.createElement('button');
  explorerButton.id = 'view-explorer';
  explorerButton.className = 'button secondary';
  explorerButton.textContent = 'View on Explorer';
  
  buttons.appendChild(addButton);
  buttons.appendChild(explorerButton);
  parent.appendChild(buttons);
}

function createFooter(parent) {
  const footerWrapper = document.createElement('div');
  footerWrapper.className = 'footer-wrapper';
  
  const footerImg = document.createElement('img');
  footerImg.src = '/TokiCoin – Fun with Crypto.webp';
  footerImg.alt = 'TokiCoin Fun with Crypto footer banner showcasing the playful nature of the Algorand memecoin';
  footerImg.className = 'footer-bg';
  footerImg.loading = 'lazy';
  footerImg.decoding = 'async';
  
  const footer = document.createElement('footer');
  
  footerWrapper.appendChild(footerImg);
  footerWrapper.appendChild(footer);
  parent.appendChild(footerWrapper);
  
  const container = document.createElement('div');
  container.className = 'container';
  
  const p = document.createElement('p');
  p.textContent = '© 2025 TokiCoin • Built with ❤️ on Algorand • Completely Pointless by Design';
  
  container.appendChild(p);
  parent.appendChild(container);
}

// Initialize secure DOM
createSecureDOM();

function setupImageLoading() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  const eagerImages = document.querySelectorAll('img[loading="eager"]');
  
  // Handle eager images immediately
  eagerImages.forEach(img => {
    const handleEagerImage = () => {
      if (img.complete && img.naturalWidth > 0) {
        img.classList.add('loaded');
      } else {
        img.onload = () => img.classList.add('loaded');
        img.onerror = () => {
          // Fallback to PNG if WebP fails
          if (img.src.includes('.webp')) {
            img.src = img.src.replace('.webp', '.png');
          }
          img.classList.add('loaded');
        };
      }
    };
    handleEagerImage();
  });
  
  // Handle lazy images with intersection observer
  lazyImages.forEach(img => {
    const createImage = () => {
      const testImg = new Image();
      testImg.onload = () => {
        img.classList.add('loaded');
      };
      testImg.onerror = () => {
        // Fallback to PNG if WebP fails
        if (img.src.includes('.webp')) {
          img.src = img.src.replace('.webp', '.png');
        }
        img.classList.add('loaded');
      };
      testImg.src = img.src;
    };

    // Use Intersection Observer for better lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            createImage();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(img);
    } else {
      // Fallback for older browsers
      createImage();
    }
  });
}

setupCopyButtons();
setupButtons();
setupImageLoading();
