// Main JS for Nakedi Physiotherapy
document.addEventListener('DOMContentLoaded', () => {
  // ===== Helpers for header offset =====
  const headerEl = document.querySelector('.site-header');
  const getHeaderOffset = () => (headerEl?.offsetHeight || 80) + 12;
  const scrollToWithOffset = (el) => {
    const y = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  // ===== Smooth scroll for in-page links =====
  const smoothLinks = document.querySelectorAll('a[href^="#"], .btn[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      // Update active state immediately
      navLinks.forEach(a => {
        a.classList.remove('active');
      });
      if (link.classList.contains('primary-nav') || link.closest('.primary-nav')) {
        link.classList.add('active');
      }

      scrollToWithOffset(target);
      history.pushState(null, '', href); // optional: keeps hash in URL
      closeMobileNav();

      // Re-highlight after scroll completes
      setTimeout(highlightNav, 100);
    });
  });

  // ===== Active nav highlighting on scroll =====
  const sections = document.querySelectorAll('main, section');
  const navLinks = document.querySelectorAll('.primary-nav a');

  function highlightNav() {
    let currentId = '';
    const headerOffset = getHeaderOffset();
    const scrollPosition = window.scrollY + headerOffset + 50; // Add buffer for better detection

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.id || 'home';
      }
    });

    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  window.addEventListener('resize', highlightNav);
  highlightNav();

  // ===== Reveal on scroll for sections =====
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('section').forEach(sec => io.observe(sec));

  // ===== Header background subtle change on scroll =====
  const header = document.querySelector('.site-header');
  const headerUpdate = () => {
    const scrolled = window.scrollY > 8;
    header.style.background = scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)';
    header.style.boxShadow = scrolled ? '0 4px 16px rgba(2,12,36,0.08)' : '0 1px 3px rgba(2,12,36,0.03)';
  };
  headerUpdate();
  window.addEventListener('scroll', headerUpdate, { passive: true });

  // ===== Mobile menu toggle =====
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');

  function closeMobileNav(){
    if (!primaryNav) return;
    primaryNav.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });

    // Reset on resize > breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Adjust when landing on or changing a hash =====
  const adjustForHash = () => {
    if (location.hash.length > 1) {
      const el = document.querySelector(location.hash);
      if (el) scrollToWithOffset(el);
    }
  };
  window.addEventListener('load', adjustForHash);
  window.addEventListener('hashchange', adjustForHash);

  // ===== Footer year =====
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
