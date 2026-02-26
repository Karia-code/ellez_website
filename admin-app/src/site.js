// src/site.js

// 1. 引入 Firebase 功能 (Vite 會幫您處理這些 import)
import { db } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore';

// ELLEZ LLC - Interactive Features & Data Loading
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. Firebase 資料讀取邏輯 (新增的部分)
    // ==========================================
    async function loadAnnouncements() {
        // Support both id and class containers across EN/ZH pages
        const container = document.querySelector('#dynamic-updates-list, .update-list');
        
        // 如果頁面上沒有公告區塊(例如在其他頁面)，就直接結束，避免報錯
        if (!container) return; 

        container.innerHTML = '<div class="loading-text">Loading updates...</div>';

        try {
            // ★ 這裡指向您截圖中的正確路徑 "updates"
            const querySnapshot = await getDocs(collection(db, "updates"));
            
            let items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });

                        // 排序：優先使用 createdAt (Timestamp)，否則以 dateStr Fallback
                        items.sort((a, b) => {
                                const aTime = a.createdAt && typeof a.createdAt.toDate === 'function'
                                    ? a.createdAt.toDate().getTime()
                                    : Date.parse(a.dateStr || 0);
                                const bTime = b.createdAt && typeof b.createdAt.toDate === 'function'
                                    ? b.createdAt.toDate().getTime()
                                    : Date.parse(b.dateStr || 0);
                                return (bTime || 0) - (aTime || 0);
                        });

            if (items.length === 0) {
                container.innerHTML = '<div class="loading-text">No updates found.</div>';
            } else {
                renderAnnouncements(items);
            }

        } catch (error) {
            console.error("Error loading updates:", error);
            // 這裡可以選擇不顯示錯誤給使用者，或是顯示友善訊息
            container.innerHTML = '<div class="error-text">Unable to load updates.</div>';
        }
    }

    function renderAnnouncements(data) {
    const container = document.querySelector('#dynamic-updates-list, .update-list');
        container.innerHTML = '';

        data.forEach(item => {
            const div = document.createElement('div');
            div.className = 'update-item fade-in-section visible'; // 加 visible 讓它直接顯示，或讓 Observer 處理
            
            // ★ 對應資料庫欄位: dateStr, title, excerpt
            div.innerHTML = `
              <span class="update-date">${item.dateStr || 'Date Pending'}</span>
              <div class="update-content-preview">
                <h3>${item.title || 'Untitled'}</h3>
                <p>${item.excerpt || item.content || ''}</p>
              </div>
              <span class="material-icons arrow-icon">arrow_forward</span>
            `;
            
            // 點擊事件 (如果需要彈出視窗功能，可以加在這裡)
            // div.onclick = () => openModal(item); 
            
            container.appendChild(div);
        });
    }

    // 啟動資料讀取
    loadAnnouncements();


    // ==========================================
    // 2. 原本的 UI 動畫邏輯 (您提供的部分)
    // ==========================================

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            // 避免空連結報錯
            if(targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navToggle = document.getElementById('nav-toggle');
                if (navToggle && navToggle.checked) {
                    navToggle.checked = false;
                }
            }
        });
    });
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeInElements = document.querySelectorAll('.fade-in-section, .fade-in-card');
    fadeInElements.forEach(element => {
        observer.observe(element);
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a[href^="#"]');
    
    function highlightCurrentSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.offsetHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Throttled scroll listener for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                highlightCurrentSection();
                scrollTimeout = null;
            }, 10);
        }
    });
    
    // Initial call to set active section
    highlightCurrentSection();
    
    // Mobile menu close when clicking outside
    document.addEventListener('click', function(event) {
        const nav = document.querySelector('.navbar');
        const navToggle = document.getElementById('nav-toggle');
        
        if (nav && !nav.contains(event.target) && navToggle && navToggle.checked) {
            navToggle.checked = false;
        }
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle && navToggle.checked) {
                navToggle.checked = false;
            }
        }
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // Add staggered animation delay for cards
    const cards = document.querySelectorAll('.fade-in-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    console.log('🚀 ELLEZ LLC site.js loaded with Firebase');
});