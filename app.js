/* Shared interactions for Bethel Worship Center. */
(() => {
  const siteRoot = new URL('.', document.currentScript.src);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(new URL('sw.js', siteRoot)).catch(() => {});
    });
  }

  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    const setMenu = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });
    document.addEventListener('keydown', (event) => {
      if (menu.hidden) return;
      if (event.key === 'Escape') {
        setMenu(false);
        toggle.focus();
      }
      if (event.key === 'Tab') {
        const items = [toggle, ...menu.querySelectorAll('a')];
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
      if (event.matches) setMenu(false);
    });
  }

  document.querySelectorAll('[data-dialog-open]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.dialogOpen);
    if (!dialog) return;
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      dialog.showModal();
    });
  });
  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.querySelectorAll('[data-dialog-close]').forEach((button) => {
      button.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Keep the existing statement-of-faith reveal behavior without hiding content
  // when JavaScript or IntersectionObserver is unavailable.
  const reveal = document.querySelectorAll('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    reveal.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveal.forEach((item) => observer.observe(item));
  }
})();
