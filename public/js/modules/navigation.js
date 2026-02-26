// ========================================
// Navigation Module - 導航列互動功能
// ========================================

// 初始化導航列功能
export function initNavigation() {
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
        if (navToggle && navToggle.checked) {
          navToggle.checked = false;
        }
      }
    });
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
    
    if (nav && navToggle && !nav.contains(event.target) && navToggle.checked) {
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

  console.log('🧭 Navigation initialized');
}
