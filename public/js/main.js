// ========================================
// Main Entry Point - ELLEZ LLC Website
// ========================================
// 這個檔案負責組裝整個網站，匯入並初始化所有模組

import { initNavigation } from './modules/navigation.js';
import { initAnimations, optimizePerformance } from './modules/animations.js';
import { loadUpdates } from './modules/updates.js';

// 偵測當前頁面語言
function detectLanguage() {
  // 方法 1: 從 URL 路徑偵測
  if (window.location.pathname.includes('zh')) {
    return 'zh';
  }
  
  // 方法 2: 從 HTML lang 屬性偵測
  const htmlLang = document.documentElement.lang;
  if (htmlLang && htmlLang.startsWith('zh')) {
    return 'zh';
  }
  
  // 預設為英文
  return 'en';
}

// 主初始化函數
function init() {
  const lang = detectLanguage();
  
  console.log(`🚀 ELLEZ LLC website initializing... (Language: ${lang})`);
  
  // 1. 初始化導航功能
  initNavigation();
  
  // 2. 初始化動畫效果
  initAnimations();
  
  // 3. 效能優化
  optimizePerformance();
  
  // 4. 載入公告內容（如果頁面上有公告區塊）
  const updatesContainer = document.getElementById('dynamic-updates-list');
  if (updatesContainer) {
    loadUpdates(lang);
  }
  
  console.log('✅ ELLEZ LLC website loaded successfully!');
}

// 等待 DOM 載入完成後執行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM 已經載入完成
  init();
}
