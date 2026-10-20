// ===== Services data (rendered into the grid) =====
const icons = {
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>',
  tooth: '<path d="M7 3c-2 0-3 2-3 4 0 3 1 5 2 8s1 6 3 6 1-6 3-6 1 6 3 6 2-3 3-6 2-5 2-8c0-2-1-4-3-4s-3 1-5 1-3-1-5-1z"/>',
  baby: '<circle cx="12" cy="10" r="6"/><circle cx="10" cy="9" r=".8" fill="currentColor"/><circle cx="14" cy="9" r=".8" fill="currentColor"/><path d="M10 12.5c1 .8 3 .8 4 0M8 20c1-2 2.5-3 4-3s3 1 4 3"/>',
  brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h0V4zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3V4z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  bone: '<path d="M7 7a2.5 2.5 0 1 1 3-3l7 7a2.5 2.5 0 1 1 3 3 2.5 2.5 0 1 1-3 3l-7-7a2.5 2.5 0 1 1-3-3z"/>',
  lab: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/><path d="M7 15h10"/>',
  pill: '<rect x="3" y="9" width="18" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="m9.5 9.5 5 5"/>'
};

const services = [
  { icon: "heart", title: "Cardiology Care" },
  { icon: "tooth", title: "Dental Care" },
  { icon: "baby",  title: "Pediatrics" },
  { icon: "brain", title: "Neurology" },
  { icon: "eye",   title: "Eye Clinic" },
  { icon: "bone",  title: "Orthopedics" },
  { icon: "lab",   title: "Lab Diagnostics" },
  { icon: "pill",  title: "Pharmacy" }
];

const grid = document.getElementById("servicesGrid");
grid.innerHTML = services.map((s, i) => `
  <article class="service-card reveal" style="transition-delay:${(i % 4) * 80}ms">
    <div class="sc-top">
      <span class="sc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${icons[s.icon]}</svg></span>
      <button class="sc-fav" aria-label="Save ${s.title}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${icons.heart}</svg>
      </button>
    </div>
    <h3>${s.title}</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</p>
  </article>
`).join("");

grid.addEventListener("click", (e) => {
  const fav = e.target.closest(".sc-fav");
  if (fav) fav.classList.toggle("liked");
});

// ===== Navbar: scroll style, mobile menu, active link =====
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const links = navLinks.querySelectorAll("a");
const toTop = document.getElementById("toTop");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
links.forEach((a) => a.addEventListener("click", () => {
  hamburger.classList.remove("open");
  navLinks.classList.remove("open");
}));

const sections = [...document.querySelectorAll("section[id]")];
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 30);
  toTop.classList.toggle("show", y > 500);

  let current = "home";
  sections.forEach((s) => { if (y >= s.offsetTop - 140) current = s.id; });
  links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + current && !a.classList.contains("btn")));
});

toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== Reveal on scroll + counters =====
const animateCounter = (el) => {
  const target = +el.dataset.target;
  const start = performance.now();
  const dur = 1600;
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const val = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    el.textContent = target >= 1000 ? (val / 1000).toFixed(val >= target ? 0 : 1) + "k" : val;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    entry.target.querySelectorAll(".counter").forEach(animateCounter);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// ===== Hero search (demo) =====
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = document.getElementById("searchInput").value.trim();
  if (!q) return;
  document.getElementById("services").scrollIntoView({ behavior: "smooth" });
  const match = [...document.querySelectorAll(".service-card")]
    .find((c) => c.querySelector("h3").textContent.toLowerCase().includes(q.toLowerCase()));
  if (match) {
    match.style.boxShadow = "0 0 0 3px #2f5bea";
    setTimeout(() => (match.style.boxShadow = ""), 2000);
  }
});

// ===== Contact form validation (demo) =====
const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  ["name", "email", "message"].forEach((id) => {
    const input = document.getElementById(id);
    const valid = id === "email"
      ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
      : input.value.trim().length > 1;
    input.parentElement.classList.toggle("error", !valid);
    if (!valid) ok = false;
  });
  msg.className = "form-msg " + (ok ? "ok" : "err");
  msg.textContent = ok ? "Thank you! We'll get back to you soon." : "Please fill in all fields correctly.";
  if (ok) form.reset();
});

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();
