// ================= NAVBAR =================
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  hamburger.classList.toggle("open", open);
  document.body.style.overflow = open ? "hidden" : "";
});
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
    document.body.style.overflow = "";
  })
);

const sectionIds = ["services", "process", "solutions", "about", "contact"];
const onScroll = () => {
  const y = window.scrollY;
  navbar.classList.toggle("scrolled", y > 10);
  let current = "";
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && y >= el.getBoundingClientRect().top + y - 140) current = id;
  });
  navLinks.querySelectorAll("a:not(.btn)").forEach((a) =>
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
  const tick = (now) => {
    const p = Math.min((now - start) / 1600, 1);
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
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => {
  // stagger siblings
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${siblings.indexOf(el) * 90}ms`;
  io.observe(el);
});

// ================= PROCESS: auto-cycle active step =================
const steps = [...document.querySelectorAll(".step")];
let stepIndex = 0;
let paused = false;
const setStep = (i) => steps.forEach((s, n) => s.classList.toggle("active", n === i));
setStep(0);
setInterval(() => {
  if (paused) return;
  stepIndex = (stepIndex + 1) % steps.length;
  setStep(stepIndex);
}, 2200);
document.getElementById("steps").addEventListener("mouseenter", () => { paused = true; setStep(-1); });
document.getElementById("steps").addEventListener("mouseleave", () => { paused = false; setStep(stepIndex); });

// ================= HERO PARALLAX =================
const heroVisual = document.querySelector(".hero-visual");
if (window.matchMedia("(pointer: fine)").matches) {
  const layers = heroVisual.querySelectorAll("[data-depth]");
  heroVisual.addEventListener("mousemove", (e) => {
    const r = heroVisual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    layers.forEach((l) => {
      const d = parseFloat(l.dataset.depth);
      const base = l.classList.contains("arch") ? "translateX(-46%) " : "";
      l.style.transform = `${base}translate(${x * d}px, ${y * d}px)`;
    });
  });
  heroVisual.addEventListener("mouseleave", () => layers.forEach((l) => (l.style.transform = "")));
}

// heart toggle
document.querySelector(".heart").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  btn.classList.toggle("liked");
  btn.textContent = btn.classList.contains("liked") ? "♥" : "♡";
});

// ================= CONTACT FORM =================
const chips = document.getElementById("chips");
let topic = "Home";
chips.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  chips.querySelectorAll("button").forEach((x) => x.classList.remove("active"));
  b.classList.add("active");
  topic = b.textContent;
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
  let ok = true;
  Object.entries(rules).forEach(([id, test]) => {
    const input = document.getElementById(id);
    const valid = test(input.value);
    input.parentElement.classList.toggle("error", !valid);
    if (!valid) ok = false;
  });
  msg.className = "form-msg " + (ok ? "ok" : "err");
  msg.textContent = ok
    ? `Thank you — our ${topic.toLowerCase()} team will reach out shortly.`
    : "Please check the highlighted fields.";
  if (ok) form.reset();
});

// ================= FOOTER YEAR =================
document.getElementById("year").textContent = new Date().getFullYear();
