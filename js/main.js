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

  // === VÍDEO LIGHTBOX MODAL & INTERACTIONS ===
  let videoModal = document.querySelector('.video-modal');

  if (!videoModal) {
    videoModal = document.createElement('div');
    videoModal.className = 'video-modal';
    videoModal.innerHTML = `
      <div class="video-modal-content">
        <button class="video-modal-close" aria-label="Cerrar vídeo">&times;</button>
        <video controls autoplay playsinline class="video-modal-player"></video>
      </div>
    `;
    document.body.appendChild(videoModal);
  }

  const modalPlayer = videoModal.querySelector('.video-modal-player');
  const modalCloseBtn = videoModal.querySelector('.video-modal-close');

  function openVideoModal(videoSrc) {
    if (!videoSrc) return;
    modalPlayer.src = videoSrc;
    modalPlayer.play();
    videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    videoModal.classList.remove('active');
    modalPlayer.pause();
    modalPlayer.currentTime = 0;
    modalPlayer.src = '';
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video]');
    if (trigger) {
      e.preventDefault();
      const videoSrc = trigger.getAttribute('data-video');
      openVideoModal(videoSrc);
    }
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVideoModal);
  }

  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('active')) {
      closeVideoModal();
    }
  });

  // === IMAGE LIGHTBOX MODAL (Full Untruncated View) ===
  let imageModal = document.querySelector('.image-modal');

  if (!imageModal) {
    imageModal = document.createElement('div');
    imageModal.className = 'image-modal';
    imageModal.innerHTML = `
      <div class="image-modal-content">
        <button class="image-modal-close" aria-label="Cerrar imagen">&times;</button>
        <img src="" alt="" class="image-modal-img">
        <div class="image-modal-title"></div>
      </div>
    `;
    document.body.appendChild(imageModal);
  }

  const modalImg = imageModal.querySelector('.image-modal-img');
  const modalImgTitle = imageModal.querySelector('.image-modal-title');
  const modalImgCloseBtn = imageModal.querySelector('.image-modal-close');

  function openImageModal(imgSrc, imgAlt) {
    if (!imgSrc) return;
    modalImg.src = imgSrc;
    modalImg.alt = imgAlt || 'Go!! Animación';
    modalImgTitle.textContent = imgAlt || '';
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeImageModal() {
    imageModal.classList.remove('active');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-video]') || e.target.closest('.video-play-btn')) return;

    const imgTrigger = e.target.closest('.gallery-item img, .svc-card-media img, .modulo-media img, .candybar-subitem img, .candybar-main img, .split-media img, .process-media img');
    if (imgTrigger) {
      e.preventDefault();
      openImageModal(imgTrigger.src, imgTrigger.alt);
    }
  });

  if (modalImgCloseBtn) {
    modalImgCloseBtn.addEventListener('click', closeImageModal);
  }

  imageModal.addEventListener('click', (e) => {
    if (e.target === imageModal) {
      closeImageModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
      closeImageModal();
    }
  });

});


