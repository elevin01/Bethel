document.documentElement.classList.add("js");

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
