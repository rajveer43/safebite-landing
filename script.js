// Animate the hero report card's score ring + counter + stamp once visible.
const REPORT_SCORE = 92;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateReportCard() {
  const ring = document.querySelector('.ring__fill');
  const valueEl = document.getElementById('scoreValue');
  const stampEl = document.getElementById('reportStamp');
  if (!ring || !valueEl) return;

  if (prefersReducedMotion) {
    ring.style.strokeDashoffset = String(100 - REPORT_SCORE);
    valueEl.textContent = String(REPORT_SCORE);
    stampEl?.classList.add('is-visible');
    return;
  }

  ring.style.strokeDashoffset = String(100 - REPORT_SCORE);

  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    valueEl.textContent = String(Math.round(REPORT_SCORE * eased)).padStart(2, '0');
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      stampEl?.classList.add('is-visible');
    }
  }
  requestAnimationFrame(tick);
}

// Mark elements for scroll-reveal (skipped entirely under reduced motion).
if (!prefersReducedMotion) {
  document
    .querySelectorAll('.case__entry, .procedure__step, .badge, .ledger__row')
    .forEach((el) => el.setAttribute('data-reveal', ''));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));
}

// Trigger the report card animation once, when the hero scrolls into view.
const reportCard = document.querySelector('.report-card');
if (reportCard) {
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateReportCard();
          cardObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 },
  );
  cardObserver.observe(reportCard);
} else {
  animateReportCard();
}
