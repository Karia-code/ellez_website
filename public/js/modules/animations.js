// ========================================
// Animations Module - 滾動動畫和互動效果
// ========================================

// 初始化所有動畫效果
export function initAnimations() {
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

  // Add staggered animation delay for cards
  const cards = document.querySelectorAll('.fade-in-card');
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
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

  console.log('✨ Animations initialized');
}

// Performance optimization: Reduce animation frequency on low-end devices
export function optimizePerformance() {
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
  if (isLowEndDevice) {
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
  } else {
    document.documentElement.style.setProperty('--animation-duration', '0.8s');
  }
}
