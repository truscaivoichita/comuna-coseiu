console.log("Menu working ✅");

const nav = document.querySelector("nav");
const toggle = document.querySelector(".menu-toggle");

// TOGGLE MENIU
toggle.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// DROPDOWN (nivel 1)
document.querySelectorAll(".dropdown > a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (window.innerWidth > 768) return;

    e.preventDefault();

    const parent = this.parentElement;

    // închide toate
    document.querySelectorAll(".dropdown").forEach((d) => {
      if (d !== parent) d.classList.remove("active");
    });

    // închide submeniuri
    document.querySelectorAll(".submenu-active").forEach((s) => {
      s.classList.remove("submenu-active");
    });

    parent.classList.toggle("active");
  });
});

// SUBMENIU (nivel 2)
document.querySelectorAll(".dropdown-menu > li > a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (window.innerWidth > 768) return;

    const parent = this.parentElement;
    const submenu = parent.querySelector(".dropdown-submenu");

    if (!submenu) return;

    e.preventDefault();

    // închide altele
    parent.parentElement.querySelectorAll("li").forEach((li) => {
      if (li !== parent) li.classList.remove("submenu-active");
    });

    parent.classList.toggle("submenu-active");
  });
});

// CLICK AFARĂ
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove("active");

    document.querySelectorAll(".dropdown").forEach((d) => {
      d.classList.remove("active");
    });

    document.querySelectorAll(".submenu-active").forEach((s) => {
      s.classList.remove("submenu-active");
    });
  }
});
