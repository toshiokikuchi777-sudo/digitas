/* INDEX PAGE — index.js */

// Lower threshold for index page
const obs = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.05 }
);
document.querySelectorAll('.fade').forEach(el => obs.observe(el));

// Trigger immediately for above-fold items
setTimeout(() => document.querySelectorAll('.fade').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) el.classList.add('in');
}), 100);
