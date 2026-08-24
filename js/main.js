// Main JavaScript functionality

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu && !e.target.closest('nav')) {
      navMenu.classList.remove('active');
      if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
    }
  });
  
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
  });
  
  // Der Parallax-Effekt des Kopfbereichs ist entfallen. Er verschob den
  // Kopfbereich beim Scrollen um die halbe Strecke nach unten, was so lange
  // unsichtbar blieb, wie darunter nichts stand. Seit die Startseite die
  // Angebotsblöcke trägt, schob sich der Kopfbereich sichtbar über sie:
  // bei 600 px Scrollhöhe ragte er 154 px in die erste Karte hinein.
  // .hero gibt es ausserdem nur auf index.html, hier hängt nichts anderes dran.
  
  // Active nav link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
});
