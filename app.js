document.documentElement.classList.add("js");

// Mobile detection helper — used to scope mobile-only features
const IS_MOBILE = () => window.matchMedia("(max-width: 720px)").matches;

// Service worker registration (PWA — Add to Home Screen, offline cache)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Silent — service worker is progressive enhancement only.
    });
  });
}

/* ============================================================
   Link prefetching — pointerenter / touchstart starts loading
   the target page before the user actually clicks. Pairs with
   the Speculation Rules in <head> for browsers that don't support them.
   ============================================================ */
(() => {
  const prefetched = new Set();

  const prefetch = (href) => {
    if (!href || prefetched.has(href)) return;
    prefetched.add(href);
    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = href;
    link.as = "document";
    document.head.appendChild(link);
  };

  const handler = (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
    if (link.target && link.target !== "_self") return;
    try {
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      prefetch(url.href);
    } catch (_) { /* ignore */ }
  };

  document.addEventListener("pointerenter", handler, { capture: true, passive: true });
  document.addEventListener("touchstart", handler, { capture: true, passive: true });
})();

// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("mobileMenu");

if (toggle && menu) {
  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  // Close on Escape
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
}

// Footer year
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// Sticky CTA bar — hide while hero CTAs are even partially in view.
// Bar appears only once the hero's Plan a Visit button is fully out of viewport,
// so there's never a duplicate button visible at the same time.
const siteCta = document.querySelector(".site-cta");
const heroActions = document.querySelector(".hero--photo .hero__actions");
if (siteCta && heroActions && "IntersectionObserver" in window) {
  const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      siteCta.classList.toggle("is-hidden", entry.isIntersecting);
    });
  }, { threshold: 0 });
  ctaObserver.observe(heroActions);
}

// Messages library — filter chips toggle which cards are shown
const libraryGrid = document.querySelector("[data-library-grid]");
if (libraryGrid) {
  const chips = Array.from(document.querySelectorAll(".library__chip"));
  const cards = Array.from(libraryGrid.querySelectorAll(".library-card"));
  const empty = document.querySelector("[data-library-empty]");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const filter = chip.dataset.filter || "all";

      chips.forEach((c) => {
        const isActive = c === chip;
        c.classList.toggle("is-active", isActive);
        c.setAttribute("aria-selected", String(isActive));
      });

      let visibleCount = 0;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.type === filter;
        card.hidden = !match;
        if (match) visibleCount++;
      });

      if (empty) empty.hidden = visibleCount > 0;
    });
  });
}

