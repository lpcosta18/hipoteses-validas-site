// header.js - comportamento do menu com header/footer estáticos
(function () {
    function updateActiveMenu() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        document.querySelectorAll(".nav-link, .mobile-link").forEach((link) => {
            const linkHref = link.getAttribute("href");
            link.classList.remove("active");
            if (linkHref === currentPage) {
                link.classList.add("active");
            }
        });
    }

    function initMobileMenu() {
        const menuBtn = document.querySelector(".menu-mobile-btn");
        const menuMobile = document.querySelector(".menu-mobile");

        if (!menuBtn || !menuMobile) return;

        menuBtn.addEventListener("click", function () {
            const isActive = this.classList.toggle("active");
            menuMobile.classList.toggle("active");
            this.setAttribute("aria-expanded", isActive ? "true" : "false");
        });
    }

    function init() {
        updateActiveMenu();
        initMobileMenu();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();