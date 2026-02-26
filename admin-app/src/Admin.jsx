import React, { useEffect, useState } from 'react';
import { Terminal, Lock, LogOut, LayoutGrid, Save, Trash2, Globe } from 'lucide-react';

import { auth, db } from './firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy, where, getDocs as getDocsWhere, limit } from 'firebase/firestore';

const cssStyles = `
  :root {
    --bg-primary: #0F2A24;
    --bg-secondary: #12312A;
    --text-primary: #F3F1EC;
    --accent: #C9B37E;
    --border: #163832;
    font-family: sans-serif;
  }
  .admin-root { background: var(--bg-primary); color: var(--text-primary); min-height: 100vh; font-family: sans-serif; }
  .login-container { display:flex; align-items:center; justify-content:center; min-height:100vh; padding:24px; }
  .login-box { width:100%; max-width:420px; padding:32px; border:1px solid var(--border); background: rgba(15,42,36,.9); backdrop-filter: blur(10px); position:relative; }
  .input-group { margin-bottom:16px; }
  .input-label { display:block; font-size:10px; color: var(--accent); letter-spacing:.08em; margin-bottom:6px; text-transform: uppercase; }
  .styled-input, .styled-textarea, .styled-select { width:100%; background: rgba(18,49,42,0.3); border:1px solid var(--border); color: var(--text-primary); padding:12px; border-radius:2px; box-sizing: border-box; }
  .styled-textarea { min-height:140px; }
  .btn-submit { width:100%; background: var(--accent); color:#0F2A24; border:none; padding:12px; font-weight:700; cursor:pointer; margin-top: 10px; }
  .btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
  .dash-layout { display:grid; grid-template-columns: 260px 1fr; min-height:100vh; }
  .sidebar { border-right:1px solid var(--border); padding:24px; }
  .main-content { padding:32px; }
  .post-card { background: var(--bg-secondary); border:1px solid var(--border); padding:12px; display:flex; justify-content:space-between; align-items:center; margin-bottom: 12px; }
  
  /* 手機版適配 */
  @media (max-width: 768px) {
    .dash-layout { grid-template-columns: 1fr; }
    .sidebar { display: none; } /* 暫時隱藏側邊欄以簡化 */
  }
`;

function slugify(input) {
  const base = (input || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 64);
  return base || 'post';
}

