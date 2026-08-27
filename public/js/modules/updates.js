// ========================================
// Updates Module - 公告系統
// ========================================
// Loads Firestore updates and renders them without injecting untrusted HTML.

import { db } from '../config/firebase.js';
import { collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

let lastFocusedElement = null;

function copy(lang, key) {
  const strings = {
    en: {
      loading: 'Loading updates...',
      empty: 'Coming soon...',
      untitled: 'Untitled',
      datePending: 'Date pending',
      contentPending: 'Content coming soon',
      readMore: 'Read more',
      close: 'Close update',
    },
    zh: {
      loading: '載入更新中…',
      empty: '更多動態即將公開…',
      untitled: '未命名更新',
      datePending: '日期待定',
      contentPending: '內容即將公開',
      readMore: '閱讀全文',
      close: '關閉更新',
    },
  };
  return (strings[lang] || strings.en)[key];
}

function initModal(lang) {
  if (document.getElementById('update-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'update-modal';
  modal.className = 'modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('aria-labelledby', 'modal-title');

  const content = document.createElement('div');
  content.className = 'modal-content';
  content.setAttribute('tabindex', '-1');

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'modal-close';
  closeBtn.setAttribute('aria-label', copy(lang, 'close'));
  closeBtn.textContent = '×';

  const title = document.createElement('h2');
  title.id = 'modal-title';

  const date = document.createElement('div');
  date.id = 'modal-date';

  const body = document.createElement('div');
  body.id = 'modal-body';

  content.append(closeBtn, title, date, body);
  modal.appendChild(content);
  document.body.appendChild(modal);

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

function openModal(item, lang) {
  const modal = document.getElementById('update-modal');
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  document.getElementById('modal-title').textContent = item.title || copy(lang, 'untitled');
  document.getElementById('modal-date').textContent = item.dateStr || '';
  document.getElementById('modal-body').textContent = item.content || item.excerpt || copy(lang, 'contentPending');

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-content')?.focus();
}

function closeModal() {
  const modal = document.getElementById('update-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function getTimestamp(item) {
  const timestamp = item.createdAt?.toMillis?.();
  if (Number.isFinite(timestamp)) return timestamp;

  const parsed = Date.parse(item.dateStr || '');
  return Number.isFinite(parsed) ? parsed : 0;
}

async function loadUpdates(lang = 'en') {
  const container = document.getElementById('dynamic-updates-list');
  if (!container) return;

  const safeLang = lang === 'zh' ? 'zh' : 'en';
  initModal(safeLang);
  container.replaceChildren(createStatus(copy(safeLang, 'loading')));

  try {
    const q = query(collection(db, 'updates'), where('lang', '==', safeLang));
    const querySnapshot = await getDocs(q);

    const items = [];
    querySnapshot.forEach((snapshot) => {
      const data = snapshot.data();
      if (data.lang === safeLang) items.push({ id: snapshot.id, ...data });
    });

    items.sort((a, b) => getTimestamp(b) - getTimestamp(a));
    const latest = items.slice(0, 10);

    if (latest.length === 0) {
      container.replaceChildren(createStatus(copy(safeLang, 'empty')));
      return;
    }

    renderUpdates(latest, safeLang);
  } catch (error) {
    console.error('Error loading updates:', error);
    container.replaceChildren(createStatus(copy(safeLang, 'empty')));
  }
}

function createStatus(text) {
  const status = document.createElement('div');
  status.className = 'loading-text';
  status.textContent = text;
  return status;
}

function renderUpdates(items, lang) {
  const container = document.getElementById('dynamic-updates-list');
  if (!container) return;
  container.replaceChildren();

  items.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'update-item fade-in-section visible';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');

    const date = document.createElement('time');
    date.className = 'update-date';
    date.textContent = item.dateStr || copy(lang, 'datePending');

    const content = document.createElement('div');
    content.className = 'update-content';

    const title = document.createElement('h3');
    title.textContent = item.title || copy(lang, 'untitled');

    const paragraph = document.createElement('p');
    const raw = String(item.content || item.excerpt || copy(lang, 'contentPending'));
    const excerpt = raw.length > 80 ? `${raw.slice(0, 80)}…` : raw;
    paragraph.append(document.createTextNode(`${excerpt} `));

    const more = document.createElement('span');
    more.className = 'update-read-more';
    more.textContent = `(${copy(lang, 'readMore')})`;
    paragraph.appendChild(more);

    content.append(title, paragraph);
    article.append(date, content);

    const open = () => openModal(item, lang);
    article.addEventListener('click', open);
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });

    container.appendChild(article);
  });
}

export { loadUpdates };
