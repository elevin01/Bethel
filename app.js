// Mobile menu
const toggle = document.querySelector(".nav__toggle");
const menu = document.getElementById("mobileMenu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.hidden = isOpen;
  });

  // Close on link click
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    });
  });
}

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();
