// Theme management
let theme = 0;
try {
  const stored = localStorage.getItem("theme");
  if (stored) theme = stored === "light" ? 1 : 0;
} catch (err) {
  console.log("localStorage not available");
}

document.documentElement.style.setProperty("--theme", theme);

function toggleTheme() {
  theme = theme === 0 ? 1 : 0;
  document.documentElement.style.setProperty("--theme", theme);
  try {
    localStorage.setItem("theme", theme === 1 ? "light" : "dark");
  } catch (err) {
    console.log("localStorage not available");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
  
  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
    
    // Fermer le menu quand on clique sur un lien
    const navLinks = navMenu.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
    
    // Fermer le menu si on clique en dehors
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });
  }
});

// Blob follower
function follow(e) {
  const blob = document.getElementById("blob");
  blob.style.transform = `translate(${e.clientX - 50}px, ${e.clientY - 50}px)`;
}
document.addEventListener("mousemove", follow);

// Slowly rotate --theme-color hue
function colors() {
  setInterval(() => {
    const style = document.documentElement.style;
    const c = getComputedStyle(document.body).getPropertyValue("--theme-color");
    let [h, s, l] = c.substring(4, c.length - 1).split(", ");
    [h, s, l] = [(parseInt(h) + 1) % 360, parseInt(s), l];
    let hsl = `hsl(${h}, ${s}%, ${l})`;
    style.setProperty("--theme-color", hsl);
  }, 100);
}
colors();

// Change title when user leaves the page
let originalTitle = document.title;

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    document.title = "👋 Reviens ! - whostmdz";
  } else {
    document.title = originalTitle;
  }
});

// Also handle when window loses focus
window.addEventListener("blur", () => {
  document.title = "👋 Reviens ! - whostmdz";
});

window.addEventListener("focus", () => {
  document.title = originalTitle;
});