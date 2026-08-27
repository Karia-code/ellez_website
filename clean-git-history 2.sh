#!/bin/bash

echo "🧹 Git 歷史清理方案"
echo "===================="
echo ""
echo "由於舊的 API key 已在 Git 歷史中，我們有以下選項："
echo ""
echo "選項 1 (推薦): 完全重置倉庫"
echo "  - 最簡單、最徹底"
echo "  - 會失去 commit 歷史"
echo ""
echo "選項 2: 使用 git filter-branch (已內建)"
echo "  - 保留歷史但較複雜"
echo "  - 需要較長時間"
echo ""
read -p "請選擇 (1/2): " choice

if [ "$choice" = "1" ]; then
    echo ""
    echo "⚠️  警告：這將刪除所有 Git 歷史記錄！"
    read -p "確定要繼續嗎？(yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo ""
        echo "步驟："
        echo "1. 請先到 GitHub 刪除 ellez_website 倉庫"
        echo "2. 在 GitHub 創建新的空倉庫 (同名: ellez_website)"
        echo "3. 完成後按 Enter 繼續..."
        read
        
        # 刪除 .git 目錄
        rm -rf .git
        
        # 重新初始化
        git init
        git add -A
        git commit -m "Initial commit with secure Firebase configuration"
        
        # 添加遠端並推送
        git remote add origin https://github.com/Karia-code/ellez_website.git
        git branch -M main
        
        echo ""
        echo "✅ 本地倉庫已重置！"
        echo ""
        echo "現在執行："
        echo "  git push -u origin main --force"
    fi
    
elif [ "$choice" = "2" ]; then
    echo ""
    echo "使用 git filter-branch 清理..."
    echo "這可能需要幾分鐘..."
    
    # 使用 filter-branch 替換
    git filter-branch --tree-filter 'find . -type f \( -name "*.js" -o -name "*.html" -o -name "*.jsx" \) -exec sed -i "" "s/AIzaSyCYi-6vZqsSsI6X1hhXHcABR--MlD3-mTY/AIzaSyBH-fFCxGVXIKN0QB1FPHwyUKYQrbDt4qA/g" {} \; 2>/dev/null || true' --all
    
    # 清理
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
    
    echo ""
    echo "✅ Git 歷史已清理！"
    echo ""
    echo "現在執行："
    echo "  git push origin main --force"
else
    echo "操作已取消"
fi
