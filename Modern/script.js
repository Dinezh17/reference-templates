// ================= NAVBAR =================
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const menuLinks = navLinks.querySelectorAll("a");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navLinks.classList.toggle("open");
});
menuLinks.forEach((a) =>
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
  })
);

// sticky style + active section highlight
const sections = [...document.querySelectorAll("section[id]")];
const onScroll = () => {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 20);
  let current = "home";
  sections.forEach((s) => {
    if (y >= s.offsetTop - 160) current = s.id;
  });
  navLinks.querySelectorAll(":scope > a").forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current)
  );
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ================= REVEAL + COUNTERS =================
function animateCounter(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const start = performance.now();
  const dur = 1600;
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(decimals) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll(".counter").forEach(animateCounter);
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

// ================= HERO PARALLAX =================
const heroArt = document.getElementById("heroArt");
const layers = heroArt.querySelectorAll("[data-depth]");
const finePointer = window.matchMedia("(pointer: fine)").matches;

if (finePointer) {
  heroArt.closest(".hero").addEventListener("mousemove", (e) => {
    const r = heroArt.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    layers.forEach((layer) => {
      const d = parseFloat(layer.dataset.depth);
      layer.style.transform = `translate(${x * d}px, ${y * d}px)`;
    });
  });
  heroArt.closest(".hero").addEventListener("mouseleave", () => {
    layers.forEach((layer) => (layer.style.transform = ""));
  });
}

// ================= CONTACT FORM =================
const seg = document.getElementById("seg");
let enquiryType = "Personal";
seg.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  seg.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  enquiryType = btn.dataset.type;
});

const form = document.getElementById("contactForm");
const msg = document.getElementById("formMsg");
const rules = {
  name: (v) => v.trim().length > 1,
  phone: (v) => /^[+\d\s-]{8,}$/.test(v.trim()),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  message: (v) => v.trim().length > 4,
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  Object.entries(rules).forEach(([id, test]) => {
    const input = document.getElementById(id);
    const ok = test(input.value);
    input.parentElement.classList.toggle("error", !ok);
    if (!ok) valid = false;
  });
  msg.className = "form-msg " + (valid ? "ok" : "err");
  msg.textContent = valid
    ? `Thanks! Your ${enquiryType.toLowerCase()} enquiry has been sent.`
    : "Please check the highlighted fields.";
  if (valid) form.reset();
});

// ================= NEWSLETTER =================
document.getElementById("newsletter").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input");
  input.value = "";
  input.placeholder = "Subscribed ✓";
});

// ================= FOOTER YEAR =================
document.getElementById("year").textContent = new Date().getFullYear();
