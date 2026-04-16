console.log("Menu working ✅");
// ===== LANGUAGE SYSTEM =====
let currentLang = localStorage.getItem("lang") || "ro";
let communityDict = {};
let navDict = {};
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
async function loadNavLang(lang) {
  const res = await fetch(`/assets/i18n/${lang}/nav.json`);
  navDict = await res.json();
  requestAnimationFrame(() => {
    applyNavLang();
  });
}
function applyNavLang() {
  console.log("nav items:", document.querySelectorAll(".menu-left li").length);
  if (!navDict) return;
  const items = document.querySelectorAll(".menu-left li");
  if (!items.length) return;
  // placeholder
  if (searchInput) {
    searchInput.placeholder = navDict.search_placeholder;
  }
  // back buttons
  document.querySelectorAll(".back-button").forEach((btn) => {
    btn.textContent = navDict.back;
  });
  // menu items
  document.querySelectorAll("nav > ul > li.dropdown > a").forEach((el) => {
    const text = el.getAttribute("href").replace("#", "");
    switch (text) {
      case "comunitate":
        el.textContent = navDict.menu.comunitate;
        break;
      case "administratie":
        el.textContent = navDict.menu.administratie;
        break;
      case "locuire":
        el.textContent = navDict.menu.locuire;
        break;
      case "mediu":
        el.textContent = navDict.menu.mediu;
        break;
      case "mobilitate":
        el.textContent = navDict.menu.mobilitate;
        break;
      case "economie":
        el.textContent = navDict.menu.economie;
        break;
      case "monitor":
        el.textContent = navDict.menu.monitor;
        break;
    }
  });
}
async function loadCommunityLang(lang) {
  const res = await fetch(`/assets/i18n/${lang}/comunitate.json`);
  communityDict = await res.json();
  applyCommunityLang();
}
function applyCommunityLang() {
  if (!communityDict) return;
  // simple text nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = key.split(".").reduce((o, i) => o?.[i], communityDict);
    if (typeof value === "string") {
      el.textContent = value;
    }
  });
  // lists
  const etnicList = document.getElementById("etnic-list");
  const religieList = document.getElementById("religie-list");
  if (etnicList) {
    etnicList.innerHTML = communityDict.cetateni.etnic.items
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
  if (religieList) {
    religieList.innerHTML = communityDict.cetateni.religie.items
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
}
function initLanguageToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  // initial label
  btn.textContent = currentLang.toUpperCase();
  btn.addEventListener("click", async () => {
    currentLang = currentLang === "ro" ? "hu" : "ro";
    localStorage.setItem("lang", currentLang);
    btn.textContent = currentLang.toUpperCase();
    await loadNavLang(currentLang);
    await loadCommunityLang(currentLang);
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
  cacheDOM();
  initMenuSystem();
  updateSections();
  initSearch();
  initThemeToggle();
  initLanguageToggle();
  await loadNavLang(currentLang);
  await new Promise((r) => requestAnimationFrame(r));
  cacheDOM();
}
initApp();
