# ELLEZ LLC - Cloudflare Pages 部署指南

## 📁 靜態網站文件清單

```
cloudflare-pages/
├── index.html          # 主頁面
├── style.css           # 樣式表
├── script.js           # JavaScript 功能
├── LOGO-.png           # 公司 LOGO
├── robots.txt          # SEO 搜索引擎指令
├── sitemap.xml         # 網站地圖
├── 404.html            # 錯誤頁面
├── _headers            # Cloudflare 標頭設定
├── _redirects          # Cloudflare 重導向規則
└── README.md           # 本說明文件
```

## 🚀 Cloudflare Pages 部署步驟

### 方法 1：GitHub 自動部署（推薦）

1. **創建 GitHub Repository**
   - 登入 [GitHub](https://github.com)
   - 點擊 "New repository"
   - 命名為 `ellez-website`
   - 設為 Public
   - 創建 repository

2. **上傳文件到 GitHub**
   - 下載 [GitHub Desktop](https://desktop.github.com/) 或使用 Git 命令
   - Clone repository 到本地
   - 將 `cloudflare-pages` 資料夾中的所有文件複製到 repository
   - Commit 並 Push 到 GitHub

3. **連接 Cloudflare Pages**
   - 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 選擇 "Pages" > "Create a project"
   - 選擇 "Connect to Git"
   - 授權 GitHub 並選擇你的 repository
   - Build 設定：
     - Framework preset: `None`
     - Build command: 留空
     - Build output directory: `/`
   - 點擊 "Save and Deploy"

### 方法 2：直接上傳

1. **準備文件**
   - 將 `cloudflare-pages` 資料夾壓縮為 ZIP 文件

2. **Cloudflare Pages 上傳**
   - 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
   - 選擇 "Pages" > "Create a project"
   - 選擇 "Upload assets"
   - 上傳 ZIP 文件
   - 輸入專案名稱（如：`ellez-website`）
   - 點擊 "Create project"

## 🌐 自訂域名設定

部署完成後，你會獲得一個 `*.pages.dev` 域名。要使用 `ellez.site`：

1. **在 Cloudflare Pages 中**：
   - 進入你的 Pages 專案
   - 點擊 "Custom domains"
   - 點擊 "Set up a custom domain"
   - 輸入 `ellez.site`

2. **DNS 設定**：
   - 確保 `ellez.site` 已添加到你的 Cloudflare 帳戶
   - Cloudflare 會自動創建必要的 DNS 記錄

## ✅ 優勢

### 相比 InfinityFree + WordPress：

1. **免費 SSL 憑證** ✅ 自動配置，無需額外設定
2. **全球 CDN** ✅ 超快載入速度
3. **無限頻寬** ✅ 沒有流量限制
4. **自動備份** ✅ Git 版本控制
5. **零維護** ✅ 無需更新 WordPress 或外掛
6. **高安全性** ✅ 靜態網站，無資料庫攻擊風險
7. **SEO 友善** ✅ 更快的載入速度提升搜索排名

## 🔧 未來更新

要更新網站內容：

### GitHub 方式：
1. 編輯 repository 中的文件
2. Commit 並 Push
3. Cloudflare Pages 自動重新部署

### 直接上傳方式：
1. 編輯本地文件
2. 重新上傳到 Cloudflare Pages

## 📞 技術支援

如有問題，請聯繫：
- Email: sukailin1124@gmail.com
- 或參考 [Cloudflare Pages 文檔](https://developers.cloudflare.com/pages/)

---

**ELLEZ LLC** - Where Technology Meets Emotion  
🚀 現在你的網站將擁有企業級的性能和安全性！
