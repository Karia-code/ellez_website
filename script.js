// ELLEZ LLC - Interactive Features
// Scroll animations and smooth navigation

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
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
                if (navToggle.checked) {
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
        
        if (!nav.contains(event.target) && navToggle.checked) {
            navToggle.checked = false;
        }
    });
    
    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navToggle = document.getElementById('nav-toggle');
            if (navToggle.checked) {
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
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // Add staggered animation delay for cards
    const cards = document.querySelectorAll('.fade-in-card');
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    console.log('🚀 ELLEZ LLC website loaded successfully!');
});

// Performance optimization: Reduce animation frequency on low-end devices
const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
if (isLowEndDevice) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
} else {
    document.documentElement.style.setProperty('--animation-duration', '0.8s');
}
