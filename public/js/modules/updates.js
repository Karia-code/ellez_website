// ========================================
// Updates Module - 公告系統
// ========================================
// 負責載入和顯示公告內容，支援多語言篩選和 Modal 彈窗

// ✅ 從配置檔匯入已初始化的 db (不需要重複初始化 Firebase)
import { db } from '../config/firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Initialize Modal (插入 Modal HTML 到頁面)
function initModal() {
  // ✅ 防止重複初始化
  if (document.getElementById('update-modal')) return;

  const modalHTML = `
    <div id="update-modal" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close">&times;</button>
        <h2 id="modal-title"></h2>
        <div id="modal-date"></div>
        <div id="modal-body"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // 綁定關閉事件
  const modal = document.getElementById('update-modal');
  const closeBtn = modal.querySelector('.modal-close');
  
  // 點擊 X 或背景關閉
  closeBtn.onclick = () => closeModal();
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

function openModal(item) {
  const modal = document.getElementById('update-modal');
  if (!modal) {
    console.error('Modal not found');
    return;
  }
  
  document.getElementById('modal-title').innerText = item.title || 'Untitled';
  document.getElementById('modal-date').innerText = item.dateStr || '';
  document.getElementById('modal-body').innerText = item.content || item.excerpt || '';
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // 防止背景捲動
}

function closeModal() {
  const modal = document.getElementById('update-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Load updates logic (接收語言參數)
async function loadUpdates(lang) {
  const container = document.getElementById('dynamic-updates-list');
  if (!container) return;

  // 初始化 Modal
  initModal();

  container.innerHTML = '<div class="loading-text">Loading updates...</div>';

  try {
    // ✅ 只用 where 篩選，避免需要複合索引
    const q = query(
      collection(db, "updates"),
      where("lang", "==", lang) // 只篩選語言
    );
    
    const querySnapshot = await getDocs(q);
    
    let items = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // ✅ 雙重檢查：只顯示語言正確的公告
      if (data.lang === lang) {
        items.push({ id: doc.id, ...data });
      }
    });

    // ✅ 在客戶端排序（按 createdAt 或 dateStr）
    items.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() || new Date(a.dateStr || 0).getTime();
      const dateB = b.createdAt?.toMillis?.() || new Date(b.dateStr || 0).getTime();
      return dateB - dateA; // 新的在前
    });

    // 限制最多顯示 10 筆
    items = items.slice(0, 10);

    if (items.length === 0) {
      container.innerHTML = '<div class="loading-text">Coming soon...</div>';
    } else {
      renderUpdates(items);
    }
  } catch (error) {
    console.error("Error loading updates:", error);
    container.innerHTML = '<div class="loading-text">Coming soon...</div>';
  }
}

function renderUpdates(items) {
  const container = document.getElementById('dynamic-updates-list');
  container.innerHTML = '';

  items.forEach(item => {
    const article = document.createElement('article');
    article.className = 'update-item fade-in-section visible';
    
    // ✅ 點擊觸發 Modal（加上調試）
    article.onclick = () => {
      console.log('Article clicked:', item.title);
      openModal(item);
    };
    
    // 加上游標樣式提示可點擊
    article.style.cursor = 'pointer';

    // 列表只顯示摘要 (擷取前 80 字)
    const excerpt = item.content ? 
      (item.content.length > 80 ? item.content.substring(0, 80) + '...' : item.content) 
      : (item.excerpt || 'Content coming soon');

    article.innerHTML = `
      <time class="update-date">${item.dateStr || 'Date Pending'}</time>
      <div class="update-content">
        <h3>${item.title || 'Untitled'}</h3>
        <p>${excerpt} <span style="color:#007bff; font-size:0.9em;">(Read more)</span></p>
      </div>
    `;
    
    container.appendChild(article);
  });
}

// ✅ 匯出函數供主程式呼叫
export { loadUpdates };
