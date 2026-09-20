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

// Departments nav dropdown
const deptDropdown = document.getElementById("departments-dropdown");
const deptTrigger = document.getElementById("departments-trigger");
if (deptDropdown && deptTrigger) {
  deptTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = deptDropdown.classList.toggle("open");
    deptTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  deptDropdown.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      deptDropdown.classList.remove("open");
      deptTrigger.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", (e) => {
    if (!deptDropdown.contains(e.target)) {
      deptDropdown.classList.remove("open");
      deptTrigger.setAttribute("aria-expanded", "false");
    }
  });
}

// Department rank selector
const rankSelect = document.getElementById("rank-select");
if (rankSelect) {
  const panels = document.querySelectorAll(".rank-panel");
  const showRank = (id) => {
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.rankId !== id;
    });
  };
  rankSelect.addEventListener("change", () => showRank(rankSelect.value));
  if (rankSelect.value) showRank(rankSelect.value);
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
