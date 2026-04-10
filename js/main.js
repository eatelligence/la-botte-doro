/* ============================================================
   LA BOTTE D'ORO — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── NAV SCROLL BEHAVIOUR ──────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const handleScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── MOBILE MENU ─────────────────────────────────────────── */
  const burger   = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const closeBtn = document.querySelector('.nav__mobile-close');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => mobileMenu.classList.add('open'));
    closeBtn?.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  /* ── HERO IMAGE LOAD ─────────────────────────────────────── */
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    const img = new Image();
    img.src = heroBg.style.backgroundImage?.replace(/url\(["']?/, '').replace(/["']?\)/, '') || '';
    img.onload = () => heroBg.classList.add('loaded');
    // Fallback: always add loaded after a moment
    setTimeout(() => heroBg.classList.add('loaded'), 500);
  }

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── MENU TABS ───────────────────────────────────────────── */
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');
  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById(tab.dataset.tab);
        if (target) {
          target.classList.add('active');
          // Re-trigger reveals inside newly shown panel
          target.querySelectorAll('.reveal').forEach(el => {
            el.classList.add('visible');
          });
        }
      });
    });
  }

  /* ── ACTIVE NAV LINK ─────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── FAQ ACCORDION ───────────────────────────────────────── */
  document.querySelectorAll('.faq__q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq__item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq__item.open').forEach(el => el.classList.remove('open'));
      // Open clicked (unless it was already open)
      if (!isOpen) item.classList.add('open');
    });
  });
  // Open first FAQ by default
  const firstFaq = document.querySelector('.faq__item');
  if (firstFaq) firstFaq.classList.add('open');

  /* ── CONTACT FORM ─────────────────────────────────────────── */
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      btn.textContent = 'Message Sent!';
      btn.disabled = true;
      btn.style.background = 'var(--c-olive)';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.background = '';
        form.reset();
      }, 4000);
    });
  }

});