// Highlights feature — big photo + side thumbs (desktop) / dots (mobile).
// Auto-advances every 8s. Slides are <a> tags; clicking the photo navigates.
// Thumb/dot clicks swap the visible slide and pause auto-advance.
const lifeStage = document.querySelector("[data-life-stage]");
if (lifeStage) {
  const slides = Array.from(lifeStage.querySelectorAll(".life-slide"));
  const thumbs = Array.from(document.querySelectorAll(".life-thumb[data-life-target]"));
  const dots = Array.from(document.querySelectorAll(".life-dot[data-life-target]"));
  const caption = lifeStage.querySelector("[data-life-caption]");
  const progress = lifeStage.querySelector("[data-life-progress]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (slides.length > 0) {
    let activeIndex = slides.findIndex((s) => s.classList.contains("is-active"));
    if (activeIndex < 0) activeIndex = 0;
    let interactionTaken = false;
    let timer = null;

    const syncSelector = (collection, next) => {
      collection.forEach((el, i) => {
        const isActive = i === next;
        el.classList.toggle("is-active", isActive);
        el.setAttribute("aria-selected", String(isActive));
      });
    };

    const setActive = (next) => {
      if (next === activeIndex || next < 0 || next >= slides.length) return;
      slides[activeIndex].classList.remove("is-active");
      slides[next].classList.add("is-active");
      syncSelector(thumbs, next);
      syncSelector(dots, next);
      if (caption) {
        const text = slides[next].dataset.caption || "";
        caption.textContent = text;
      }
      activeIndex = next;
      restartProgress();
    };

    const restartProgress = () => {
      if (!progress) return;
      progress.classList.remove("is-running", "is-paused");
      void progress.offsetWidth;
      if (!interactionTaken && !reduceMotion) {
        progress.classList.add("is-running");
      } else {
        progress.classList.add("is-paused");
      }
    };

    const advance = () => {
      const next = (activeIndex + 1) % slides.length;
      setActive(next);
    };

    const startAuto = () => {
      stopAuto();
      if (interactionTaken || reduceMotion) return;
      timer = setInterval(advance, 8000);
      restartProgress();
    };

    const stopAuto = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };

    const wireSelector = (el, idx) => {
      el.addEventListener("click", (event) => {
        // Don't let dot/thumb taps inside the slide anchor trigger navigation
        event.preventDefault();
        interactionTaken = true;
        stopAuto();
        setActive(idx);
        if (progress) {
          progress.classList.remove("is-running");
          progress.classList.add("is-paused");
        }
      });
    };

    thumbs.forEach((thumb, idx) => wireSelector(thumb, idx));
    dots.forEach((dot, idx) => wireSelector(dot, idx));

    // Mobile swipe gestures — drag the big photo left/right to advance.
    // A real swipe (>50px horizontal, <40px vertical) advances; a tap navigates.
    let touchStartX = 0;
    let touchStartY = 0;
    let touchActive = false;

    lifeStage.addEventListener("touchstart", (event) => {
      if (!IS_MOBILE()) return;
      const t = event.changedTouches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchActive = true;
    }, { passive: true });

    lifeStage.addEventListener("touchend", (event) => {
      if (!IS_MOBILE() || !touchActive) return;
      touchActive = false;
      const t = event.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dy) < 40) {
        event.preventDefault();
        interactionTaken = true;
        stopAuto();
        const next = dx < 0
          ? (activeIndex + 1) % slides.length
          : (activeIndex - 1 + slides.length) % slides.length;
        setActive(next);
        if (progress) {
          progress.classList.remove("is-running");
          progress.classList.add("is-paused");
        }
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });

    lifeStage.addEventListener("mouseenter", stopAuto);
    lifeStage.addEventListener("mouseleave", () => {
      if (!interactionTaken) startAuto();
    });

    startAuto();
  }
}

// Hero slideshow — fade between slides every N ms.
// Safeguards: respects prefers-reduced-motion, pauses when tab hidden,
// skips broken/unloaded images, waits for the next slide to be ready before showing.
const slideshow = document.querySelector(".hero__slideshow");
if (slideshow) {
  const slides = Array.from(slideshow.querySelectorAll(".hero__slide"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVAL_MS = 7000;

  if (slides.length > 1 && !reduceMotion) {
    let currentIndex = slides.findIndex((s) => s.classList.contains("is-active"));
    if (currentIndex < 0) currentIndex = 0;
    let timer = null;

    const isReady = (slide) => {
      const img = slide.querySelector("img");
      return img && img.complete && img.naturalWidth > 0;
    };

    // Mark broken images so we can skip them
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img) return;
      img.addEventListener("error", () => slide.dataset.broken = "true");
    });

    const findNextReady = (from) => {
      for (let i = 1; i <= slides.length; i++) {
        const idx = (from + i) % slides.length;
        const slide = slides[idx];
        if (slide.dataset.broken === "true") continue;
        if (isReady(slide)) return idx;
      }
      return -1;
    };

    const advance = () => {
      const nextIndex = findNextReady(currentIndex);
      if (nextIndex < 0 || nextIndex === currentIndex) return;
      slides[currentIndex].classList.remove("is-active");
      slides[nextIndex].classList.add("is-active");
      currentIndex = nextIndex;
    };

    const start = () => {
      stop();
      timer = setInterval(advance, INTERVAL_MS);
    };
    const stop = () => {
      if (timer) { clearInterval(timer); timer = null; }
    };

    // Pause when the tab is hidden (saves CPU + battery on mobile)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    // If first image isn't loaded yet, wait for it before starting
    const firstImg = slides[currentIndex].querySelector("img");
    if (firstImg && firstImg.complete) {
      start();
    } else if (firstImg) {
      firstImg.addEventListener("load", start, { once: true });
      firstImg.addEventListener("error", start, { once: true });
    }
  }
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Dialogs
const dialogButtons = document.querySelectorAll("[data-dialog-open]");
dialogButtons.forEach((button) => {
  const dialogId = button.getAttribute("data-dialog-open");
  const dialog = dialogId ? document.getElementById(dialogId) : null;
  if (!dialog) {
    return;
  }

  button.addEventListener("click", (event) => {
    event.preventDefault();
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog && typeof dialog.close === "function") {
      dialog.close();
    }
  });

  dialog.querySelectorAll("[data-dialog-close]").forEach((close) => {
    close.addEventListener("click", () => {
      if (typeof dialog.close === "function") {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
      }
    });
  });
});

