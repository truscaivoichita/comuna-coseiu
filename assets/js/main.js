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
    item.replaceWith(item.cloneNode(true));
  });
  const freshItems = document.querySelectorAll(".menu-left li");
  freshItems.forEach((item) => {
    if (window.innerWidth <= 900) {
      item.addEventListener("click", () => handleMobileMenu(item));
    } else {
      item.addEventListener("mouseenter", () => handleDesktopMenu(item));
    }
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
  btn.textContent = navDict.inapoi || btn.textContent;
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
    rightSide.classList.add("active"); // 👈 IMPORTANT
  }
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
    link.onclick = null; // reset
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
// ===== BACK TO TOP =====
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  // Show button on scroll
  window.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop > 200) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });

  // Scroll to top smoothly
  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
  if (searchInput) {
    searchInput.placeholder = navDict.cauta;
  }
  document.querySelectorAll(".back-button").forEach((btn) => {
    btn.textContent = navDict.inapoi;
  });
  document.querySelectorAll("nav > ul > li.dropdown > a").forEach((el) => {
    const key = el.getAttribute("href").replace("#", "");
    el.textContent = navDict.menu?.[key] || el.textContent;
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
    const category = [...dropdown.classList].find(
      (c) => c !== "dropdown" && c !== "active",
    );
    if (!category) return;
    const key = target.replace("menu-", "");
    const submenuObj = navDict?.submenu?.[category]?.[key];
    if (typeof submenuObj === "object") {
      // ia primul text din obiect (ex: "dezbateri", "transport", etc.)
      const firstValue = Object.values(submenuObj)[0];
      if (firstValue) {
        const textNode = [...el.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE,
        );
        if (textNode) {
          textNode.textContent = " " + firstValue;
        }
      }
    } else if (typeof submenuObj === "string") {
      el.textContent = submenuObj;
    } else {
      console.warn("Missing translation:", { category, key });
    }
  });
  document.querySelectorAll(".menu-content").forEach((menu) => {
    const id = menu.id.replace("menu-", "");
    const splitMenu = menu.closest(".split-menu");
    const dropdown = splitMenu?.closest(".dropdown");
    const category = [...dropdown.classList].find((c) => c !== "dropdown");
    const submenuObj = navDict?.submenu?.[category]?.[id];
    if (!submenuObj) return;
    const links = menu.querySelectorAll("a");
    links.forEach((link, index) => {
      const values = Object.values(submenuObj);
      if (values[index]) {
        const textNode = [...link.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE,
        );
        if (textNode && values[index]) {
          textNode.textContent = " " + values[index];
        }
      }
    });
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
  // 🆕 NEWSLETTER LIST (DACA VREI)
  const newsletterList = document.getElementById("newsletter-list");
  if (newsletterList && communityDict.newsletter?.items) {
    newsletterList.innerHTML = communityDict.newsletter.items
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
  // 🆕 CETATENI ONOARE LIST
  const onoareList = document.getElementById("onoare-list");
  if (onoareList && communityDict.cetateni_onoare?.items) {
    onoareList.innerHTML = communityDict.cetateni_onoare.items
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
  // 🆕 BUGETARE PARTICIPATIVA LIST
  const bugetareParticipativa = document.getElementById(
    "bugetare_participativa-list",
  );
  if (bugetareParticipativa && communityDict.bugetare_participativa?.steps) {
    bugetareParticipativa.innerHTML = communityDict.bugetare_participativa.steps
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
  // 🆕 PROCEDURI ONLINE LIST
  const proceduriOnline = document.getElementById("proceduri_online-list");
  if (proceduriOnline && communityDict.proceduri_online?.items) {
    proceduriOnline.innerHTML = communityDict.proceduri_online.items
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
    initMenuSystem();
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
// ===== CONSILIERI RENDER =====
async function loadConsilieri() {
  try {
    const res = await fetch("assets/data/consilieri.json"); // adjust path if needed
    const consilieri = await res.json();
    const container = document.getElementById("consilieri-container");
    if (!container) return;
    container.innerHTML = "";
    consilieri.forEach((c) => {
      const card = document.createElement("div");
      card.className = "card consilier-card";
      card.innerHTML = `
        <h5><i class="fa-solid fa-user"></i> ${c.name}</h5>
        <p><strong>Partid:</strong> ${c.partid}</p>
        <p><strong>Mandat:</strong> ${c.mandat}</p>
        <p><i class="fa-solid fa-phone"></i> ${c.tel}</p>
        <p><i class="fa-solid fa-envelope"></i> ${c.email}</p>
        <a href="${c.avere}" target="_blank" class="btn-link">
          📄 Declarația de avere
        </a>
        <a href="${c.interese}" target="_blank" class="btn-link">
          📄 Declarația de interese
        </a>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    console.error("Error loading consilieri:", err);
  }
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
  await new Promise((r) => requestAnimationFrame(r));
  cacheDOM();
  initMenuSystem();
  await loadNavLang(currentLang);
  await loadCommunityLang(currentLang);
  loadConsilieri();
  updateSections();
  initSearch();
  initThemeToggle();
  initLanguageToggle();
  initBackToTop();
}
initApp();
