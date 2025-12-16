// src/post-page.js
// Load a single post by slug from Firestore and render it
import { db } from './firebase.js';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';

function getSlugFromLocation() {
  // Support both /updates/:slug and ?slug= fallback
  const path = location.pathname;
  const updatesPrefix = '/updates/';
  if (path.startsWith(updatesPrefix)) {
    return decodeURIComponent(path.substring(updatesPrefix.length));
  }
  const url = new URL(location.href);
  const p = url.searchParams.get('slug');
  return p ? decodeURIComponent(p) : '';
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '';
}

function setMeta({ lang, dateStr, category }) {
  const meta = document.getElementById('post-meta');
  if (!meta) return;
  const parts = [];
  if (lang) parts.push(`[${lang.toUpperCase()}]`);
  if (dateStr) parts.push(dateStr);
  if (category) parts.push(category);
  meta.textContent = parts.join(' • ');
}

async function loadPost() {
  const slug = getSlugFromLocation();
  if (!slug) {
    setText('post-title', 'Post not found');
    setText('post-content', 'Invalid URL.');
    return;
  }

  try {
    const q = query(
      collection(db, 'updates'),
      where('slug', '==', slug),
      limit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) {
      setText('post-title', 'Post not found');
      setText('post-content', 'This update may have been removed or the link is incorrect.');
      return;
    }

    const data = snap.docs[0].data();
    setText('post-title', data.title || 'Untitled');
    setText('post-content', data.content || '');
    setMeta({ lang: data.lang, dateStr: data.dateStr, category: data.category });
    document.title = `ELLEZ – ${data.title || 'Update'}`;
  } catch (err) {
    console.error('Failed to load post:', err);
    setText('post-title', 'Error loading post');
    setText('post-content', 'Please try again later.');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadPost);
} else {
  loadPost();
}
