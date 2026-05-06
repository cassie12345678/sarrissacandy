const currentPage = document.body.dataset.page;

document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const isActive = link.dataset.navLink === currentPage;
    link.classList.toggle("is-active", isActive);

    if (isActive) {
        link.setAttribute("aria-current", "page");
    } else {
        link.removeAttribute("aria-current");
    }
});

const toggleButton = document.querySelector("[data-sidebar-toggle]");
const sidebarNav = document.querySelector("[data-sidebar-nav]");

if (toggleButton && sidebarNav) {
    toggleButton.addEventListener("click", () => {
        const isOpen = sidebarNav.classList.toggle("is-open");
        toggleButton.setAttribute("aria-expanded", String(isOpen));
    });
}
