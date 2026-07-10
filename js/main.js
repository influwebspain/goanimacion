/* ============================================
   GO!! ANIMACIÓN - JavaScript Principal
   Navbar, scroll reveal, hamburger, smooth scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === HEADER SCROLL ===
  const header = document.querySelector('.navbar');
  const scrollTop = document.querySelector('.scroll-top');

  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll to top button
    if (scrollTop) {
      if (window.scrollY > 500) {
        scrollTop.classList.add('visible');
      } else {
        scrollTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Scroll to top click
  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // === HAMBURGER MENU ===
  const hamburger = document.querySelector('.nav-burger');
  const nav = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  function toggleNav() {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleNav);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', toggleNav);
  }

  // Close nav on link click
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (nav.classList.contains('active')) {
        toggleNav();
      }
    });
  });

  // === SCROLL REVEAL ===
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // === SMOOTH SCROLL FOR ANCHOR LINKS ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // === ACTIVE NAV LINK HIGHLIGHT ===
  const sections = document.querySelectorAll('section[id]');

  function highlightNav() {
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-menu a').forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            link.classList.toggle('active', href === `#${sectionId}`);
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);

  // === COUNTER ANIMATION FOR KPIs ===
  const kpiNumbers = document.querySelectorAll('.kpi-number, .hero-stat-num');

  function animateCounter(el) {
    const target = el.getAttribute('data-target');
    if (!target) return;

    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    const suffix = target.replace(/[0-9]/g, '');
    const duration = 2000;
    const increment = numericTarget / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  kpiNumbers.forEach(el => kpiObserver.observe(el));

});
