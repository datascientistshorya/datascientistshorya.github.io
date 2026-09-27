const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector("nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.textContent = isOpen ? "×" : "☰";
  });
}

function track(eventName) {
  if (typeof gtag === "function") {
    gtag("event", eventName);
  }
}