async function uniqueSlugFromTitle(title) {
  const base = slugify(title);
  let candidate = base;
  let counter = 1;
  // check existence
  while (true) {
    const q = query(collection(db, 'updates'), where('slug', '==', candidate), limit(1));
    const snap = await getDocsWhere(q);
    if (snap.empty) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

export default function Admin() {
  // 1. 狀態管理
  const [user, setUser] = useState(null); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 文章資料
  const [posts, setPosts] = useState([]);

  // 新文章表單 State (加入 lang 預設值)
  const [newPost, setNewPost] = useState({ 
    title: '', category: 'Product', content: '', date: new Date().toISOString().split('T')[0], lang: 'zh'
  });

  // 2. Firebase 登入
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (err) {
      alert('Login failed: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    signOut(auth).catch(() => {}).finally(() => setUser(null));
  };

  // 3. 發布（寫入 Firestore）
  const handlePublish = async (e) => {
    e.preventDefault();
    if (!newPost.title) return alert('請輸入標題');
    if (!user) return alert('請先登入');

    try {
      setLoading(true);
      const slug = await uniqueSlugFromTitle(newPost.title);
      const payload = {
        title: newPost.title,
        category: newPost.category,
        content: newPost.content,
        lang: newPost.lang,
        dateStr: newPost.date,
        createdAt: serverTimestamp(),
        slug,
        excerpt: (newPost.content || '').replace(/\s+/g, ' ').trim().slice(0, 160)
      };

      const ref = await addDoc(collection(db, 'updates'), payload);
      // 更新本地列表頂部
      setPosts([{ id: ref.id, ...payload }, ...posts]);
      // 清空表單
      setNewPost({ title: '', category: 'Product', content: '', date: new Date().toISOString().split('T')[0], lang: 'zh' });
      alert('公告已發布');
    } catch (err) {
      alert('發布失敗：' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (!id) return;
    if (!confirm('確定要刪除這篇公告嗎？')) return;
    deleteDoc(doc(db, 'updates', id))
      .then(() => setPosts(posts.filter(p => p.id !== id)))
      .catch(err => alert('刪除失敗：' + (err?.message || 'Unknown error')));
  };

  // 4. 監聽登入狀態 & 載入文章
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(collection(db, 'updates'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPosts(list);
      } catch (err) {
        // 讀取失敗時，保留空列表，不阻塞 UI
        console.warn('Failed to fetch posts:', err);
      }
    }
    fetchPosts();
  }, []);

  // ---------------- UI 渲染 ----------------

  // A. 尚未登入：顯示登入框
  if (!user) {
    return (
      <div className="admin-root login-container">
        <style>{cssStyles}</style>
        <div className="login-box">
          <div className="text-center" style={{ marginBottom: '24px' }}>
             <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#C9B37E', border: '1px solid #163832', padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontFamily: 'monospace' }}>
               <Lock size={12} /> RESTRICTED ACCESS
             </div>
             <h1 style={{ fontSize: '24px', marginTop: '16px', fontFamily: 'serif' }}>System Login</h1>
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label className="input-label">Identity_Key</label>
              <input 
                type="text" // 改成 text 方便測試
                className="styled-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ellez.site"
              />
            </div>
            <div className="input-group">
              <label className="input-label">Passphrase</label>
              <input 
                type="password" 
                className="styled-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // B. 已登入：顯示後台
  return (
    <div className="admin-root dash-layout">
      <style>{cssStyles}</style>
      
      {/* 側邊欄 */}
      <aside className="sidebar">
        <div style={{ marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', background: '#C9B37E', color: '#0F2A24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>E</div>
          <span style={{ fontWeight: 'bold', fontFamily: 'serif' }}>CMS Panel</span>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '12px', opacity: 0.5, marginBottom: '8px' }}>Logged in as:</div>
          <div style={{ marginBottom: '16px' }}>{user.email}</div>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#C9B37E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={14} /> TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="main-content">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <header style={{ borderBottom: '1px solid #163832', paddingBottom: '24px', marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 style={{ fontSize: '32px', fontFamily: 'serif', margin: 0 }}>Publish Update</h2>
              <p style={{ fontFamily: 'monospace', fontSize: '12px', opacity: 0.5, margin: '8px 0 0 0' }}>/// CREATE NEW ENTRY</p>
            </div>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px' }}>
            {/* 左側：編輯區 */}
            <form onSubmit={handlePublish}>
               <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' }}>
                  <div className="input-group">
                    <label className="input-label">Date</label>
                    <input type="date" className="styled-input" value={newPost.date} onChange={e => setNewPost({...newPost, date: e.target.value})} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Language</label>
                    <select className="styled-select" value={newPost.lang} onChange={e => setNewPost({...newPost, lang: e.target.value})}>
                      <option value="zh">繁體中文 (ZH)</option>
                      <option value="en">English (EN)</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Category</label>
                    <select className="styled-select" value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})}>
                      <option>Product</option>
                      <option>Thinking</option>
                      <option>Company</option>
                    </select>
                  </div>
               </div>
               <div className="input-group">
                  <label className="input-label">Title</label>
                  <input type="text" className="styled-input" placeholder="Post Title" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} />
               </div>
               <div className="input-group">
                  <label className="input-label">Content</label>
                  <textarea className="styled-textarea" placeholder="Markdown content..." value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}></textarea>
               </div>
              <button type="submit" className="btn-submit" disabled={loading}><Save size={16} style={{marginRight:8}} /> {loading ? 'PUBLISHING…' : 'PUBLISH'}</button>
            </form>

            {/* 右側：列表區 */}
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', color: '#C9B37E', borderBottom: '1px solid #163832', paddingBottom: '8px', marginBottom: '24px' }}>/// RECENT ENTRIES</div>
              <div>
                {posts.map(post => (
                  <div key={post.id} className="post-card">
                    <div>
                      <div style={{ fontSize: '10px', opacity: 0.5, fontFamily: 'monospace', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: post.lang === 'en' ? '#5F8F7A' : '#C9B37E', fontWeight: 'bold' }}>
                          [{post.lang.toUpperCase()}]
                        </span>
                        <span>{post.date}</span>
                      </div>
                      <div style={{ fontWeight: 'bold' }}>{post.title}</div>
                    </div>
                    <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer' }}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}