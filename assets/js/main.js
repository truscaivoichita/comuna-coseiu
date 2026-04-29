console.log("Menu working ✅");
let currentLang = localStorage.getItem("lang") || "ro";
let communityDict = {};
let navDict = {};
let nav, toggle;
let allSections = [];
let searchInput;
function cacheDOM() {
  nav = document.querySelector("nav");
  toggle = document.querySelector(".menu-toggle");
  searchInput = document.getElementById("search-input");
}
function initMenu() {
  document.querySelectorAll(".menu-left").forEach((menuLeft) => {
    menuLeft.replaceWith(menuLeft.cloneNode(true));
  });
  document.querySelectorAll(".menu-left").forEach((menuLeft) => {
    menuLeft.addEventListener("click", (e) => {
      const item = e.target.closest("li");
      if (!item) return;
      if (window.innerWidth <= 900) {
        handleMobileMenu(item);
      } else {
        handleDesktopMenu(item);
      }
    });
  });
}
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
    rightSide.classList.add("active");
  }
}
function initNavToggle() {
  if (!toggle) return;
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
function initOutsideClick() {
  if (!nav) return;
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
    if (
      (lastWidth <= 900 && currentWidth > 900) ||
      (lastWidth > 900 && currentWidth <= 900)
    ) {
      initMenu();
    }
    if (currentWidth > 900) {
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
    if (document.documentElement.scrollTop > 200) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
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
    // 🔥 TITLE (meniul din stânga)
    let icon = submenuObj.icon
      ? `<i class="fa-solid ${submenuObj.icon}"></i>`
      : "";
    el.dataset.icon = icon;
    if (!icon) {
      icon = el.querySelector("i")?.outerHTML || "";
      el.dataset.icon = icon; // cache it
    }
    if (submenuObj?.title) {
      if (!icon) {
        icon = el.querySelector("i")?.outerHTML || "";
        el.dataset.icon = icon;
      }
      el.innerHTML = `${icon} ${submenuObj.title}`;
    }
  });
  // 🔥 RIGHT SIDE (linkuri)
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
async function loadCommunityLang(lang) {
  try {
    const res = await fetch(`assets/i18n/${lang}/comunitate.json`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
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
  const newsletterList = document.getElementById("newsletter-list");
  if (newsletterList && communityDict.newsletter?.items) {
    newsletterList.innerHTML = communityDict.newsletter.items
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
  const onoareList = document.getElementById("onoare-list");
  if (onoareList && communityDict.cetateni_onoare?.items) {
    onoareList.innerHTML = communityDict.cetateni_onoare.items
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
  const bugetareParticipativa = document.getElementById(
    "bugetare_participativa-list",
  );
  if (bugetareParticipativa && communityDict.bugetare_participativa?.steps) {
    bugetareParticipativa.innerHTML = communityDict.bugetare_participativa.steps
      .map((i) => `<li>${i}</li>`)
      .join("");
  }
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
  btn.textContent = currentLang.toUpperCase();
  btn.addEventListener("click", async () => {
    currentLang = currentLang === "ro" ? "hu" : "ro";
    localStorage.setItem("lang", currentLang);
    btn.textContent = currentLang.toUpperCase();
    await loadNavLang(currentLang);
    await loadCommunityLang(currentLang);
  });
}
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
  // Load saved theme
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
  }
  // Set initial icon
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
async function initApp() {
  await loadAllComponents();
  await new Promise((r) =>
    requestAnimationFrame(() => {
      requestAnimationFrame(r);
    }),
  );
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
