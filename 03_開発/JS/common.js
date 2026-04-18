/* ============================================================
   DIGITAS — common.js
   共通スクリプト（フェード・ハンバーガー・スクロール効果）
   ============================================================ */

// Fade-in observer
const obs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.fade').forEach(el => obs.observe(el));

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const drawer = document.querySelector('.mobile-drawer');
const overlay = document.querySelector('.drawer-overlay');

if (hamburger && drawer && overlay) {
  function toggleMenu() {
    hamburger.classList.toggle('active');
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
  }
  hamburger.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', toggleMenu));
}

// Nav scroll shadow
const nav = document.querySelector('nav');
if (nav) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// Back to top button
const btt = document.querySelector('.back-to-top');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  });
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
