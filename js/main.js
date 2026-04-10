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
  const burger     = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const closeBtn   = document.querySelector('.nav__mobile-close');

  // Store scroll position before locking — iOS needs position:fixed trick
  // to actually stop the page scrolling under the overlay.
  let _scrollY = 0;

  function openMenu() {
    _scrollY = window.scrollY;
    // Lock body scroll (iOS-safe)
    document.body.style.position   = 'fixed';
    document.body.style.top        = `-${_scrollY}px`;
    document.body.style.width      = '100%';
    document.body.style.overflowY  = 'scroll'; // keep scrollbar gutter, prevent shift
    document.body.classList.add('nav-open');
    // Open overlay
    mobileMenu.classList.add('open');
    // Burger → ✕
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    // Move focus into the menu for screen-readers
    closeBtn?.focus();
  }

  function closeMenu() {
    // Unlock body scroll and restore position
    document.body.style.position  = '';
    document.body.style.top       = '';
    document.body.style.width     = '';
    document.body.style.overflowY = '';
    document.body.classList.remove('nav-open');
    window.scrollTo({ top: _scrollY, behavior: 'instant' });
    // Close overlay
    mobileMenu.classList.remove('open');
    // ✕ → burger
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    // Return focus to the trigger
    burger.focus();
  }

  if (burger && mobileMenu) {
    burger.addEventListener('click', openMenu);

    // Close button (✕ in top corner)
    closeBtn?.addEventListener('click', closeMenu);

    // Close when a nav link is tapped
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    // Close on backdrop tap (user taps the overlay but not a link)
    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) closeMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
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

  /* ── MOBILE CTA BAR ─────────────────────────────────────────
     Slide bar off-screen when the footer scrolls into view.
     Using IntersectionObserver so no scroll event overhead.   */
  const mobCta = document.getElementById('mob-cta');
  if (mobCta) {
    const footer = document.querySelector('.footer');
    if (footer) {
      const footerObs = new IntersectionObserver(
        ([entry]) => mobCta.classList.toggle('hidden', entry.isIntersecting),
        { threshold: 0 }
      );
      footerObs.observe(footer);
    }
    // Hide while mobile menu is open — observer restores it on close
    if (burger) {
      burger.addEventListener('click', () => mobCta.classList.add('hidden'));
      // On menu close, let the IntersectionObserver re-evaluate naturally;
      // also do an immediate restore so bar reappears without waiting for scroll
      const restoreCta = () => mobCta.classList.remove('hidden');
      closeBtn?.addEventListener('click', restoreCta);
      mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', restoreCta));
    }
  }

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
