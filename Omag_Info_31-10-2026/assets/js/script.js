// ================= NAVBAR =================
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  const scrim = document.createElement("div");
  scrim.className = "nav-scrim";
  navbar.appendChild(scrim);
  const setMenu = (open) => {
    hamburger.classList.toggle("open", open);
    navLinks.classList.toggle("open", open);
    scrim.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    hamburger.setAttribute("aria-expanded", open);
  };
  hamburger.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  scrim.addEventListener("click", () => setMenu(false));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (e) => e.matches && setMenu(false));
}

// Services dropdown: hover on desktop, toggle on click, and close on click
document.querySelectorAll(".nav-dd").forEach((dd) => {
  const toggle = dd.querySelector(".dd-toggle");
  const servicesLink = dd.querySelector(".dd-row > a");
  const menu = dd.querySelector(".dd-menu");
  let hoverSuppressed = false;

  const openDropdown = () => {
    dd.classList.add("open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  };

  const closeDropdown = () => {
    dd.classList.remove("open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.blur();
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dd.classList.contains("open")) {
      closeDropdown();
      hoverSuppressed = true;
    } else {
      hoverSuppressed = false;
      openDropdown();
    }
  };

  // Click on the arrow toggle button toggles dropdown
  if (toggle) toggle.addEventListener("click", toggleDropdown);

  // Desktop hover interactions
  dd.addEventListener("mouseenter", () => {
    if (!hoverSuppressed) {
      openDropdown();
    }
  });

  dd.addEventListener("mouseleave", () => {
    hoverSuppressed = false;
    closeDropdown();
  });

  // Close when any dropdown item is clicked
  if (menu) {
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeDropdown();
        hoverSuppressed = false;
      });
    });
  }

  // Close on Escape key
  dd.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
      hoverSuppressed = false;
      if (toggle) toggle.focus();
    }
  });

  // Close when clicking anywhere outside
  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target)) {
      closeDropdown();
      hoverSuppressed = false;
    }
  });
});

// sticky style on scroll
const spySections = [...document.querySelectorAll("[data-nav]")];
const spyLinks = [...document.querySelectorAll('.nav-links > a, .dd-row > a')];
const onScroll = () => {
  const y = window.scrollY;
  if (navbar) navbar.classList.toggle("scrolled", y > 20);
  if (spySections.length > 1) {
    let current = spySections[0]?.dataset.nav;
    spySections.forEach((s) => { if (y >= s.offsetTop - 160) current = s.dataset.nav; });
    if (window.innerHeight + y >= document.body.scrollHeight - 4) current = spySections.at(-1)?.dataset.nav;
    spyLinks.forEach((a) => {
      const href = a.getAttribute("href");
      if (href && href.startsWith("#")) {
        a.classList.toggle("active", href === "#" + current);
      }
    });
  }
};
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
document.querySelectorAll(".reveal").forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 5) * 110}ms`;
  el.addEventListener("transitionend", () => { el.style.transitionDelay = ""; }, { once: true });
  io.observe(el);
});

// scroll progress bar
const scrollBar = document.getElementById("scrollBar");
const updateBar = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (scrollBar) scrollBar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
window.addEventListener("scroll", updateBar, { passive: true });
updateBar();

// ================= HERO PARALLAX =================
const finePointer = window.matchMedia("(pointer: fine)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (finePointer && !reduceMotion) {
  document.querySelectorAll(".hero-art").forEach((heroArt) => {
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
    hero.addEventListener("mouseleave", () => layers.forEach((l) => (l.style.transform = "")));
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

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-enquiry]");
    if (link) setType(link.dataset.enquiry);
  });

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
          body: JSON.stringify({
            access_key: form.querySelector('input[name="access_key"]').value,
            subject,
            from_name: "Omaginfo Website",
            ...data,
          }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.message || res.status);
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


