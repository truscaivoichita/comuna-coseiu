console.log("Menu working ✅");

const nav = document.querySelector("nav");
const toggle = document.querySelector(".menu-toggle");

// TOGGLE MENIU

document.addEventListener("DOMContentLoaded", () => {
  console.log("Menu working ✅");

  const nav = document.querySelector("nav");
  const toggle = document.querySelector(".menu-toggle");

  if (!nav || !toggle) return; // safety

  // toggle.addEventListener("click", () => {
  //   nav.classList.toggle("active");
  // });

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
  });

  // DROPDOWN (nivel 1)
  document.querySelectorAll(".dropdown > a").forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth > 768) return;

      e.preventDefault();
      e.stopPropagation();
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
      e.stopPropagation();

      // închide altele
      parent.parentElement.querySelectorAll("li").forEach((li) => {
        if (li !== parent) li.classList.remove("submenu-active");
      });

      parent.classList.toggle("submenu-active");
    });
  });

  // CLICK AFARĂ
  document.addEventListener("click", (e) => {
    e.stopPropagation();
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
});
// RESIZE FIX
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    nav.classList.remove("active");
  }
});
