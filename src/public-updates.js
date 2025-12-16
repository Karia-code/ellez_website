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
  // Use class selector to avoid changing DOM structure
  const container = document.querySelector('.update-list');
  if (!container) return;
  container.innerHTML = '';

  if (!posts.length) {
    const lang = (document.documentElement.lang || '').toLowerCase();
    const isZh = lang.includes('zh');
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

    // Keep layout identical: date, title, paragraph (no visible link)
    item.innerHTML = `
      <span class="update-date">${dateStr || ''}</span>
      <h3>${post.title || 'Untitled'}</h3>
      ${excerpt ? `<p>${excerpt}</p>` : ''}
    `;
    container.appendChild(item);
  });
}

async function loadUpdates() {
  try {
    const q = query(
      collection(db, 'updates'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const snap = await getDocs(q);
    const posts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    renderUpdates(posts);
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

// Kick off once DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadUpdates);
} else {
  loadUpdates();
}
