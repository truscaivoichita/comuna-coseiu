console.log("Menu working ✅");

const nav = document.querySelector("nav");
const toggle = document.querySelector(".menu-toggle");

const items = document.querySelectorAll(".menu-left li");
const contents = document.querySelectorAll(".menu-content");
// Mobile Split Menu Navigation
document.querySelectorAll(".menu-left li").forEach((item) => {
  item.addEventListener("click", () => {
    const targetId = item.getAttribute("data-target");
    const menu = item.closest(".split-menu");
    const rightSide = menu.querySelector(".menu-right");

    // Hide all menu-content
    rightSide
      .querySelectorAll(".menu-content")
      .forEach((content) => content.classList.remove("active"));

    // Show selected content
    const activeContent = rightSide.querySelector(`#${targetId}`);
    if (activeContent) activeContent.classList.add("active");

    // Show right side (slide in)
    rightSide.classList.add("active");

    // Show back button
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
  });
});

items.forEach((item) => {
  item.addEventListener("mouseenter", () => {
    items.forEach((i) => i.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    item.classList.add("active");
    document.getElementById(item.dataset.target).classList.add("active");
  });
});

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
