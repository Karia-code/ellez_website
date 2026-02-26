// src/public-updates.js
// Fetch and render latest updates on the public homepage
import { db } from './firebase.js';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

function formatDate(dt) {
  try {
    if (!dt) return '';
    const d = typeof dt.toDate === 'function' ? dt.toDate() : new Date(dt);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  } catch {
    return '';
  }
}

function renderUpdates(posts) {
  const container = document.querySelector('.update-list');
  if (!container) return;
  container.innerHTML = '';

  // 1. 取得目前網頁語言
  const lang = (document.documentElement.lang || '').toLowerCase();
  const isZh = lang.includes('zh');

  if (!posts.length) {
    const title = isZh ? '暫無更新' : 'No updates yet';
    const desc = isZh
      ? '我們會在這裡分享產品消息與想法，敬請期待。'
      : 'We’ll share product news and thoughts here. Check back soon.';
    container.innerHTML = `
      <div class="update-item">
        <span class="update-date">—</span>
        <h3>${title}</h3>
        <p>${desc}</p>
      </div>`;
    return;
  }

  posts.forEach((post) => {
    const item = document.createElement('div');
    item.className = 'update-item';
    const dateStr = post.dateStr || formatDate(post.createdAt);

    const excerpt = (post.excerpt && String(post.excerpt).trim()) ||
      (post.content ? String(post.content).replace(/\s+/g, ' ').trim().slice(0, 200) : '');
    
    // 2. 產生連結：如果有 slug 就用 /updates/slug，否則不給連結
    // 注意：這裡假設你的文章資料欄位裡有 'slug'
    const linkHref = post.slug ? `/updates/${post.slug}` : '#';

    // 3. 加入 <a> 標籤使整塊可點擊，並保留原本樣式
    // 使用 style="text-decoration: none; color: inherit; display: block;" 確保樣式不跑掉
    item.innerHTML = `
      <a href="${linkHref}" style="text-decoration: none; color: inherit; display: block; cursor: pointer;">
        <span class="update-date">${dateStr || ''}</span>
        <h3>${post.title || 'Untitled'}</h3>
        ${excerpt ? `<p>${excerpt}</p>` : ''}
      </a>
    `;
    container.appendChild(item);
  });
}

async function loadUpdates() {
  try {
    // 4. 判斷目前語言
    const lang = (document.documentElement.lang || '').toLowerCase();
    const isZh = lang.includes('zh');
    const targetLang = isZh ? 'zh' : 'en';

    // 抓取最近的 20 篇 (抓多一點以免過濾後沒剩半篇)
    const q = query(
      collection(db, 'updates'),
      orderBy('createdAt', 'desc'),
      limit(20) 
    );
    const snap = await getDocs(q);
    
    // 5. 在這裡進行語言過濾
    const allPosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    
    // 只保留語言相符的文章 (post.lang 必須等於 'zh' 或 'en')
    // 最後只取前 3 篇顯示
    const filteredPosts = allPosts
        .filter(post => post.lang === targetLang) 
        .slice(0, 3);

    renderUpdates(filteredPosts);
  } catch (err) {
    console.error('Failed to load updates:', err);
    const container = document.querySelector('.update-list');
    if (container) {
      const lang = (document.documentElement.lang || '').toLowerCase();
      const isZh = lang.includes('zh');
      const title = isZh ? '目前無法載入更新' : 'Updates unavailable';
      const desc = isZh
        ? '我們暫時無法取得最新更新，請稍後再試。'
        : 'We couldn’t fetch updates right now. Please try again later.';
      container.innerHTML = `
        <div class="update-item">
          <span class="update-date">—</span>
          <h3>${title}</h3>
          <p>${desc}</p>
        </div>`;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadUpdates);
} else {
  loadUpdates();
}