// Reveal cards
const revealItems = document.querySelectorAll("[data-reveal]");
if (revealItems.length) {
  if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    revealItems.forEach((item) => observer.observe(item));
  }
}

// Bethel revealed progression
const revealCards = Array.from(document.querySelectorAll(".reveal-card"));
const revealDetails = Array.from(document.querySelectorAll(".reveal-card .reveal-more"));
const storyLine = document.querySelector(".story__line");

if (revealCards.length && revealDetails.length && storyLine) {
  const defaultLine = storyLine.dataset.default || storyLine.textContent;

  const setState = (activeIndex) => {
    if (activeIndex === null) {
      storyLine.textContent = defaultLine;
      revealCards.forEach((card) => card.classList.remove("is-dim", "is-next", "is-active"));
      return;
    }

    const line = revealCards[activeIndex]?.dataset.line;
    if (line) {
      storyLine.textContent = line;
    }

    revealCards.forEach((card, index) => {
      card.classList.toggle("is-active", index === activeIndex);
      card.classList.toggle("is-dim", index < activeIndex);
      card.classList.toggle("is-next", index === activeIndex + 1);
    });
  };

  revealDetails.forEach((details, index) => {
    details.addEventListener("toggle", () => {
      if (details.open) {
        revealDetails.forEach((other) => {
          if (other !== details) {
            other.open = false;
          }
        });
        setState(index);
      } else {
        const openIndex = revealDetails.findIndex((item) => item.open);
        setState(openIndex >= 0 ? openIndex : null);
      }
    });
  });

  const initialIndex = revealDetails.findIndex((details) => details.open);
  setState(initialIndex >= 0 ? initialIndex : null);
}

// Altar tabs
const altarTabs = Array.from(document.querySelectorAll(".altar-tab"));
const altarPanels = Array.from(document.querySelectorAll(".altar-panels .altar-panel"));

if (altarTabs.length && altarPanels.length) {
  const activateTab = (tab) => {
    altarTabs.forEach((button) => {
      const isSelected = button === tab;
      button.setAttribute("aria-selected", String(isSelected));
      button.tabIndex = isSelected ? 0 : -1;
    });

    altarPanels.forEach((panel) => {
      panel.hidden = panel.id !== tab.getAttribute("aria-controls");
    });
  };

  const currentTab = altarTabs.find((tab) => tab.getAttribute("aria-selected") === "true") || altarTabs[0];
  activateTab(currentTab);

  altarTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));

    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const next = altarTabs[(index + 1) % altarTabs.length];
        next.focus();
        activateTab(next);
      }
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const prev = altarTabs[(index - 1 + altarTabs.length) % altarTabs.length];
        prev.focus();
        activateTab(prev);
      }
    });
  });
}

// Path nodes
const pathNodes = Array.from(document.querySelectorAll(".path__node"));
const pathDrawers = Array.from(document.querySelectorAll(".path__drawer"));

