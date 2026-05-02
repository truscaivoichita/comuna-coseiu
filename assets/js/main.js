console.log("Menu working ✅");
let currentLang = localStorage.getItem("lang") || "ro";
let communityDict = {};
let navDict = {};
let homeDict = {};
let nav, toggle;
let allSections = [];
let searchInput;
function cacheDOM() {
  nav = document.querySelector("nav");
  toggle = document.querySelector(".menu-toggle");
  searchInput = document.getElementById("search-input");
}
function initMenuDelegation() {
  document.addEventListener("click", (e) => {
    const item = e.target.closest(".menu-left li");
    if (item) {
      if (window.innerWidth <= 900) {
        handleMobileMenu(item);
      } else {
        handleDesktopMenu(item);
      }
    }
    if (!e.target.closest("nav") && !e.target.closest(".menu-toggle")) {
      if (nav) {
        nav.classList.remove("active");
        document.body.classList.remove("nav-open");
      }
      document
        .querySelectorAll(".dropdown")
        .forEach((d) => d.classList.remove("active"));
      document
        .querySelectorAll(".menu-right")
        .forEach((r) => r.classList.remove("active"));
    }
  });
}
function handleMobileMenu(item) {
  const targetId = item.dataset.target;
  const menu = item.closest(".split-menu");
  if (!menu) return;
  const rightSide = menu.querySelector(".menu-right");
  if (!rightSide) return;
  rightSide
    .querySelectorAll(".menu-content")
    .forEach((c) => c.classList.remove("active"));
  const active = rightSide.querySelector(`#${targetId}`);
  if (active) active.classList.add("active");
  rightSide.classList.add("active");
  addBackButton(rightSide);
}
function addBackButton(container) {
  if (container.querySelector(".back-button")) return;
  const btn = document.createElement("div");
  btn.className = "back-button";
  btn.textContent = navDict.inapoi || btn.textContent;
  btn.addEventListener("click", () => {
    container.classList.remove("active");
  });
  container.prepend(btn);
}
function handleDesktopMenu(item) {
  const menu = item.closest(".split-menu");
  if (!menu) return;
  const rightSide = menu.querySelector(".menu-right");
  if (!rightSide) return;
  const targetId = item.dataset.target;
  menu
    .querySelectorAll(".menu-left li")
    .forEach((i) => i.classList.remove("active"));
  rightSide
    .querySelectorAll(".menu-content")
    .forEach((c) => c.classList.remove("active"));
  item.classList.add("active");
  const active = rightSide.querySelector(`#${targetId}`);
  if (active) {
    active.classList.add("active");
    rightSide.classList.add("active");
  }
}
function initNavToggle() {
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    document.body.classList.toggle("nav-open");
  });
}
function initDropdowns() {
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.addEventListener("mouseenter", () => {
      if (window.innerWidth > 900) {
        dropdown.classList.add("active");
      }
    });
    dropdown.addEventListener("mouseleave", () => {
      if (window.innerWidth > 900) {
        dropdown.classList.remove("active");
      }
    });
  });
  document.querySelectorAll(".dropdown>a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth > 900) return;
      e.preventDefault();
      const parent = link.parentElement;
      const isActive = parent.classList.contains("active");
      document
        .querySelectorAll(".dropdown")
        .forEach((d) => d.classList.remove("active"));
      if (!isActive) {
        parent.classList.add("active");
      }
    });
  });
}
function preventCloseOnInternalLinks() {
  document.querySelectorAll(".dropdown a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        e.stopPropagation();
      }
    });
  });
}
function initResizeFix() {
  let lastWidth = window.innerWidth;
  window.addEventListener("resize", () => {
    const currentWidth = window.innerWidth;
    if (currentWidth > 900 && nav) {
      nav.classList.remove("active");
      document.body.classList.remove("nav-open");
    }
    lastWidth = currentWidth;
  });
}
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.style.display =
      document.documentElement.scrollTop > 200 ? "block" : "none";
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
function initMenuSystem() {
  cacheDOM();
  initMenuDelegation();
  initNavToggle();
  initDropdowns();
  preventCloseOnInternalLinks();
  initResizeFix();
}
async function loadNavLang(lang) {
  const res = await fetch(`assets/i18n/${lang}/nav.json`);
  navDict = await res.json();
  requestAnimationFrame(() => {
    applyNavLang();
  });
}
function applyNavLang() {
  if (!navDict) return;
  if (searchInput) {
    searchInput.placeholder = navDict.cauta;
  }
  document.querySelectorAll(".back-button").forEach((btn) => {
    btn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> ${navDict.inapoi}`;
  });
  document.querySelectorAll("nav>ul>li.dropdown>a").forEach((el) => {
    const key = el.getAttribute("href").replace("#", "");
    const menuItem = navDict.menu?.[key];
    if (menuItem?.label) {
      let icon = el.dataset.icon;
      if (!icon) {
        icon = `<i class="fa-solid ${menuItem.icon}"></i>`;
        el.dataset.icon = icon;
      }
      el.innerHTML = `${icon} ${menuItem.label}`;
    }
  });
  requestAnimationFrame(() => {
    applySubmenuLang();
  });
}
function applySubmenuLang() {
  document.querySelectorAll(".menu-left li").forEach((el) => {
    const target = el.dataset.target;
    if (!target) return;
    const splitMenu = el.closest(".split-menu");
    const dropdown = splitMenu?.closest(".dropdown");
    if (!dropdown) return;
    const category = [...dropdown.classList].find(
      (c) => c !== "dropdown" && c !== "active",
    );
    if (!category) return;
    const key = target.replace("menu-", "");
    const submenuObj = navDict?.submenu?.[category]?.[key];
    if (!submenuObj) return;
    let icon = submenuObj.icon
      ? `<i class="fa-solid ${submenuObj.icon}"></i>`
      : "";
    el.dataset.icon = icon;
    if (!icon) {
      icon = el.querySelector("i")?.outerHTML || "";
      el.dataset.icon = icon;
    }
    if (submenuObj?.title) {
      if (!icon) {
        icon = el.querySelector("i")?.outerHTML || "";
        el.dataset.icon = icon;
      }
      el.innerHTML = `${icon} ${submenuObj.title}`;
    }
  });
  document.querySelectorAll(".menu-content").forEach((menu) => {
    const id = menu.id.replace("menu-", "");
    const splitMenu = menu.closest(".split-menu");
    const dropdown = splitMenu?.closest(".dropdown");
    if (!dropdown) return;
    const category = [...dropdown.classList].find(
      (c) => c !== "dropdown" && c !== "active",
    );
    const submenuObj = navDict?.submenu?.[category]?.[id];
    if (!submenuObj || !submenuObj.links) return;
    const links = menu.querySelectorAll("a");
    links.forEach((link, index) => {
      if (submenuObj.links[index]) {
        const iconClass = submenuObj.links[index].icon;
        const icon = iconClass ? `<i class="fa-solid ${iconClass}"></i>` : "";
        link.innerHTML = `${icon} ${submenuObj.links[index].label}`;
      }
    });
  });
}
async function loadHomeLang(lang) {
  try {
    const res = await fetch(`assets/i18n/${lang}/home.json`);
    homeDict = await res.json();
    renderHome();
  } catch (err) {
    console.error("Failed to load home.json:", err);
  }
}
function renderHome() {
  if (!homeDict?.home) return;
  const data = homeDict.home;
  const container = document.getElementById("home-container");
  if (!container) return;
  container.innerHTML = `<section id="home" class="hero"><div class="hero-content"><i class="fa-solid ${data.icon}"></i><h1>${data.title}</h1><p>${data.subtitle}</p><div class="hero-buttons">${Object.values(
    data.buttons,
  )
    .map(
      (btn) =>
        `<a href="${btn.target}" class="btn btn-glass"><i class="fa-solid ${btn.icon}"></i> ${btn.label}</a>`,
    )
    .join(
      "",
    )}</div></div><div class="hero-image"><img src="${data.image.src}" alt="${data.image.alt}" loading="lazy"/></div><section class="quick-links">${Object.values(
    data.quick_links,
  )
    .map(
      (card) =>
        `<div class="quick-card"><i class="fa-solid ${card.icon}"></i><h3>${card.title}</h3><p>${card.description}${card.links.map((l) => `<div><a href="${l.href}" class="btn-link btn-section">${l.label}</a></div>`).join(" ")}</p></div>`,
    )
    .join(
      "",
    )}</section><section class="news"><i class="fa-solid ${data.news.icon}"></i><h2>${data.news.title}</h2><div class="news-list">${data.news.items.map((n) => `<article class="news-item"><h4><i class="fa-solid ${n.icon}"></i> ${n.title}</h4><p>${n.description}</p></article>`).join("")}</div></section></section>`;
}
async function loadCommunityLang(lang) {
  try {
    const res = await fetch(`assets/i18n/${lang}/comunitate.json`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    communityDict = await res.json();
    applyCommunityLang();
  } catch (err) {
    console.error("Failed to load comunitate.json:", err);
  }
}
function applyCommunityLang() {
  if (!communityDict) return;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = key.split(".").reduce((o, i) => o?.[i], communityDict);
    if (typeof value === "string") {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = value;
      } else {
        el.textContent = value;
      }
    }
  });
  const mapList = (id, data) => {
    const el = document.getElementById(id);
    if (el && data) {
      el.innerHTML = data.map((i) => `<li>${i}</li>`).join("");
    }
  };
  mapList("etnic-list", communityDict.cetateni?.etnic?.items);
  mapList("religie-list", communityDict.cetateni?.religie?.items);
  mapList("newsletter-list", communityDict.newsletter?.items);
  mapList("onoare-list", communityDict.cetateni_onoare?.items);
  mapList(
    "bugetare_participativa-list",
    communityDict.bugetare_participativa?.steps,
  );
  mapList("proceduri_online-list", communityDict.proceduri_online?.items);
}
function initLanguageToggle() {
  const btn = document.getElementById("lang-toggle");
  if (!btn) return;
  const languages = ["ro", "hu"];
  btn.textContent = currentLang.toUpperCase();
  btn.addEventListener("click", async () => {
    let index = languages.indexOf(currentLang);
    currentLang = languages[(index + 1) % languages.length];
    localStorage.setItem("lang", currentLang);
    btn.textContent = currentLang.toUpperCase();
    await loadNavLang(currentLang);
    await loadCommunityLang(currentLang);
    await loadHomeLang(currentLang);
  });
}
function updateSections() {
  allSections = document.querySelectorAll("section");
}
function initSearch() {
  if (!searchInput) return;
  let timeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
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
    }, 200);
  });
}
function highlightText(element, query) {
  const regex = new RegExp(`(${query})`, "gi");
  element.querySelectorAll("*").forEach((node) => {
    if (node.children.length === 0 && node.textContent.trim()) {
      const span = document.createElement("span");
      span.innerHTML = node.textContent.replace(regex, "<mark>$1</mark>");
      node.replaceWith(span);
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
async function loadConsilieri() {
  try {
    const res = await fetch("assets/data/consilieri.json");
    const consilieri = await res.json();
    const container = document.getElementById("consilieri-container");
    if (!container) return;
    container.innerHTML = "";
    consilieri.forEach((c) => {
      const card = document.createElement("div");
      card.className = "card consilier-card";
      card.innerHTML = `<h5><i class="fa-solid fa-user"></i> ${c.name}</h5><p><strong>Partid:</strong> ${c.partid}</p><p><strong>Mandat:</strong> ${c.mandat}</p><p><i class="fa-solid fa-phone"></i> ${c.tel}</p><p><i class="fa-solid fa-envelope"></i> ${c.email}</p><a href="${c.avere}" target="_blank" class="btn-link btn-section"><i class="fa-solid fa-file-lines"></i> Declarația de avere</a><a href="${c.interese}" target="_blank" class="btn-link btn-section"><i class="fa-solid fa-file-lines"></i> Declarația de interese</a>`;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading consilieri:", err);
  }
}
function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
  }
  updateIcon();
  btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcon();
  });
  function updateIcon() {
    const isDark = document.body.classList.contains("dark-mode");
    btn.innerHTML = isDark
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
  }
}
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
async function initApp() {
  await loadAllComponents();
  await new Promise((r) =>
    requestAnimationFrame(() => requestAnimationFrame(r)),
  );
  cacheDOM();
  initMenuSystem();
  await loadNavLang(currentLang);
  await loadCommunityLang(currentLang);
  await loadHomeLang(currentLang);
  loadConsilieri();
  updateSections();
  initSearch();
  initThemeToggle();
  initLanguageToggle();
  initBackToTop();
}
initApp();
