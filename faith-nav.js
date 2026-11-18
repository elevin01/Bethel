/* Enhance the Statement of Faith chapter navigation without hiding content. */
(() => {
  const faith = document.getElementById('faith');
  if (!faith) return;
  const links = Array.from(faith.querySelectorAll('.creed__pills a[href^="#creed-"]'));
  const sections = links.map((link) => document.getElementById(link.getAttribute('href').slice(1)));
  if (!links.length || sections.some((section) => !section)) return;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    if (faith.getBoundingClientRect().bottom < 0) return;
    const threshold = Math.min(window.innerHeight * .38, 330);
    let active = sections[0];
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= threshold) active = section;
    });
    links.forEach((link) => {
      if (link.hash === '#' + active.id) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };
  const queue = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  window.addEventListener('hashchange', queue);
  links.forEach((link) => link.addEventListener('click', () => {
    links.forEach((other) => other.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'location');
  }));
  update();
})();