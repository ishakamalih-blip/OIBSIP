const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

// Mobile menu
menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

// Close mobile menu after clicking a link
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
    });
});

// Navbar shadow on scroll
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");

    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 5px 20px rgba(0, 0, 0, 0.1)";
    } else {
        navbar.style.boxShadow = "0 2px 15px rgba(0, 0, 0, 0.08)";
    }
});
