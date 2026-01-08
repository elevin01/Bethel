document.documentElement.classList.add("js");

// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("mobileMenu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.hidden = isOpen;
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  });
}

// Footer year
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
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

  button.addEventListener("click", () => {
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
