// ================= NAVBAR =================
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const open = !navLinks.classList.contains("open");
    hamburger.classList.toggle("open", open);
    navLinks.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", open);
  });
  navLinks.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    })
  );
}

// Services dropdown: hover/focus on desktop (CSS), tap to expand on mobile
document.querySelectorAll(".nav-dd").forEach((dd) => {
  const toggle = dd.querySelector(".dd-toggle");
  if (!toggle) return;
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    const open = !dd.classList.contains("open");
    dd.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  dd.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      dd.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
});

// sticky style on scroll
const onScroll = () => navbar && navbar.classList.toggle("scrolled", window.scrollY > 20);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ================= REVEAL =================
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 70}ms`;
  io.observe(el);
});

// ================= HERO PARALLAX =================
const heroArt = document.getElementById("heroArt");
const finePointer = window.matchMedia("(pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroArt && finePointer && !reduceMotion) {
  const layers = heroArt.querySelectorAll("[data-depth]");
  const hero = heroArt.closest(".hero");
  hero.addEventListener("mousemove", (e) => {
    const r = heroArt.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    layers.forEach((layer) => {
      const d = parseFloat(layer.dataset.depth);
      layer.style.transform = `translate(${x * d}px, ${y * d}px)`;
    });
  });
  hero.addEventListener("mouseleave", () => {
    layers.forEach((layer) => (layer.style.transform = ""));
  });
}

// ================= CONTACT FORM =================
const form = document.getElementById("contactForm");
if (form) {
  const seg = document.getElementById("seg");
  const msg = document.getElementById("formMsg");
  const labels = { voice: "Voice / VoIP", sms: "SMS", partnership: "Partnership", general: "General" };
  let enquiryType = "voice";

  const setType = (type) => {
    if (!labels[type]) return;
    enquiryType = type;
    seg.querySelectorAll("button").forEach((b) => {
      const on = b.dataset.type === type;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
  };

  // pre-select from ?type=voice|sms|partnership|general
  const params = new URLSearchParams(window.location.search);
  setType((params.get("type") || "voice").toLowerCase());

  seg.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (btn) setType(btn.dataset.type);
  });

  const rules = {
    name: (v) => v.trim().length >= 2,
    company: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => v.trim() === "" || /^[+\d\s()-]{6,}$/.test(v.trim()),
    message: (v) => v.trim().length >= 5,
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.querySelector(".hp input").value) return; // honeypot: silently drop bots

    let valid = true;
    Object.entries(rules).forEach(([id, test]) => {
      const input = document.getElementById(id);
      const ok = test(input.value);
      input.closest(".field").classList.toggle("error", !ok);
      input.setAttribute("aria-invalid", !ok);
      if (!ok) valid = false;
    });
    const consent = document.getElementById("consent");
    consent.closest(".consent").classList.toggle("error", !consent.checked);
    if (!consent.checked) valid = false;

    if (!valid) {
      msg.className = "form-msg err";
      msg.textContent = "Please check the highlighted fields.";
      form.querySelector(".error input, .error textarea")?.focus();
      return;
    }

    const val = (id) => document.getElementById(id).value.trim();
    const data = {
      type: labels[enquiryType],
      name: val("name"),
      company: val("company"),
      email: val("email"),
      phone: val("phone"),
      message: val("message"),
    };
    const subject = `[${data.type}] Website enquiry from ${data.company}`;

    // If a form handler URL is set on the form (data-endpoint), post to it.
    // Otherwise fall back to opening the visitor's email app, addressed to info@omaginfo.com.
    const endpoint = form.dataset.endpoint;
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ subject, ...data }),
        });
        if (!res.ok) throw new Error(res.status);
        msg.className = "form-msg ok";
        msg.textContent = "Thank you. Your enquiry has been sent — our team will be in touch.";
      } else {
        const body = [
          `Enquiry type: ${data.type}`,
          `Name: ${data.name}`,
          `Company: ${data.company}`,
          `Email: ${data.email}`,
          data.phone ? `Phone: ${data.phone}` : "",
          "",
          data.message,
        ].filter((l, i) => l !== "" || i === 5).join("\n");
        window.location.href = `mailto:info@omaginfo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        msg.className = "form-msg ok";
        msg.textContent = "Thank you. Your email app should open with the enquiry ready to send to info@omaginfo.com.";
      }
      form.reset();
      setType(enquiryType);
    } catch (err) {
      msg.className = "form-msg err";
      msg.textContent = "Sorry, something went wrong. Please email us at info@omaginfo.com.";
    }
  });
}

// ================= FOOTER YEAR =================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
