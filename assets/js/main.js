console.log("Menu working ✅");
let currentLang = localStorage.getItem("lang") || "ro";
let navDict = {};
let homeDict = {};
let comunitateDict = {};
let locuireDict = {};
let administratieDict = {};
let mediuDict = {};
let mobilitateDict = {};
let economieDict = {};
let monitorDict = {};
let footerDict = {};
let menuData = [];
let nav, toggle;
let allSections = [];
let searchInput;
const loaders = {
  administratie: {
    file: "administratie.json",
    containerId: "administratie-container",
    dictSetter: (data) => (administratieDict = data.administratie || {}),
    render: (data) => renderAdministratie(data.administratie || data),
  },
  comunitate: {
    file: "comunitate.json",
    containerId: "comunitate-container",
    dictSetter: (data) => (comunitateDict = data),
    render: renderCommunitate,
  },
  locuire: {
    file: "locuire.json",
    containerId: "locuire-container",
    dictSetter: (data) => (locuireDict = data),
    render: renderLocuire,
  },
  mediu: {
    file: "mediu.json",
    containerId: "mediu-container",
    dictSetter: (data) => (mediuDict = data.mediu || data),
    render: (data) => renderMediu(data.mediu || data),
  },
  mobilitate: {
    file: "mobilitate.json",
    containerId: "mobilitate-container",
    dictSetter: (data) => (mobilitateDict = data.mobilitate || data),
    render: renderMobilitate,
  },
  economie: {
    file: "economie.json",
    containerId: "economie-container",
    dictSetter: (data) => (economieDict = data.economie || data),
    render: renderEconomie,
  },
  monitor: {
    file: "monitor.json",
    containerId: "monitor-container",
    dictSetter: (data) => (monitorDict = data.monitor || data),
    render: renderMonitor,
  },
  footer: {
    file: "footer.json",
    containerId: "footer-container",
    dictSetter: (data) => (footerDict = data.footer || data),
    render: (data) => renderFooter(data.footer || data),
  },
};
function cacheDOM() {
  nav = document.querySelector("nav");
  toggle = document.querySelector(".menu-toggle");
  searchInput = document.getElementById("search-input");
}
function clearActiveMenuItems(container) {
  container
    .querySelectorAll(".menu-left li.active")
    .forEach((li) => li.classList.remove("active"));
}
function resetAllMenus() {
  document
    .querySelectorAll(".menu-right.active")
    .forEach((m) => m.classList.remove("active"));
  document
    .querySelectorAll(".menu-content.active")
    .forEach((m) => m.classList.remove("active"));
  document
    .querySelectorAll(".dropdown.active")
    .forEach((d) => d.classList.remove("active"));
  document
    .querySelectorAll(".menu-left li.active")
    .forEach((li) => li.classList.remove("active"));
}
function initMenuDelegation() {
  document.addEventListener("click", (e) => {
    const item = e.target.closest("li[data-target]");
    if (item) {
      e.stopPropagation();
      if (window.innerWidth <= 900) {
        handleMobileMenu(item);
      } else {
        handleDesktopMenu(item);
      }
      return;
    }
    if (!e.target.closest("nav") && !e.target.closest(".menu-toggle")) {
      nav?.classList.remove("active");
      document.body.classList.remove("nav-open");
      document
        .querySelectorAll(".dropdown.active")
        .forEach((d) => d.classList.remove("active"));
      document
        .querySelectorAll(".menu-right.active")
        .forEach((r) => r.classList.remove("active"));
      clearActiveMenuItems(nav);
    }
  });
}
function handleMobileMenu(item) {
  const targetId = item.dataset.target;
  const menu = item.closest(".split-menu");
  if (!menu) return;
  const rightSide = menu.querySelector(".menu-right");
  if (!rightSide) return;
  // ONLY reset inside current menu
  menu.querySelectorAll(".menu-left li.active").forEach((li) => {
    li.classList.remove("active");
  });
  rightSide
    .querySelectorAll(".menu-content.active")
    .forEach((c) => c.classList.remove("active"));
  // activate clicked item
  item.classList.add("active");
  const active = rightSide.querySelector(`#${targetId}`);
  if (active) {
    active.classList.add("active");
  }
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
  clearActiveMenuItems(menu);
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
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 900 && nav) {
      nav.classList.remove("active");
      document.body.classList.remove("nav-open");
    }
    resetAllMenus();
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
let menuInitialized = false;
function initMenuSystem() {
  if (menuInitialized) return;
  menuInitialized = true;
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
    const item = el; // FIXED
    const target = item.dataset.target;
    if (!target) {
      console.warn("Missing data-target:", item);
      return;
    }
    const splitMenu = item.closest(".split-menu");
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
    if (!icon) {
      icon = item.querySelector("i")?.outerHTML || "";
    }
    item.innerHTML = `${icon} ${submenuObj.title || ""}`;
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
async function loadHeader(lang) {
  try {
    const res = await fetch(`assets/i18n/${lang}/header.json`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    const data = await res.json();
    console.log("Header JSON ✅", data);
    menuData = Array.isArray(data) ? data : data.menu || [];
    renderMenu();
    applyNavLang();
    return data;
  } catch (err) {
    console.error("Failed to load header.json:", err);
  }
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
function renderMenu() {
  const menu = document.getElementById("main-menu");
  if (!menu || !menuData.length) return;
  menu.innerHTML = menuData
    .map(
      (item) => `
    <li class="dropdown ${item.id}">
      <a href="#${item.id}">
        <i class="fa-solid ${item.icon}"></i>
        ${item.title}
      </a>
      <div class="dropdown-menu split-menu">
      <div class="menu-left">
        <ul>
          ${item.sections
            .map(
              (section, i) => `
              <li data-target="menu-${item.id}-${i}"
                  class="${i === 0 ? "active" : ""}">
                <i class="fa-solid ${section.icon}"></i>
                ${section.title}
              </li>
          `,
            )
            .join("")}
        </ul>
      </div>
        <div class="menu-right">
          ${item.sections
            .map(
              (section, i) => `
              <div class="menu-content ${i === 0 ? "active" : ""}"
                  id="menu-${item.id}-${i}">
                ${section.links
                  .map(
                    ([text, href, icon]) => `
                    <a href="${href}">
                      <i class="fa-solid ${icon}"></i>
                      ${text}
                    </a>
                  `,
                  )
                  .join("")}

              </div>
          `,
            )
            .join("")}
        </div>

      </div>
    </li>
  `,
    )
    .join("");
}
function renderHome() {
  if (!homeDict?.home) return;
  const data = homeDict.home;
  const container = document.getElementById("home-container");
  if (!container) return;
  container.innerHTML = `<section id="home" class="hero"><div class="hero-content"><h1><i class="fa-solid ${data.icon}"></i> ${data.title}</h1><p>${data.subtitle}</p><div class="hero-buttons">${Object.values(
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
        `<div class="quick-card"><h3><i class="fa-solid ${card.icon}"></i> ${card.title}</h3><p>${card.description}${card.links.map((l) => `<div><a href="${l.href}" class="btn-link btn-section">${l.label}</a></div>`).join(" ")}</p></div>`,
    )
    .join(
      "",
    )}</section><section class="news"><h2><i class="fa-solid ${data.news.icon}"></i> ${data.news.title}</h2><div class="news-list">${data.news.items.map((n) => `<article class="news-item"><h4><i class="fa-solid ${n.icon}"></i> ${n.title}</h4><p>${n.description}</p></article>`).join("")}</div></section></section>`;
}
function renderAdministratie(a) {
  // const a = data.administratie;
  // console.log("Administratie data:", data);
  return `
<section id="${a.id}">
  <h2><i class="fa-solid ${a.icon}"></i> ${a.title}</h2>
  <div>
    <h3>🏢 ${a.primarie.title}</h3>
    ${renderPersonFull(a.primarie.primar, a.labels)}
    ${renderPersonFull(a.primarie.viceprimar, a.labels)}
    ${renderPersonFull(a.primarie.secretar, a.labels)}
    ${renderOrganigramaFull(a.organigrama, a.labels)}
    ${renderRegulament(a.regulament)}
    ${renderSediuFull(a.sediu)}
  </div>
 ${renderConsiliuFull(a.consiliu_local, a.labels)}
  ${renderEvidentaFull(a.evidenta_persoanelor)}
  ${renderPolitiaFull(a.politia_locala)}
  ${renderInformatiiFull(a.informatii_publice)}
  ${renderAlteleFull(a.altele)}
</section>
  `;
}
function renderPersonFull(p, labels) {
  if (!p) return "";
  const contact = labels?.contact || {};
  const buttons = labels?.buttons || {};
  return `
<div id="${p.id}" class="card profile-card">
  <img src="${p.imagine}" alt="${p.alt}" class="profile-img" loading="lazy"/>
  <h4>
    <i class="fa-solid ${p.icon || "fa-user"}"></i> ${p.functie || ""}
  </h4>
  <div class="card">
    <h5>${contact.title || ""}</h5>
    <p>
      <i class="fa-solid fa-user"></i>
      <strong>${contact.name || "Nume"}:</strong> ${p.nume || ""}
    </p>
    <p>
      <i class="fa-solid fa-envelope"></i>
      <strong>${contact.email || "Email"}:</strong> ${p.contact?.email || ""}
    </p>
    <p>
      <i class="fa-solid fa-phone"></i>
      <strong>${contact.phone || "Telefon"}:</strong> ${p.contact?.telefon || ""}
    </p>
    <p>
      <i class="fa-solid fa-clock"></i>
      <strong>${contact.schedule || "Program"}:</strong>
    </p>
    <ul>
      ${(p.contact?.program || []).map((x) => `<li>${x}</li>`).join("")}
    </ul>
    ${
      p.declaratii
        ? `
      <a href="${p.declaratii.avere}" target="_blank">
        📄 ${labels?.buttons?.avere || "Declarația de avere"}
      </a>
      <a href="${p.declaratii.interese}" target="_blank">
        📄 ${labels?.buttons?.interese || "Declarația de interese"}
      </a>
    `
        : ""
    }
  </div>
  <div class="card">
    <h4><i class="fa-solid fa-list"></i> ${p.atributii.title || "Atribuții"}</h4>
    <p>${p.descriere || ""}</p>
    <ul class="atributii">
      ${(p.atributii.items || []).map((i) => `<li>${i}</li>`).join("")}
    </ul>
  </div>
</div>`;
}
function renderOrganigramaFull(o, labels = {}) {
  const buttons = labels?.buttons ?? {};
  const contact = labels?.contact ?? {};
  return `
<div id="${o.id}" class="card profile-card">
  <h4>🧭 ${o.title}</h4>
  <!-- Conducere -->
  <div class="card" id="${o.conducere.id}">
    <h5>
      <i class="fa-solid fa-users"></i> 
      ${o.conducere.title || "Conducerea administrației"}
    </h5>
    <ul class="clean-list">
      ${o.conducere.items
        .map(
          (p) => `
        <li>
          <strong>${p.functie}</strong> - ${p.nume}
          ${
            p.declaratii
              ? `
            <div class="links">
              <a href="${p.declaratii.avere}" target="_blank">
                📄 ${buttons.avere}
              </a>
              <a href="${p.declaratii.interese}" target="_blank">
                📄 ${buttons.interese}
              </a>
            </div>
          `
              : ""
          }
        </li>
      `,
        )
        .join("")}
    </ul>
  </div>

  <!-- Compartimente -->
  <div class="card" id="${o.compartimente.id}">
    <h5>
      <i class="fa-solid ${o.compartimente.icon || "fa-building"}"></i>
      ${o.compartimente.title.toUpperCase()}
    </h5>

    <div class="cards grid">
      ${o.compartimente.items
        .map((entry) => {
          const comp = Object.values(entry)[0];
          return `
          <div class="card">
            <h5>
              <i class="fa-solid ${comp.icon || "fa-building"}"></i> 
              ${comp.title}
            </h5>
            <ul class="clean-list">
              ${(comp.items || [])
                .map((item) => {
                  if (typeof item === "string") {
                    return `<li><i class="fa-solid fa-user"></i> ${item}</li>`;
                  }
                  return `
                    <li>
                      <i class="fa-solid ${item.icon || "fa-user"}"></i>
                      ${item.nume} - ${item.functie || ""}
                      ${
                        item.declaratii
                          ? `
                        <div class="links">
                          <a href="${item.declaratii.avere}" target="_blank">
                            📄 ${buttons.avere}
                          </a>
                          <a href="${item.declaratii.interese}" target="_blank">
                            📄 ${buttons.interese}
                          </a>
                        </div>
                      `
                          : ""
                      }
                    </li>
                  `;
                })
                .join("")}
            </ul>
          </div>
        `;
        })
        .join("")}
    </div>
  </div>
</div>
  `;
}
function renderRegulament(r) {
  return `
<div id="${r.id}" class="card profile-card">
  <h4><i class="fa-solid fa-user"></i> ${r.title}</h4>
  <p>
    <a href="${r.link}" class="btn btn-section">
      ${r.descriere}
    </a>
  </p>
</div>
  `;
}
function renderSediuFull(s) {
  return `
<div id="${s.id}">
  <h3><i class="fa ${s.icon}"></i> ${s.title}</h3>
  <ul>
    <li><i class="fa ${s.adresa_icon}"></i> ${s.adresa}</li>
    <li><i class="fa ${s.email_icon}"></i> ${s.email}</li>
    <li><i class="fa ${s.telefon_icon}"></i> ${s.telefon}</li>
  </ul>
</div>
  `;
}
function renderConsilieri(consilieri, labels = {}) {
  const buttons = labels?.buttons ?? {};
  const contact = labels?.contact ?? {};
  if (!consilieri || !Array.isArray(consilieri)) return "";
  return `
    <div class="consilieri-row">
      ${consilieri
        .map(
          (c) => `
        <div class="card consilier-card">
          <h5><i class="fa-solid fa-user"></i> ${c.name}</h5>
          <p>
            <strong>${contact.partid || "Partid"}:</strong> ${c.partid}
          </p>
          <p>
            <strong>${contact.mandat || "Mandat"}:</strong> ${c.mandat}
          </p>
          <p>
            <i class="fa-solid fa-phone"></i>
            <strong>${contact.phone || "Telefon"}:</strong> ${c.tel}
          </p>
          <p>
            <i class="fa-solid fa-envelope"></i>
            <strong>${contact.email || "Email"}:</strong> ${c.email}
          </p>
          <a href="${c.avere}" target="_blank" class="btn-link btn-section">
            <i class="fa-solid fa-file-lines"></i>
            ${buttons.avere || "Declarația de avere"}
          </a>
          <a href="${c.interese}" target="_blank" class="btn-link btn-section">
            <i class="fa-solid fa-file-lines"></i>
            ${buttons.interese || "Declarația de interese"}
          </a>
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}
function renderConsiliuFull(c, labels = {}) {
  return `
<div id="${c.id}">
  <h3>🗳️ ${c.title}</h3>
  <p>${c.descriere}</p>

  <div id="${c.consilieri.id}">
    <h4>
      <i class="fa-solid fa-landmark"></i>
      ${labels?.consilieri?.title || "Consilieri"}
    </h4>

    ${renderConsilieri(c.consilieri.items || [], labels)}
  </div>

  <div id="${c.comisii.id}" class="card cards grid">
    <h4>${c.comisii.title}</h4>
    <p>${c.comisii.comisii_descriere1}</p>
    <ul>
      ${c.comisii.items.map((i) => `<li>${i}</li>`).join("")}
    </ul>
    <p>${c.comisii.comisii_descriere2}</p>
  </div>

  <div id="${c.sedinte.id}" class="card cards grid">
    <h4><i class="fa fa-calendar"></i> ${c.sedinte.title}</h4>
    <p>${c.sedinte.descriere1}</p>
    <p>${c.sedinte.descriere2}</p>

    <h5>
      <i class="fa ${c.sedinte.urmatoare.icon}"></i>
      ${c.sedinte.urmatoare.title}
    </h5>

    <ul>
      <li>${c.sedinte.urmatoare.data_label}: ${c.sedinte.urmatoare.data}</li>
      <li>${c.sedinte.urmatoare.ora_label}: ${c.sedinte.urmatoare.ora}</li>
      <li>${c.sedinte.urmatoare.locatie_label}: ${c.sedinte.urmatoare.locatie}</li>
    </ul>

    <h5>
      <i class="fa ${c.sedinte.ordine_de_zi.icon}"></i>
      ${c.sedinte.ordine_de_zi.title}
    </h5>

    <ul>
      ${c.sedinte.ordine_de_zi.items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </div>

  <div id="${c.hotarari.id}" class="card cards grid">
    <h4><i class="fa-solid fa-scroll"></i> ${c.hotarari.title}</h4>
    <p>${c.hotarari.descriere}</p>

    <ul>
      ${c.hotarari.items
        .map(
          (item) => `
        <li><a href="${item.link}">${item.titlu}</a></li>
      `,
        )
        .join("")}
    </ul>
  </div>
</div>
  `;
}
function renderEvidentaFull(e) {
  return `
<div id="${e.id}" class="cards grid">
  <h3>
    <i class="fa-solid ${e.icon}"></i> ${e.title}
  </h3>
  <div>
    <p>${e.descriere[0]}</p>
    <p>${e.descriere[1]}</p>
  </div>
  ${e.servicii
    .map(
      (s) => `
    <div id="${s.id}">
      <h4>
        <i class="fa-solid ${s.icon}"></i> ${s.title}
      </h4>
      <p>${s.descriere}</p>
    </div>
  `,
    )
    .join("")}
</div>
  `;
}
function renderPolitiaFull(p) {
  return `
    <div id="${p.id}" class="cards grid">
      <h3>
        <i class="fa-solid ${p.icon}"></i> ${p.title}
      </h3>
      <!-- Descriere -->
      <div>
        <h4>
          <i class="fa-solid fa-info-circle"></i> ${p.title}
        </h4>
        ${p.descriere.map((d) => `<p>${d}</p>`).join("")}
      </div>
      <!-- Servicii -->
      ${p.servicii
        .map(
          (serviciu) => `
        <div id="${serviciu.id}">
          <h4>
            <i class="fa-solid ${serviciu.icon}"></i> ${serviciu.title}
          </h4>
          <p>${serviciu.descriere}</p>
        </div>
      `,
        )
        .join("")}

    </div>
  `;
}
function renderInformatiiFull(i) {
  return `
    <div id="informatii" class="cards grid">
      <h3>
        <i class="fa-solid ${i.icon}"></i> ${i.title}
      </h3>
      ${i.servicii
        .map(
          (serviciu) => `
        <div id="${serviciu.id}">
          <h4>
            <i class="fa-solid ${serviciu.icon}"></i> ${serviciu.title}
          </h4>
          ${serviciu.descriere ? `<p>${serviciu.descriere}</p>` : ""}
          ${
            serviciu.lista
              ? `
            <ul>
              ${serviciu.lista
                .map(
                  (item) => `
                <li>
                  <a href="${item.link}" target="_blank">
                    <i class="fa-solid ${item.icon}"></i> ${item.text}
                  </a>
                </li>
              `,
                )
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}
function renderAlteleFull(a) {
  if (!a) {
    console.error("Altele data is undefined");
    return "<p>Data not available</p>";
  }
  return `
    <div id="${a.id}" class="cards grid">
      <h3>
        <i class="fa-solid ${a.icon}"></i> ${a.title}
      </h3>
      ${(a.servicii || [])
        .map(
          (serviciu) => `
        <div id="${serviciu.id}">
          <h4>
            <i class="fa-solid ${serviciu.icon}"></i> ${serviciu.title}
          </h4>
          ${serviciu.descriere ? `<p>${serviciu.descriere}</p>` : ""}
          ${
            serviciu.lista
              ? `
            <ul>
              ${serviciu.lista
                .map(
                  (item) => `
                <li>
                  <a href="${item.link}" target="_blank">
                    <i class="fa-solid ${item.icon}"></i> ${item.text}
                  </a>
                </li>
              `,
                )
                .join("")}
            </ul>
          `
              : ""
          }
        </div>
      `,
        )
        .join("")}
    </div>
  `;
}
function renderList(items = []) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}
function renderCard(title, text, icon, id) {
  return `
    <div id="${id}" class="card">
      <h4><i class="fa-solid ${icon || ""}"></i> ${title}</h4>
      ${text ? `<p>${text}</p>` : ""}
    </div>
  `;
}
function renderCetateni(c) {
  return `
  <div id="${c.id}" class="cards grid">
    <h3><i class="fa-solid ${c.icon}"></i> ${c.title}</h3>
    <p>${c.description}</p>
    <div class="componenta">
      <div class="etnic">
        <h4>${c.etnic.title}</h4>
        ${renderList(c.etnic.items)}
      </div>
      <div class="religie">
        <h4>${c.religie.title}</h4>
        ${renderList(c.religie.items)}
      </div>
    </div>
  </div>
  `;
}
function renderDezbateri(d) {
  if (!d) {
    console.error("dezbateri_publice is missing");
    return "";
  }
  return `
  <div id="${d.id}" class="cards grid">
    <h3><i class="fa-solid ${d.icon}"></i> ${d.title}</h3>
    ${renderNewsletter(d.newsletter)}
    ${renderCetateniOnoare(d.cetateni_onoare)}
    ${renderSugestii(d.sugestii_reclamatii)}
    ${renderBugetare(d.bugetare_participativa)}
    ${renderProceduri(d.proceduri_online)}
    ${renderWebcam(d.live_webcam)}
  </div>
  `;
}
function renderNewsletter(n) {
  return `
    <div id="${n.id}">
      <h4><i class="fa-solid ${n.icon}"></i> ${n.title}</h4>
      <p>${n.description}</p>
      ${renderList(n.items)}
      <p>${n.gdpr}</p>
      <form>
        <input type="email" placeholder="${n.placeholder_email}" required />
        <button>${n.button}</button>
      </form>
    </div>
  `;
}
function renderCetateniOnoare(c) {
  return `
  <div id="${c.id}">
      <h4><i class="fa-solid ${c.icon}"></i> ${c.title}</h4>
      <p>${c.description}</p>
     ${renderList(c.items)}
      <p>${c.note}</p>
    </div>
  `;
}
function renderSugestii(s) {
  return `
  <div id="${s.id}">
      <h4><i class="fa-solid ${s.icon}"></i> ${s.title}</h4>
      <p>${s.description}</p>
        <form>
          <input type="text" placeholder="${s.placeholders.name}" required />
          <input type="email" placeholder="${s.placeholders.email}" required />
          <textarea rows="5" required placeholder="${s.placeholders.message}"/></textarea>
          <button type="submit">${s.button}</button>
        </form>
      <p>${s.note}</p>
    </div>
  `;
}
function renderBugetare(b) {
  return `
  <div id="${b.id}">
      <h4><i class="fa-solid ${b.icon}"></i> ${b.title}</h4>
      <p>${b.description}</p>
      <h5>${b.steps_title}</h5>
    ${renderList(b.steps)}
      <p>${b.note}</p>
    </div>
  `;
}
function renderProceduri(p) {
  return `
    <div id="${p.id}">
      <h4><i class="fa-solid ${p.icon}"></i> ${p.title}</h4>
      <p>${p.description}</p>
      ${renderList(p.items)}
      <p>${p.note}</p>
    </div>
  `;
}
function renderWebcam(w) {
  return `
  <div id="${w.id}">
      <h4><i class="fa-solid ${w.icon}"></i> ${w.title}</h4>
      <p>${w.description}</p>
      <div class="card">
        <h5>${w.card_title}</h5>
        <p>${w.card_description}</p>
        <img src="http://IP-UL-TAU:PORT/video.cgi" alt="webcam" />
      </div>
      <p>${w.note}</p>
    </div>
  `;
}
function renderSimpleSection(section) {
  const entries = Object.values(section).filter(
    (v) => typeof v === "object" && v.title && v.id,
  );
  return `
  <div id="${section.id}" class="cards grid">
    <h3><i class="fa-solid ${section.icon}"></i> ${section.title}</h3>
    ${section.description ? `<p>${section.description}</p>` : ""}
    ${entries
      .map(
        (e) => `
      <div id="${e.id}" class="card">
        <h4><i class="fa-solid ${e.icon}"></i> ${e.title}</h4>
        ${e.text ? `<p>${e.text}</p>` : ""}
        ${
          e.link
            ? `
          <a href="${e.link}" target="_blank" class="btn-link">
            ${e.link_text || "Detalii"}
          </a>
        `
            : ""
        }
        ${e.items ? renderList(e.items) : ""}
      </div>
    `,
      )
      .join("")}
  </div>
  `;
}
function renderCommunitate(data) {
  return `
  <section id="${data.id}">
    <h2><i class="fa-solid ${data.icon}"></i> ${data.title}</h2>
    ${renderCetateni(data.cetateni)}
    ${renderDezbateri(data.dezbateri_publice)}
    ${renderSimpleSection(data.educatie)}
    ${renderSimpleSection(data.cultura)}
    ${renderSimpleSection(data.sport)}
    ${renderSimpleSection(data.sanatate)}
    ${renderSimpleSection(data.social)}
    ${renderSimpleSection(data.animale)}
    ${renderSimpleSection(data.turism)}
    ${renderSimpleSection(data.evenimente)}
  </section>
  `;
}
function renderLocuire(data) {
  if (!data?.locuire) return "";
  const l = data.locuire;
  return `
  <section id="${l.id}">
    <h2><i class="fa-solid ${l.icon}"></i> ${l.title}</h2>
    <p>${l.description}</p>
    <div class="cards">
      <div class="card" id="${l.strategii_urbane.id}">
        <h3><i class="fa-solid ${l.strategii_urbane.icon}"></i> ${l.strategii_urbane.title}</h3>
        <p>${l.strategii_urbane.description}</p>
      </div>
      <div class="card" id="${l.urbanism.id}">
        <h3><i class="fa-solid ${l.urbanism.icon}"></i> ${l.urbanism.title}</h3>
        <p>${l.urbanism.description}</p>
        <ul>
          ${(l.urbanism.items || []).map((i) => `<li>${i}</li>`).join("")}
        </ul>
        <p>${l.urbanism.note || ""}</p>
      </div>
      <div class="card" id="${l.autorizatii_constructie.id}">
        <h3><i class="fa-solid ${l.autorizatii_constructie.icon}"></i> ${l.autorizatii_constructie.title}</h3>
        <p>${l.autorizatii_constructie.description}</p>
      </div>
      <div class="card" id="${l.strazi.id}">
        <h3><i class="fa-solid ${l.strazi.icon}"></i> ${l.strazi.title}</h3>
        <p>${l.strazi.description}</p>
      </div>
      <div class="card" id="${l.locuinte.id}">
        <h3><i class="fa-solid ${l.locuinte.icon}"></i> ${l.locuinte.title}</h3>
        <p>${l.locuinte.description}</p>
      </div>
      <div class="card" id="${l.gis.id}">
        <h3><i class="fa-solid ${l.gis.icon}"></i> ${l.gis.title}</h3>
        <p>${l.gis.description}</p>
      </div>
    </div>
  </section>
  `;
}
function renderMediu(m) {
  // console.log("RENDER MEDIU INPUT:", m);
  if (!m) return "";
  const renderCard = (item) => `
    <div id="${item.id}" class="cards grid">
      <h4><i class="fa-solid ${item.icon}"></i> ${item.title}</h4>
      ${item.description ? `<p>${item.description}</p>` : ""}
      ${item.items ? `<ul>${item.items.map((i) => `<li>${i}</li>`).join("")}</ul>` : ""}
    </div>
  `;
  const renderGroup = (group) => {
    if (!group) return "";
    return `
      <div id="${group.id}" class="cards grid">
        <h3><i class="fa-solid ${group.icon}"></i> ${group.title}</h3>
        ${group.description ? `<p>${group.description}</p>` : ""}
        ${Object.values(group)
          .filter((v) => v && typeof v === "object" && v.id && v.title)
          .map(renderCard)
          .join("")}
      </div>
    `;
  };
  return `
<section id="${m.id}" class="cards grid">
  <h2><i class="fa-solid ${m.icon}"></i> ${m.title}</h2>
  ${m.description ? `<p>${m.description}</p>` : ""}
  ${renderGroup(m.salubritate)}
  ${renderGroup(m.curatenie)}
  ${renderGroup(m.spatii_verzi)}
  ${renderGroup(m.energie)}
  ${renderGroup(m.altele_mediu)}
</section>
  `;
}
function renderMobilitate(data) {
  if (!data?.mobilitate) return "";
  const m = data.mobilitate;
  const card = (item) => `
    <div id="${item.id}" class="card">
      <h4><i class="fa-solid ${item.icon}"></i> ${item.title}</h4>
      <p>${item.description || ""}</p>
      ${
        item.items
          ? `<ul>${item.items.map((i) => `<li>${i}</li>`).join("")}</ul>`
          : ""
      }
      ${
        item.images
          ? `
        <div class="images">
          ${item.images
            .map(
              (img) => `<img src="${img}" alt="${item.title}" loading="lazy"/>`,
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `;
  return `
<section id="${m.id}">
  <h2><i class="fa-solid ${m.icon}"></i> ${m.title}</h2>
  <p>${m.description || ""}</p>
  ${card(m.plan_mobilitate)}
  ${card(m.parcari)}
  ${card(m.transport_public)}
  ${card(m.biciclete)}
  ${card(m.siguranta_circulatiei)}
</section>
  `;
}
function renderEconomieCard(section, isTaxe = false) {
  if (!section) return "";
  return `
  <div id="${section.id}" class="cards grid">
    <h3><i class="fa-solid ${section.icon}"></i> ${section.title}</h3>
    <p>${section.description || ""}</p>
    ${section.items ? `<ul>${section.items.map((i) => `<li>${i}</li>`).join("")}</ul>` : ""}
    ${
      isTaxe && section.termene_plata
        ? `
      <p>${section.termene_plata.title || "Termene de plată"}</p>
      <ul>
        ${section.termene_plata.items?.map((t) => `<li>${t}</li>`).join("")}
      </ul>
    `
        : ""
    }
    ${
      section.documente
        ? `
      <h4><i class="fa-solid fa-file-alt"></i> Documente</h4>
      <ul>
        ${section.documente
          .map(
            (d) => `<li><a href="#" class="btn-link btn-section">${d}</a></li>`,
          )
          .join("")}
      </ul>
    `
        : ""
    }

    ${
      section.link
        ? `
      <a href="${section.link}" target="_blank" class="btn-link btn-section">
        Ghișeul.ro
      </a>
    `
        : ""
    }
  </div>
  `;
}
function renderEconomie(data) {
  const e = data.economie || data;
  return `
<section id="${e.id}" class="cards grid">
  <h2><i class="fa-solid ${e.icon}"></i> ${e.title}</h2>
  <p>${e.description || ""}</p>
  ${renderEconomieCard(e.taxe_impozite, true)}
  ${renderEconomieCard(e.plati_online)}
  ${renderEconomieCard(e.buget)}
  ${renderEconomieCard(e.achizitii)}
  ${renderEconomieCard(e.proiecte_ue)}
  ${renderEconomieCard(e.investitori)}
</section>
  `;
}
function renderMonitor(data) {
  const m = data.monitor || data;
  // console.log("Monitor working ✅", m);
  const card = (item) => `
    <div id="${item.id}" class="card">
      <h4><i class="fa-solid ${item.icon}"></i> ${item.title}</h4>
      ${item.subtitle ? `<h5>${item.subtitle}</h5>` : ""}
      ${item.description ? `<p>${item.description}</p>` : ""}
      ${
        item.items
          ? `<ul>${item.items.map((i) => `<li>${i}</li>`).join("")}</ul>`
          : ""
      }
    </div>
  `;
  return `
  <section id="${m.id}">
    <h2><i class="fa-solid ${m.icon}"></i> ${m.title}</h2>
    <p>${m.description || ""}</p>
    <div class="cards grid">
      ${card(m.statut)}
      ${card(m.regulamente)}
      ${card(m.hotarari)}
      ${card(m.dispozitii)}
      ${card(m.documente_financiare)}
      ${card(m.alte_documente)}
    </div>
  </section>
  `;
}
function renderFooter(f) {
  // console.log("Footer working ✅", f);
  if (!f) return "";
  return `
<footer id="${f.id}" class="${f.class}">
  <!-- EMERGENCY BAR -->
  <div class="emergency-bar">
    <i class="fa-solid ${f.emergency_bar.icon}"></i>
    <strong>${f.emergency_bar.title}:</strong>
    ${f.emergency_bar.items
      .map(
        (item) => `
        <span>
          ${item.label}: <strong>${item.value}</strong>
        </span>
      `,
      )
      .join(" | ")}
  </div>
  <div class="footer-container cards grid">
    <!-- ABOUT -->
    <div class="footer-col">
      <h3>
        <i class="fa-solid ${f.about.icon}"></i>
        ${f.about.title}
      </h3>
      <p>${f.about.description}</p>
      <div class="socials">
        ${f.about.socials
          .map(
            (social) => `
            <a href="${social.url}" target="_blank" rel="noopener">
              <i class="fab ${social.icon}"></i>
            </a>
          `,
          )
          .join("")}
      </div>
    </div>
    <!-- CONTACT -->
    <div class="footer-col cards grid">
      <h3>
        <i class="fa-solid ${f.contact.icon}"></i>
        ${f.contact.title}
      </h3>
      ${f.contact.items
        .map(
          (item) => `
          <p>
            <i class="fa-solid ${item.icon}"></i>
            ${item.value}
          </p>
        `,
        )
        .join("")}
    </div>
    <!-- QUICK LINKS -->
    <div class="footer-col cards grid">
      <h3>
        <i class="fa-solid ${f.quick_links.icon}"></i>
        ${f.quick_links.title}
      </h3>
      <ul>
        ${f.quick_links.items
          .map(
            (item) => `
            <li>
              <a href="${item.href}">
                <i class="fa-solid ${item.icon}"></i>
                ${item.title}
              </a>
            </li>
          `,
          )
          .join("")}
      </ul>
    </div>
    <!-- LEGAL -->
    <div class="footer-col cards grid">
      <h3>
        <i class="fa-solid ${f.legal.icon}"></i>
        ${f.legal.title}
      </h3>
      <ul>
        ${f.legal.items
          .map(
            (item) => `
            <li>
              <a 
                href="${item.href}" 
                target="${item.target || "_self"}"
                rel="noopener"
              >
                <i class="fa-solid ${item.icon}"></i>
                ${item.title}
              </a>
            </li>
          `,
          )
          .join("")}
      </ul>
    </div>
    <!-- NEWSLETTER -->
    <div class="footer-col newsletter cards grid">
      <h3>
        <i class="fa-solid ${f.newsletter.icon}"></i>
        ${f.newsletter.title}
      </h3>
      <p>${f.newsletter.description}</p>
      <form>
        <input 
          type="${f.newsletter.form.input_type}" 
          placeholder="${f.newsletter.form.placeholder}" 
          required
        />
        <button type="submit">
          ${f.newsletter.form.button_text}
        </button>
      </form>
    </div>
  </div>
  <!-- MAP -->
  <div class="footer-map cards grid">
    <iframe
      src="${f.map.iframe.src}"
      loading="${f.map.iframe.loading}"
      ${f.map.iframe.allowfullscreen ? "allowfullscreen" : ""}
    ></iframe>
  </div>
  <!-- BOTTOM -->
  <div class="footer-bottom">
    <p>${f.bottom.copyright}</p>
    <p>
      Dezvoltat de
      <a href="${f.bottom.developer.url}">
        ${f.bottom.developer.name}
      </a>
    </p>
  </div>
</footer>
  `;
}
async function loadLang(section, lang) {
  const cfg = loaders[section];
  if (!cfg) {
    console.error(`Unknown section: ${section}`);
    return;
  }
  try {
    const res = await fetch(`assets/i18n/${lang}/${cfg.file}`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }
    const data = await res.json();
    // store dict (different per module)
    if (cfg.dictSetter) cfg.dictSetter(data);
    const container = document.getElementById(cfg.containerId);
    if (!container) {
      console.error(`Missing ${cfg.containerId}`);
      return;
    }
    container.innerHTML = cfg.render(data);
  } catch (err) {
    console.error(`Failed to load ${section}.json:`, err);
  }
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
    await loadAllLanguages(currentLang);
  });
}
async function loadAllLanguages(lang) {
  currentLang = lang;
  await loadNavLang(lang);
  await loadHeader(lang);
  renderMenu();
  await loadHomeLang(lang);
  await Promise.all([
    loadLang("administratie", lang),
    loadLang("comunitate", lang),
    loadLang("locuire", lang),
    loadLang("mediu", lang),
    loadLang("mobilitate", lang),
    loadLang("economie", lang),
    loadLang("monitor", lang),
    loadLang("footer", lang),
  ]);
  updateSections();
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
  ]);
}
async function initApp() {
  await loadAllComponents();
  while (!document.querySelector("nav")) {
    await new Promise((r) => setTimeout(r, 50));
  }
  initMenuSystem();
  cacheDOM();
  await loadAllLanguages(currentLang);
  initSearch();
  initThemeToggle();
  initLanguageToggle();
  initBackToTop();
}
initApp();
