console.log("Menu working ✅");

const nav = document.querySelector("nav");
const toggle = document.querySelector(".menu-toggle");

const items = document.querySelectorAll(".menu-left li");
const contents = document.querySelectorAll(".menu-content");

// ===== MOBILE SPLIT MENU NAVIGATION =====
items.forEach((item) => {
  item.addEventListener("click", () => {
    const targetId = item.dataset.target;
    const menu = item.closest(".split-menu");
    const rightSide = menu.querySelector(".menu-right");

    // Hide all menu-content
    rightSide
      .querySelectorAll(".menu-content")
      .forEach((c) => c.classList.remove("active"));

    // Show selected content
    const activeContent = rightSide.querySelector(`#${targetId}`);
    if (activeContent) activeContent.classList.add("active");

    // Slide in right side
    rightSide.classList.add("active");

    // Add back button if not exists
    let backBtn = rightSide.querySelector(".back-button");
    if (!backBtn) {
      backBtn = document.createElement("div");
      backBtn.className = "back-button";
      backBtn.innerText = "← Înapoi";
      rightSide.prepend(backBtn);
      backBtn.addEventListener("click", () => {
        rightSide.classList.remove("active");
      });
    }
  });
});

// ===== DESKTOP HOVER BEHAVIOR =====
items.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    if (window.innerWidth <= 900) return;

    const menu = item.closest(".split-menu");
    const rightSide = menu.querySelector(".menu-right");
    const targetId = item.dataset.target;

    items.forEach((i) => i.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    item.classList.add("active");

    const targetContent = rightSide.querySelector(`#${targetId}`);
    if (targetContent) targetContent.classList.add("active");
  });
});

// ===== NAV TOGGLE (MOBILE) =====
if (toggle) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

// ===== DROPDOWN LINKS CLICK (MOBILE) =====
document.querySelectorAll(".dropdown > a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (window.innerWidth > 900) return; // ignore desktop

    e.preventDefault();
    e.stopPropagation();

    const parent = this.parentElement;

    // Close other dropdowns
    document.querySelectorAll(".dropdown").forEach((d) => {
      if (d !== parent) d.classList.remove("active");
    });

    parent.classList.toggle("active");
  });
});

// ===== SUBMENU LINKS CLICK (MOBILE LEVEL 2) =====
document.querySelectorAll(".dropdown-menu > li > a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (window.innerWidth > 900) return; // ignore desktop

    const parent = this.parentElement;
    const submenu = parent.querySelector(".dropdown-submenu");

    if (!submenu) return;

    e.preventDefault();
    e.stopPropagation();

    // Close other submenus
    parent.parentElement.querySelectorAll("li").forEach((li) => {
      if (li !== parent) li.classList.remove("submenu-active");
    });

    parent.classList.toggle("submenu-active");
  });
});

// ===== CLICK OUTSIDE TO CLOSE =====
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
    nav.classList.remove("active");
    document
      .querySelectorAll(".dropdown")
      .forEach((d) => d.classList.remove("active"));
    document
      .querySelectorAll(".submenu-active")
      .forEach((s) => s.classList.remove("submenu-active"));
    document
      .querySelectorAll(".menu-right")
      .forEach((r) => r.classList.remove("active"));
  }
});

// ===== WINDOW RESIZE FIX =====
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    nav.classList.remove("active");
    document
      .querySelectorAll(".menu-right")
      .forEach((r) => r.classList.remove("active"));
  }
});
