console.log("Menu working ✅");
// ===== GLOBAL SELECTORS =====
let nav, toggle;

// const nav = document.querySelector("nav");
// const toggle = document.querySelector(".menu-toggle");
const items = document.querySelectorAll(".menu-left li");
const contents = document.querySelectorAll(".menu-content");
const searchInput = document.getElementById("search-input");
let allSections = [];
// const allSections = document.querySelectorAll("body > section");
function cacheDOM() {
  nav = document.querySelector("nav");
  toggle = document.querySelector(".menu-toggle");
}
// ===== MOBILE SPLIT MENU =====
function handleMobileMenuClick(item) {
  const targetId = item.dataset.target;
  const menu = item.closest(".split-menu");
  const rightSide = menu.querySelector(".menu-right");
  // Hide all
  rightSide
    .querySelectorAll(".menu-content")
    .forEach((c) => c.classList.remove("active"));
  // Show selected
  const activeContent = rightSide.querySelector(`#${targetId}`);
  if (activeContent) activeContent.classList.add("active");
  rightSide.classList.add("active");
  addBackButton(rightSide);
}
function addBackButton(rightSide) {
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
}
// ===== DESKTOP HOVER =====
function handleDesktopHover(item) {
  if (window.innerWidth <= 900) return;
  const menu = item.closest(".split-menu");
  const rightSide = menu.querySelector(".menu-right");
  const targetId = item.dataset.target;
  items.forEach((i) => i.classList.remove("active"));
  contents.forEach((c) => c.classList.remove("active"));
  item.classList.add("active");
  const targetContent = rightSide.querySelector(`#${targetId}`);
  if (targetContent) targetContent.classList.add("active");
}
// ===== NAV TOGGLE =====
function toggleNav() {
  nav.classList.toggle("active");
  document.body.classList.toggle("nav-open");
}
// ===== DROPDOWN (MOBILE) =====
function handleDropdownClick(e) {
  if (window.innerWidth > 900) return;
  e.preventDefault();
  e.stopPropagation();
  const parent = this.parentElement;
  document.querySelectorAll(".dropdown").forEach((d) => {
    if (d !== parent) d.classList.remove("active");
  });
  parent.classList.toggle("active");
}
// ===== SUBMENU =====
function handleSubmenuClick(e) {
  if (window.innerWidth > 900) return;
  const parent = this.parentElement;
  const submenu = parent.querySelector(".dropdown-submenu");
  if (!submenu) return;
  e.preventDefault();
  e.stopPropagation();
  parent.parentElement.querySelectorAll("li").forEach((li) => {
    if (li !== parent) li.classList.remove("submenu-active");
  });
  parent.classList.toggle("submenu-active");
}
// ===== CLICK OUTSIDE =====
function handleOutsideClick(e) {
  if (!nav.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
    nav.classList.remove("active");
    document.body.classList.remove("nav-open");
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
}
// =====  SCROLL BEHAVIOR (side-by-side feel) =====
function handleScroll() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}
// ===== RESIZE FIX =====
function handleResize() {
  if (window.innerWidth > 900) {
    nav.classList.remove("active");
    document
      .querySelectorAll(".menu-right")
      .forEach((r) => r.classList.remove("active"));
  }
}
// ===== SEARCH =====
function handleSearchInput() {
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
}
// ===== SCROLL TO RESULT =====
function handleSearchScroll() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) return;
  const firstMatch = Array.from(allSections).find((section) =>
    section.innerText.toLowerCase().includes(query),
  );
  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
// ===== HIGHLIGHT =====
function highlightText(element, query) {
  const regex = new RegExp(`(${query})`, "gi");
  element.querySelectorAll("*").forEach((node) => {
    if (node.children.length === 0) {
      node.innerHTML = node.innerHTML.replace(regex, `<mark>$1</mark>`);
    }
  });
}
function removeHighlights(element) {
  const marks = element.querySelectorAll("mark");
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}
function createConsilierCard(c) {
  return `
    <div class="consilier-card">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${c.name}</h5>
          <p class="card-text"><strong>Partid:</strong> ${c.partid}</p>
          <p class="card-text"><strong>Mandat:</strong> ${c.mandat}</p>
          <div class="card-contact-info">
            <h5>Date de contact:</h5>
            <p class="card-tel">
              <strong>Tel:</strong>
              <a href="tel:${c.tel}">
                <i class="fa-solid fa-phone"></i> ${c.tel}
              </a>
            </p>
            <p class="card-email">
              <strong>Email:</strong>
              <a href="mailto:${c.email}">
                <i class="fa-solid fa-envelope"></i> ${c.email}
              </a>
            </p>
          </div>
          <a href="${c.declaratie}" class="btn" target="_blank">
            📄 Declarație de avere
          </a>
        </div>
      </div>
    </div>
  `;
}
async function loadConsilieri() {
  const container = document.getElementById("consilieri-container");
  if (!container) {
    console.error("Container #consilieri-container not found");
    return;
  }
  try {
    const response = await fetch("assets/data/consilieri.json");
    const data = await response.json();
    container.innerHTML = data.map((c) => createConsilierCard(c)).join("");
  } catch (error) {
    console.error("Eroare la încărcarea consilierilor:", error);
    container.innerHTML = "<p>Nu s-au putut încărca consilierii.</p>";
  }
}
// ===== INIT EVENTS =====
function initMenu() {
  items.forEach((item) => {
    item.addEventListener("click", () => handleMobileMenuClick(item));
    item.addEventListener("mouseenter", () => handleDesktopHover(item));
  });
}
function initDropdowns() {
  document.querySelectorAll(".dropdown > a").forEach((link) => {
    link.addEventListener("click", handleDropdownClick);
  });
  document.querySelectorAll(".dropdown-menu > li > a").forEach((link) => {
    link.addEventListener("click", handleSubmenuClick);
  });
}
function initSearch() {
  if (!searchInput) return;
  searchInput.addEventListener("input", () => {
    updateSections();
    handleSearchInput();
  });
  searchInput.addEventListener("change", handleSearchScroll);
}
function initGlobalEvents() {
  if (toggle) toggle.addEventListener("click", toggleNav);
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        nav.classList.remove("active");
        // also reset menus (important)
        document
          .querySelectorAll(".dropdown")
          .forEach((d) => d.classList.remove("active"));
        document
          .querySelectorAll(".menu-right")
          .forEach((r) => r.classList.remove("active"));
      }
    });
  });
  window.addEventListener("scroll", handleScroll);
  document.addEventListener("click", handleOutsideClick);
  window.addEventListener("resize", handleResize);
}
// ===== UPDATE SECTIONS =====
function updateSections() {
  allSections = document.querySelectorAll("section");
}
// ===== COMPONENT LOADER =====
async function loadComponent(containerId, filePath) {
  try {
    const res = await fetch(filePath);
    if (!res.ok) throw new Error(`Failed to load ${filePath}`);
    const html = await res.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (err) {
    console.error(`Error loading component ${filePath}:`, err);
  }
}
// ===== LOAD ALL COMPONENTS =====
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
// ===== RUN APP =====
async function initApp() {
  await loadAllComponents();
  // document.getElementById(containerId).innerHTML = "<p>Se încarcă...</p>";
  cacheDOM();
  updateSections();
  initMenu();
  initDropdowns();
  initSearch();
  initGlobalEvents();
  loadConsilieri();
}
initApp();
