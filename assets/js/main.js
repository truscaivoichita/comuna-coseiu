console.log("Menu working ✅");

// ===== GLOBAL SELECTORS =====
const nav = document.querySelector("nav");
const toggle = document.querySelector(".menu-toggle");
const items = document.querySelectorAll(".menu-left li");
const contents = document.querySelectorAll(".menu-content");
const searchInput = document.getElementById("search-input");
const allSections = document.querySelectorAll("body > section");

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
  element.innerHTML = element.innerHTML.replace(regex, `<mark>$1</mark>`);
}

function removeHighlights(element) {
  const marks = element.querySelectorAll("mark");

  marks.forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
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

  searchInput.addEventListener("input", handleSearchInput);
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

// ===== RUN APP =====
function initApp() {
  initMenu();
  initDropdowns();
  initSearch();
  initGlobalEvents();
}

initApp();