if (pathNodes.length && pathDrawers.length) {
  const setActiveNode = (node) => {
    pathNodes.forEach((button) => {
      const isActive = button === node;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    pathDrawers.forEach((drawer) => {
      drawer.classList.toggle("is-active", drawer.dataset.panel === node.dataset.target);
    });
  };

  const initial = pathNodes.find((node) => node.classList.contains("is-active")) || pathNodes[0];
  setActiveNode(initial);

  pathNodes.forEach((node) => {
    node.addEventListener("click", () => setActiveNode(node));
    node.addEventListener("mouseenter", () => setActiveNode(node));
    node.addEventListener("focus", () => setActiveNode(node));
  });
}

/* ============================================================
   Announcement bar — site-wide. Auto-shows until the user dismisses
   it OR the event passes. Edit the EVENT constant below to swap in
   future announcements; the same logic handles dates and dismiss.
   ============================================================ */
(() => {
  const EVENT = {
    key: "bwc-announce-convention-2026",
    title: "Annual Convention 2026",
    sub: "Jun 12–14 · Pastor Shaji Paul",
    href: "/events/",
    startDate: new Date("2026-06-12T18:30:00-04:00"),
    endDate: new Date("2026-06-15T00:00:00-04:00"),
  };

  const now = new Date();
  if (now > EVENT.endDate) return; // event over — never show again
  try { if (localStorage.getItem(EVENT.key)) return; } catch (_) {} // user dismissed

  // Countdown text
  const msPerDay = 86400000;
  const daysLeft = Math.ceil((EVENT.startDate - now) / msPerDay);
  let countdown = "";
  if (now >= EVENT.startDate && now < EVENT.endDate) countdown = " · happening now";
  else if (daysLeft > 1) countdown = ` · in ${daysLeft} days`;
  else if (daysLeft === 1) countdown = " · tomorrow";
  else if (daysLeft === 0) countdown = " · today";

  const bar = document.createElement("div");
  bar.className = "announce";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "Announcement");
  bar.innerHTML = `
    <a class="announce__link" href="${EVENT.href}">
      <span class="announce__badge" aria-hidden="true">✦</span>
      <span class="announce__text">
        <strong class="announce__title">${EVENT.title}</strong>
        <span class="announce__sub">${EVENT.sub}${countdown}</span>
      </span>
      <span class="announce__arrow" aria-hidden="true">Learn more →</span>
    </a>
    <button class="announce__close" type="button" aria-label="Dismiss announcement">×</button>
  `;
  document.body.prepend(bar);
  document.body.classList.add("has-announce");

  bar.querySelector(".announce__close").addEventListener("click", () => {
    try { localStorage.setItem(EVENT.key, "1"); } catch (_) {}
    bar.classList.add("is-dismissed");
    document.body.classList.remove("has-announce");
    setTimeout(() => bar.remove(), 300);
  });
})();

/* ============================================================
   Bottom-sheet Zoom dialog (mobile)
   On mobile, the <dialog> becomes a bottom sheet with drag-to-dismiss.
   On desktop, the default centered-modal behavior is preserved.
   ============================================================ */
(() => {
  const dialog = document.getElementById("zoomDialog");
  if (!dialog) return;

  // Add a handle element if not present
  if (!dialog.querySelector(".zoom-dialog__handle")) {
    const handle = document.createElement("span");
    handle.className = "zoom-dialog__handle";
    handle.setAttribute("aria-hidden", "true");
    const inner = dialog.querySelector(".zoom-dialog__inner");
    if (inner) inner.prepend(handle);
  }

  // Drag-to-dismiss on mobile
  let dragStartY = 0;
  let dragCurrentY = 0;
  let dragging = false;
  const inner = dialog.querySelector(".zoom-dialog__inner");

  const onStart = (event) => {
    if (!IS_MOBILE()) return;
    dragging = true;
    dragStartY = event.touches ? event.touches[0].clientY : event.clientY;
    dragCurrentY = dragStartY;
    if (inner) inner.style.transition = "none";
  };

  const onMove = (event) => {
    if (!dragging) return;
    dragCurrentY = event.touches ? event.touches[0].clientY : event.clientY;
    const dy = Math.max(0, dragCurrentY - dragStartY);
    if (inner) inner.style.transform = `translateY(${dy}px)`;
  };

  const onEnd = () => {
    if (!dragging) return;
    dragging = false;
    const dy = dragCurrentY - dragStartY;
    if (inner) {
      inner.style.transition = "transform 0.25s ease";
      if (dy > 100) {
        // Dismiss
        if (typeof dialog.close === "function") dialog.close();
        else dialog.removeAttribute("open");
        // Reset after close
        setTimeout(() => { inner.style.transform = ""; }, 250);
      } else {
        inner.style.transform = "";
      }
    }
  };

  dialog.addEventListener("touchstart", (e) => {
    // Only start drag if touching the handle area (top 60px)
    const rect = inner.getBoundingClientRect();
    if (e.touches[0].clientY - rect.top < 60) onStart(e);
  }, { passive: true });
  dialog.addEventListener("touchmove", onMove, { passive: true });
  dialog.addEventListener("touchend", onEnd);
})();

/* ============================================================
   Native Share buttons — uses navigator.share where available,
   falls back to copy-link with a toast.
   Auto-injects share buttons into library cards and event cards.
   ============================================================ */
(() => {
  const baseUrl = window.location.origin + window.location.pathname.replace(/index\.html$/, "");

  // Auto-inject into library cards
  document.querySelectorAll(".library-card").forEach((card) => {
    if (card.querySelector("[data-share]")) return;
    const title = card.querySelector(".library-card__title")?.textContent?.trim() || "Bethel message";
    const ref = card.querySelector(".library-card__ref")?.textContent?.trim() || "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "share-btn";
    btn.setAttribute("aria-label", `Share ${title}`);
    btn.setAttribute("data-share", "");
    btn.setAttribute("data-share-title", title);
    btn.setAttribute("data-share-text", `${title} — ${ref}`);
    btn.setAttribute("data-share-url", baseUrl);
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg><span class="share-btn__label">Share</span>';
    card.appendChild(btn);
  });

  // Auto-inject into event cards
  document.querySelectorAll(".event-card").forEach((card) => {
    if (card.querySelector("[data-share]")) return;
    const title = card.querySelector(".event-card__title")?.textContent?.trim() || "Bethel event";
    const where = card.querySelector(".event-card__where")?.textContent?.trim() || "";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "share-btn share-btn--event";
    btn.setAttribute("aria-label", `Share ${title}`);
    btn.setAttribute("data-share", "");
    btn.setAttribute("data-share-title", title);
    btn.setAttribute("data-share-text", `${title} — ${where}`);
    btn.setAttribute("data-share-url", baseUrl);
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
    card.appendChild(btn);
  });

  const shareButtons = document.querySelectorAll("[data-share]");
  if (!shareButtons.length) return;

  const showToast = (text) => {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 300);
    }, 2400);
  };

  shareButtons.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      const title = btn.dataset.shareTitle || document.title;
      const text = btn.dataset.shareText || "";
      const url = btn.dataset.shareUrl || window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch (err) {
          // user cancelled — fine
        }
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          showToast("Link copied to clipboard");
        } catch {
          showToast(url);
        }
      } else {
        showToast(url);
      }
    });
  });
})();

