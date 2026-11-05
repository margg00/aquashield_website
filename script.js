/* AquaShield site script. No dependencies. Loaded with defer. */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Navigation ----------
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    var closeLabel = toggle.getAttribute("data-close") || toggle.textContent;
    var openLabel = toggle.querySelector(".nav-toggle-label") ? toggle.querySelector(".nav-toggle-label").textContent : "";
    var setNav = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
      var label = toggle.querySelector(".nav-toggle-label");
      if (label) label.textContent = open ? (toggle.getAttribute("data-close-label") || openLabel) : openLabel;
    };
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("is-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setNav(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1100px)").addEventListener("change", function (e) {
      if (e.matches) setNav(false);
    });
    void closeLabel;
  }

  // ---------- Live counter ----------
  var counter = document.querySelector("[data-counter]");
  if (counter) {
    var dataEl = counter.querySelector("[data-sites]");
    var readingsEl = counter.querySelector("[data-counter-readings]");
    if (dataEl && readingsEl) {
      try {
        var sites = JSON.parse(dataEl.textContent).sites;
        var lang = readingsEl.getAttribute("data-lang") || "en";
        var fmt = new Intl.NumberFormat(lang === "de" ? "de-CH" : lang === "fr" ? "fr-CH" : "en-US");
        var compute = function () {
          var now = Date.now();
          var total = 0;
          sites.forEach(function (s) {
            var days = Math.max(0, (now - Date.parse(s.liveSince)) / 86400000);
            total += s.points * 144 * days;
          });
          return Math.floor(total);
        };
        var paint = function () { readingsEl.textContent = fmt.format(compute()); };
        paint();
        if (!reducedMotion) setInterval(paint, 1000);
      } catch (err) { /* keep the build-time number */ }
    }
  }

  // ---------- Tooltips on touch ----------
  document.querySelectorAll(".info[data-tooltip]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = btn.classList.toggle("is-open");
      document.querySelectorAll(".info.is-open").forEach(function (b) { if (b !== btn) b.classList.remove("is-open"); });
      void open;
    });
  });
  document.addEventListener("click", function () {
    document.querySelectorAll(".info.is-open").forEach(function (b) { b.classList.remove("is-open"); });
  });

  // ---------- Calendly, loaded on interaction only ----------
  var calendlyLoaded = false;
  function loadCalendly(cb) {
    if (calendlyLoaded && window.Calendly) return cb();
    var css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);
    var s = document.createElement("script");
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = function () { calendlyLoaded = true; cb(); };
    document.head.appendChild(s);
  }
  document.querySelectorAll("[data-calendly]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var url = btn.getAttribute("data-calendly");
      btn.disabled = true;
      loadCalendly(function () {
        btn.disabled = false;
        if (window.Calendly) window.Calendly.initPopupWidget({ url: url });
        else window.open(url, "_blank", "noopener");
      });
    });
  });

  // ---------- Per-segment line on the Book a call page (?for=...) ----------
  var forLine = document.querySelector("[data-for-line]");
  if (forLine) {
    var seg = new URLSearchParams(window.location.search).get("for");
    var text = seg && forLine.getAttribute("data-line-" + seg);
    if (text) forLine.textContent = text;
  }

  // ---------- Contact form ----------
  var form = document.querySelector("[data-form]");
  if (form) {
    var note = form.querySelector("[data-form-note]");
    var submit = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      note.className = "form-note";
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      if (!name.value.trim() || !email.checkValidity()) {
        note.textContent = form.getAttribute("data-msg-invalid");
        note.classList.add("is-error");
        (name.value.trim() ? email : name).focus();
        return;
      }
      var original = submit.textContent;
      submit.disabled = true;
      submit.textContent = form.getAttribute("data-msg-sending");
      fetch(form.getAttribute("action"), { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) { if (!r.ok) throw new Error("failed"); note.textContent = form.getAttribute("data-msg-success"); note.classList.add("is-success"); form.reset(); })
        .catch(function () { note.textContent = form.getAttribute("data-msg-error"); note.classList.add("is-error"); })
        .then(function () { submit.disabled = false; submit.textContent = original; });
    });
  }

  // ---------- Videos: play when visible, never autoplay under reduced motion ----------
  var videos = document.querySelectorAll("video[data-autoplay]");
  if (videos.length && "IntersectionObserver" in window && !reducedMotion) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { v.play().catch(function () {}); } else { v.pause(); }
      });
    }, { threshold: 0.35 });
    videos.forEach(function (v) { vo.observe(v); });
  }

  // ---------- Click-to-load 3D scene ----------
  document.querySelectorAll("[data-load-frame]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".twin-embed");
      var src = wrap.getAttribute("data-src");
      var iframe = document.createElement("iframe");
      iframe.src = src;
      iframe.title = wrap.getAttribute("data-title") || "";
      iframe.loading = "lazy";
      iframe.setAttribute("tabindex", "-1");
      wrap.appendChild(iframe);
      var overlay = wrap.querySelector(".twin-load");
      if (overlay) overlay.remove();
    });
  });


  // ---------- Spotlight on cards and media (pointer devices only) ----------
  if (window.matchMedia("(hover: hover)").matches) {
    var spots = document.querySelectorAll(".media, .step-visual, .segment, .stat-box, .alert-card, .person, .post-card, .group, .ways li, .path li, .offices li, .promise-list li, .faq-item, .book-card, .status-box, .blocks > div");
    spots.forEach(function (el) {
      el.classList.add("spot");
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", (e.clientX - r.left) + "px");
        el.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }


  // ---------- Pause animations while their visual is off-screen ----------
  var animated = document.querySelectorAll(".hero-visual, .media-vis, .media-twin, .step-visual, .alert-card");
  if (animated.length && "IntersectionObserver" in window) {
    animated.forEach(function (el) { el.classList.add("is-offscreen"); });
    var ao = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle("is-offscreen", !en.isIntersecting); });
    }, { rootMargin: "120px 0px", threshold: 0.01 });
    animated.forEach(function (el) { ao.observe(el); });
  }

  // ---------- Reveal ----------
  var reveals = document.querySelectorAll("[data-reveal]");
  if (reveals.length && "IntersectionObserver" in window && !reducedMotion) {
    document.body.classList.add("has-reveal");
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); ro.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });
    reveals.forEach(function (el) { ro.observe(el); });
  }
})();
