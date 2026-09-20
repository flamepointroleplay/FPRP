// Mobile nav toggle
const navToggle = document.getElementById("nav-toggle");
const header = document.getElementById("site-header");
if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  header.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// FAQ accordion
document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    const panel = item.querySelector(".accordion-panel");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".accordion-item.open").forEach((openItem) => {
      if (openItem !== item) {
        openItem.classList.remove("open");
        openItem.querySelector(".accordion-panel").style.maxHeight = "";
      }
    });

    if (isOpen) {
      item.classList.remove("open");
      panel.style.maxHeight = "";
    } else {
      item.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

// Scroll reveal animation
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}
