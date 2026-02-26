// ========================================
// Firebase Configuration - Single Source of Truth
// ========================================
// 這個檔案只負責初始化 Firebase 並匯出，不包含業務邏輯

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase 配置 (公開金鑰在前端是安全的)
const firebaseConfig = {
  apiKey: "AIzaSyCYi-6vZqsSsI6X1hhXHcABR--MlD3-mTY",
  authDomain: "ellez-site.firebaseapp.com",
  projectId: "ellez-site",
  storageBucket: "ellez-site.firebasestorage.app",
  messagingSenderId: "161384067066",
  appId: "1:161384067066:web:22fd7fa7e6d6dbfa023e43",
  measurementId: "G-3LRGF5R73H"
};

// 初始化 Firebase (只執行一次)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 匯出供其他模組使用
export { app, db };
