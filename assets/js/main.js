console.log("Menu working ✅");
// ===== LANGUAGE SYSTEM =====
let currentLang = localStorage.getItem("lang") || "ro";
const i18n = {
  ro: {
    search_placeholder: "🔎 Caută...",
    back: "← Înapoi",
    community: "👥 COMUNITATE",
    administration: "🏛️ ADMINISTRAȚIE",
    housing: "🏡 LOCUIRE",
    environment: "🌱 MEDIU",
    mobility: "🚗 MOBILITATE",
    economy: "💰 ECONOMIE",
    monitor: "📄 MONITOR",
  },
  hu: {
    search_placeholder: "🔎 Keresés...",
    back: "← Vissza",
    community: "👥 KÖZÖSSÉG",
    administration: "🏛️ KÖZIGAZGATÁS",
    housing: "🏡 LAKÓHELY",
    environment: "🌱 KÖRNYEZET",
    mobility: "🚗 MOBILITÁS",
    economy: "💰 GAZDASÁG",
    monitor: "📄 MONITOR",
  },
};
// ===== GLOBAL =====
let nav, toggle;
let allSections = [];
let searchInput;
// ===== CACHE DOM =====
function cacheDOM() {
  nav = document.querySelector("nav");
  toggle = document.querySelector(".menu-toggle");
  searchInput = document.getElementById("search-input");
}
// ===== MENU =====
function initMenu() {
  const menuItems = document.querySelectorAll(".menu-left li");
  menuItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        handleMobileMenu(item);
      }
    });
    item.addEventListener("mouseenter", () => {
      if (window.innerWidth > 900) {
        handleDesktopMenu(item);
      }
    });
  });
}
// ===== MOBILE MENU =====
function handleMobileMenu(item) {
  const targetId = item.dataset.target;
  const menu = item.closest(".split-menu");
  const rightSide = menu.querySelector(".menu-right");
  rightSide.querySelectorAll(".menu-content").forEach((c) => {
    c.classList.remove("active");
  });
  const active = rightSide.querySelector(`#${targetId}`);
  if (active) active.classList.add("active");
  rightSide.classList.add("active");
  addBackButton(rightSide);
}
function addBackButton(container) {
  if (container.querySelector(".back-button")) return;
  const btn = document.createElement("div");
  btn.className = "back-button";
  btn.textContent = "← Înapoi";
  btn.addEventListener("click", () => {
    container.classList.remove("active");
  });
  container.prepend(btn);
}
// ===== DESKTOP MENU =====
function handleDesktopMenu(item) {
  const menu = item.closest(".split-menu");
  const rightSide = menu.querySelector(".menu-right");
  const targetId = item.dataset.target;
  const allItems = menu.querySelectorAll(".menu-left li");
  const allContent = menu.querySelectorAll(".menu-content");
  allItems.forEach((i) => i.classList.remove("active"));
  allContent.forEach((c) => c.classList.remove("active"));
  item.classList.add("active");
  const active = rightSide.querySelector(`#${targetId}`);
  if (active) active.classList.add("active");
}
// ===== NAV TOGGLE =====
function initNavToggle() {
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    document.body.classList.toggle("nav-open");
  });
}
// ===== DROPDOWN =====
function initDropdowns() {
  document.querySelectorAll(".dropdown > a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      const parent = link.parentElement;
      document.querySelectorAll(".dropdown").forEach((d) => {
        if (d !== parent) d.classList.remove("active");
      });
      parent.classList.toggle("active");
    });
  });
}
// ===== OUTSIDE CLICK =====
function initOutsideClick() {
  document.addEventListener("click", (e) => {
    if (!e.target.closest("nav") && !e.target.closest(".menu-toggle")) {
      nav.classList.remove("active");
      document.body.classList.remove("nav-open");
      document.querySelectorAll(".dropdown").forEach((d) => {
        d.classList.remove("active");
      });
      document.querySelectorAll(".menu-right").forEach((r) => {
        r.classList.remove("active");
      });
    }
  });
}
// ===== PREVENT CLOSE =====
function preventCloseOnInternalLinks() {
  document.querySelectorAll(".dropdown a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        e.stopPropagation();
      }
    });
  });
}
// ===== RESIZE FIX =====
function initResizeFix() {
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      nav.classList.remove("active");
      document.body.classList.remove("nav-open");
      document.querySelectorAll(".menu-right").forEach((r) => {
        r.classList.remove("active");
      });
    }
  });
}
// ===== MENU INIT =====
function initMenuSystem() {
  cacheDOM();
  initMenu();
  initNavToggle();
  initDropdowns();
  initOutsideClick();
  preventCloseOnInternalLinks();
  initResizeFix();
}
function applyLanguage() {
  const dict = i18n[currentLang];
  if (searchInput) {
    searchInput.placeholder = dict.search_placeholder;
  }
  document.querySelectorAll("nav > ul > li.dropdown > a").forEach((el) => {
    const key = el.getAttribute("href")?.replace("#", "");
    switch (key) {
      case "comunitate":
        el.textContent = dict.community;
        break;
      case "administratie":
        el.textContent = dict.administration;
        break;
      case "locuire":
        el.textContent = dict.housing;
        break;
      case "mediu":
        el.textContent = dict.environment;
        break;
      case "mobilitate":
        el.textContent = dict.mobility;
        break;
      case "economie":
        el.textContent = dict.economy;
        break;
      case "monitor":
        el.textContent = dict.monitor;
        break;
    }
  });
  document.querySelectorAll(".back-button").forEach((btn) => {
    btn.textContent = dict.back;
  });
}
function initLanguageToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  // initial label
  btn.textContent = currentLang.toUpperCase();
  btn.addEventListener("click", () => {
    currentLang = currentLang === "ro" ? "hu" : "ro";
    localStorage.setItem("lang", currentLang);
    btn.textContent = currentLang.toUpperCase();
    applyLanguage();
  });
}
// ===== SEARCH =====
function updateSections() {
  allSections = document.querySelectorAll("section");
}
function initSearch() {
  if (!searchInput) return;
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    allSections.forEach((section) => {
      const text = section.innerText.toLowerCase();
      removeHighlights(section);
      if (text.includes(query)) {
        section.style.display = "block";
        if (query.length > 2) {
          highlightText(section, query);
        }
      } else {
        section.style.display = query ? "none" : "block";
      }
    });
  });
}
function highlightText(element, query) {
  const regex = new RegExp(`(${query})`, "gi");
  element.querySelectorAll("*").forEach((node) => {
    if (node.children.length === 0) {
      node.innerHTML = node.innerHTML.replace(regex, `<mark>$1</mark>`);
    }
  });
}
function removeHighlights(element) {
  element.querySelectorAll("mark").forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}
