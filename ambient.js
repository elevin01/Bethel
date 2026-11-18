/* Bethel's progressive ambient motion; visual enhancement only. */
(() => {
  const root = document.querySelector('.welcome-site');
  if (!root) return;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gallery = document.querySelector('.w-life-grid');
  const meter = document.querySelector('.bwc-life-meter span');
  const ornament = document.querySelector('.bwc-hero-ornament');
  let movementFrame = 0;
  let galleryFrame = 0;

  // Keep all content visible if JavaScript is unavailable or motion is reduced.
  if (!motionPreference.matches && 'IntersectionObserver' in window) {
    const selector = [
      '.w-sunday .w-sunday-copy',
      '.w-life .w-section-head',
      '.w-life-card',
      '.w-community .w-wrap',
      '.w-week > div',
      '.w-week-list > a',
      '.w-visit-home > div',
      '.w-scene-content > *',
      '.w-editorial-head > .w-wrap > div',
      '.w-next-step .w-wrap'
    ].join(', ');

    const targets = Array.from(document.querySelectorAll(selector));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('bwc-before');
        entry.target.classList.add('bwc-entered');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -18px 0px' });

    targets.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      // Never hide the opening viewport; avoid flashes on refresh and back-navigation.
      if (rect.top <= window.innerHeight * .91) return;
      el.classList.add('bwc-reveal', 'bwc-before');
      if (el.classList.contains('w-life-card')) {
        el.style.setProperty('--bwc-reveal-delay', (index % 3) * 90 + 'ms');
      }
      observer.observe(el);
    });

    motionPreference.addEventListener?.('change', (event) => {
      if (!event.matches) return;
      observer.disconnect();
      targets.forEach((el) => {
        el.classList.remove('bwc-before');
        el.classList.add('bwc-entered');
      });
    }, { once: true });
  }

  // Almost imperceptible pointer depth on the hero's illustration.
  if (ornament && !motionPreference.matches && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const hero = document.querySelector('.w-home-hero');
    const reset = () => {
      cancelAnimationFrame(movementFrame);
      ornament.style.setProperty('--bwc-parallax-x', '0px');
      ornament.style.setProperty('--bwc-parallax-y', '0px');
    };
    hero.addEventListener('pointermove', (event) => {
      if (motionPreference.matches) return reset();
      const bounds = hero.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - .5) * 20;
      const y = ((event.clientY - bounds.top) / bounds.height - .5) * 16;
      cancelAnimationFrame(movementFrame);
      movementFrame = requestAnimationFrame(() => {
        ornament.style.setProperty('--bwc-parallax-x', x.toFixed(1) + 'px');
        ornament.style.setProperty('--bwc-parallax-y', y.toFixed(1) + 'px');
      });
    }, { passive: true });
    hero.addEventListener('pointerleave', reset);
    motionPreference.addEventListener?.('change', (event) => { if (event.matches) reset(); });
  }

  // A tactile progress track for the swipeable six-card gallery on phones.
  if (gallery && meter) {
    const updateMeter = () => {
      galleryFrame = 0;
      const range = gallery.scrollWidth - gallery.clientWidth;
      const fraction = range > 0 ? gallery.scrollLeft / range : 1;
      const progress = Math.max(0.13, Math.min(1, 0.13 + fraction * 0.87));
      meter.style.setProperty('--bwc-meter-progress', String(progress));
    };
    const queue = () => {
      if (!galleryFrame) galleryFrame = requestAnimationFrame(updateMeter);
    };
    gallery.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
    updateMeter();
  }
})();