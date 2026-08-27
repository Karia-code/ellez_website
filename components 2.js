// components.js

function renderNavbar(lang = 'en') {
  const container = document.getElementById('navbar-container');
  if (!container) return;

  // 定義連結路徑 (使用 / 開頭，確保在任何子資料夾都能連回根目錄)
  const homeLink = lang === 'zh' ? '/index.zh.html' : '/index.html';
  
  // 定義選單文字
  const texts = lang === 'zh' ? {
    principles: '原則',
    products: '產品',
    updates: '動態',
    contact: '聯絡我們',
    switchLabel: 'EN',
    switchLink: '/index.html'
  } : {
    principles: 'Principles',
    products: 'Products',
    updates: 'Updates',
    contact: 'Contact',
    switchLabel: '中文',
    switchLink: '/index.zh.html'
  };

  // 插入 HTML
  container.innerHTML = `
    <nav class="navbar">
      <div class="nav-container">
        <a href="${homeLink}" class="nav-logo">
          <img src="/LOGO-.png" alt="ELLEZ LLC" class="nav-logo-img">
          <span class="nav-logo-text">ELLEZ</span>
        </a>
        <input type="checkbox" id="nav-toggle" class="nav-toggle">
        <label for="nav-toggle" class="nav-toggle-label">
          <span></span><span></span><span></span>
        </label>
        <ul class="nav-links">
          <li><a href="${homeLink}#principles">${texts.principles}</a></li>
          <li><a href="${homeLink}#products">${texts.products}</a></li>
          <li><a href="${homeLink}#updates">${texts.updates}</a></li>
          <li><a href="${homeLink}#contact">${texts.contact}</a></li>
        </ul>
        <div class="lang-switcher">
          <a href="${texts.switchLink}" class="lang-btn">${texts.switchLabel}</a>
        </div>
      </div>
    </nav>
  `;
}

// 同理，您也可以把 Footer 做成共用元件
function renderFooter() {
  const container = document.getElementById('footer-container');
  if (!container) return;
  
  container.innerHTML = `
    <footer id="contact" class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h4>ELLEZ LLC</h4>
            <p class="footer-tagline">Creating future digital experiences centered on ethics, creativity, and humanity.</p>
            <p>&copy; 2025 ELLEZ LLC.</p>
          </div>
          <div class="footer-links">
            <h4>Contact Us</h4>
            <ul>
              <li><a href="mailto:ellez.tech.2023@gmail.com">ellez.tech.2023@gmail.com</a></li>
              <li><a href="https://www.linkedin.com/company/ellez-llc" target="_blank">LinkedIn</a></li>
            </ul>
          </div>
          <div class="footer-links">
            <h4>Company Address</h4>
            <p>1330 Avenue of the Americas,<br>Suite 23A,<br>New York, NY 10019</p>
          </div>
        </div>
      </div>
    </footer>
  `;
}