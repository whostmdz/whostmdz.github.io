// this is solely to load the right theme and icons
// it relies on the LocalStorage API
// it's a bit painful to reload the page every single time...
// but on the bright side, the theme choice is kept through sessions!

let theme = localStorage.getItem("theme");
if (!theme) {
    try {
        localStorage.setItem("theme", "dark");
    } catch (err) {
        console.log(err);
    }
}
let style = document.documentElement.style;
style.setProperty("--theme", theme == "light" ? 1 : 0);
style.setProperty("--theme-icon", theme == "light" ? "url('assets/light.svg')" : "url('assets/dark.svg')");
style.setProperty("--refresh-icon", theme == "light" ? "url('assets/refresh-light.svg')" : "url('assets/refresh-dark.svg')");