// ===== THEME =====
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    btn.textContent = "☀️";
  }
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    btn.textContent = isDark ? "☀️" : "🌙";
  });
}
// ===== COMPONENT LOADER =====
async function loadComponent(id, path) {
  try {
    const res = await fetch(path);
    const html = await res.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error("Component load error:", path);
  }
}
async function loadAllComponents() {
  await Promise.all([
    loadComponent("header-container", "assets/components/partials/header.html"),
    loadComponent("home-container", "assets/components/sections/home.html"),
    loadComponent(
      "comunitate-container",
      "assets/components/sections/comunitate.html",
    ),
    loadComponent(
      "administratie-container",
      "assets/components/sections/administratie.html",
    ),
    loadComponent(
      "locuire-container",
      "assets/components/sections/locuire.html",
    ),
    loadComponent("mediu-container", "assets/components/sections/mediu.html"),
    loadComponent(
      "mobilitate-container",
      "assets/components/sections/mobilitate.html",
    ),
    loadComponent(
      "economie-container",
      "assets/components/sections/economie.html",
    ),
    loadComponent(
      "monitor-container",
      "assets/components/sections/monitor.html",
    ),
    loadComponent("footer-container", "assets/components/partials/footer.html"),
  ]);
}
// ===== APP INIT =====
async function initApp() {
  await loadAllComponents();
  initMenuSystem();
  updateSections();
  initSearch();
  initThemeToggle();
  initLanguageToggle();
  applyLanguage();
}
initApp();