/* ============================================================
   Form submit — show toast/success banner without leaving page (demo).
   For real submission, wire to your form endpoint.
   ============================================================ */
(() => {
  const forms = document.querySelectorAll("[data-toast-on-submit]");
  forms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const msg = form.querySelector("[data-form-msg]");
      if (msg) {
        msg.hidden = false;
        msg.classList.add("is-visible");
      }
      // Reset fields
      form.reset();
      setTimeout(() => {
        if (msg) {
          msg.classList.remove("is-visible");
          msg.hidden = true;
        }
      }, 4500);
    });
  });
})();

/* ============================================================
   Add-to-Calendar buttons — generates .ics on the fly
   ============================================================ */
(() => {
  const calButtons = document.querySelectorAll("[data-ics]");
  if (!calButtons.length) return;

  const pad = (n) => String(n).padStart(2, "0");
  const toIcsDate = (iso) => {
    const d = new Date(iso);
    return (
      d.getUTCFullYear() +
      pad(d.getUTCMonth() + 1) +
      pad(d.getUTCDate()) +
      "T" +
      pad(d.getUTCHours()) +
      pad(d.getUTCMinutes()) +
      "00Z"
    );
  };

  calButtons.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const title = btn.dataset.icsTitle || "Bethel Event";
      const start = btn.dataset.icsStart;
      const end = btn.dataset.icsEnd;
      const location = btn.dataset.icsLocation || "";
      const description = btn.dataset.icsDescription || "";
      if (!start || !end) return;

      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Bethel Worship Center//EN",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@bwcny.org`,
        `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
        `DTSTART:${toIcsDate(start)}`,
        `DTEND:${toIcsDate(end)}`,
        `SUMMARY:${title}`,
        `LOCATION:${location}`,
        `DESCRIPTION:${description}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.ics`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  });
})();

/* ============================================================
   Live-now badge (homepage) — shows when a service is currently running
   ============================================================ */
(() => {
  const badge = document.querySelector("[data-live-badge]");
  if (!badge) return;

  // Day: 0=Sun, 1=Mon, ..., 6=Sat. Times in 24h local (Eastern assumed).
  const SERVICES = [
    { day: 0, start: "09:30", end: "10:30", name: "English Service",  link: "visit/",  type: "inperson" },
    { day: 0, start: "10:30", end: "12:30", name: "Malayalam Service", link: "visit/", type: "inperson" },
    { day: 1, start: "19:30", end: "21:00", name: "Bible Study",       link: null,      type: "zoom" },
    { day: 2, start: "20:00", end: "21:30", name: "Prayer Line · Malayalam", link: null, type: "zoom" },
    { day: 3, start: "20:00", end: "21:30", name: "Prayer Line · Youth & English", link: null, type: "zoom" },
    { day: 5, start: "19:00", end: "21:30", name: "Youth Night",       link: "youth/", type: "inperson" },
    { day: 6, start: "19:00", end: "21:00", name: "Saturday Bible Study", link: "visit/", type: "inperson" },
  ];

  const checkLive = () => {
    const now = new Date();
    const day = now.getDay();
    const hhmm = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    const live = SERVICES.find((s) => s.day === day && hhmm >= s.start && hhmm < s.end);

    if (live) {
      const nameEl = badge.querySelector("[data-live-name]");
      if (nameEl) nameEl.textContent = live.name;
      const actionEl = badge.querySelector("[data-live-action]");
      if (live.type === "zoom") {
        badge.setAttribute("href", "#");
        badge.setAttribute("data-dialog-open", "zoomDialog");
        if (actionEl) actionEl.textContent = "Join Zoom →";
      } else {
        badge.setAttribute("href", live.link || "visit/");
        badge.removeAttribute("data-dialog-open");
        if (actionEl) actionEl.textContent = "Open →";
      }
      badge.hidden = false;
    } else {
      badge.hidden = true;
    }
  };

  // Handle clicks — badge is dynamic so we wire its click here directly
  badge.addEventListener("click", (event) => {
    if (badge.getAttribute("data-dialog-open") === "zoomDialog") {
      event.preventDefault();
      const dlg = document.getElementById("zoomDialog");
      if (dlg && typeof dlg.showModal === "function") dlg.showModal();
      else if (dlg) dlg.setAttribute("open", "");
    }
  });

  checkLive();
  setInterval(checkLive, 60000); // re-check every minute
})();

/* ============================================================
   Floating "back to top" button (mobile)
   Appears after scrolling > 600px; scrolls smoothly back to top on tap.
   ============================================================ */
(() => {
  // Only inject on mobile to keep desktop untouched
  if (!window.matchMedia("(max-width: 720px)").matches) return;

  const btn = document.createElement("button");
  btn.className = "back-to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = "<span aria-hidden=\"true\">↑</span>";
  document.body.appendChild(btn);

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle("is-visible", window.scrollY > 600);
      ticking = false;
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ============================================================
   Adaptive theme-color — keeps iOS Safari status bar matching
   the surface the user is looking at.
   Detects the dominant section in view and updates <meta name="theme-color">.
   ============================================================ */
(() => {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (!meta || !("IntersectionObserver" in window)) return;

  // Sections that should colour the status bar darkly
  const DARK_BG = "#0A0A0A";
  const LIGHT_BG = "#FFFFFF";

  const darkSections = document.querySelectorAll(
    ".stage--hero, .stage--dark, .stage--mosaic, .y-hero, .y-stats, .y-next, .y-roster, .ministries .band--dark, .footer"
  );

  if (!darkSections.length) {
    meta.setAttribute("content", LIGHT_BG);
    return;
  }

  let darkInView = 0;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      darkInView += entry.isIntersecting ? 1 : -1;
    });
    darkInView = Math.max(0, darkInView);
    meta.setAttribute("content", darkInView > 0 ? DARK_BG : LIGHT_BG);
  }, { threshold: 0.5 });

  darkSections.forEach((el) => observer.observe(el));
})();

/* ============================================================
   View Transitions API — smooth crossfade between pages where supported.
   ============================================================ */
(() => {
  if (!("startViewTransition" in document)) return;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;
    if (link.hasAttribute("data-dialog-open")) return;
    // Only same-origin navigations
    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    document.startViewTransition(() => {
      window.location.href = url.href;
    });
  });
})();
