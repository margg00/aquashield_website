/* AquaShield site script. No dependencies. Loaded with defer. */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Start a fresh page at the top ----------
  // Back and forward keep the browser's own scroll restoration. A link click (or a typed URL)
  // without a #hash always opens the new page at its top, also inside an auto-height preview
  // iframe, where the host page would otherwise stay scrolled to where the click happened.
  var navEntry = window.performance && performance.getEntriesByType ? performance.getEntriesByType("navigation")[0] : null;
  var navType = navEntry ? navEntry.type : (window.performance && performance.navigation ? ["navigate", "reload", "back_forward"][performance.navigation.type] : "navigate");
  var framed = false;
  try { framed = window.self !== window.top; } catch (err) { framed = true; }
  var fromOwnSite = false;
  try { fromOwnSite = Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin; } catch (err) { fromOwnSite = false; }
  var toTop = function () {
    if (navType !== "navigate" || window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (framed && fromOwnSite && document.documentElement.scrollIntoView) {
      document.documentElement.scrollIntoView({ block: "start", inline: "nearest", behavior: "instant" });
    }
  };
  toTop();
  window.addEventListener("pageshow", function (e) { if (!e.persisted) toTop(); });

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


  // ---------- Sectors dropdown (desktop) ----------
  var drops = document.querySelectorAll("[data-dropdown]");
  drops.forEach(function (drop) {
    var btn = drop.querySelector("[data-drop-toggle]");
    var desktop = window.matchMedia("(min-width: 1100px)");
    var setOpen = function (open) { drop.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open ? "true" : "false"); };
    btn.addEventListener("click", function () { if (!desktop.matches) return; setOpen(!drop.classList.contains("is-open")); });
    document.addEventListener("click", function (e) { if (!drop.contains(e.target)) setOpen(false); });
    drop.addEventListener("keydown", function (e) { if (e.key === "Escape") { setOpen(false); btn.focus(); } });
    drop.addEventListener("mouseleave", function () { setOpen(false); });
  });


  // ---------- Count-up for stat numbers (started by "Start when seen" below) ----------
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };
  // First number in the text, with its own group and decimal separators kept:
  // "$89k", "€4.91bn", "89.000 $", "4,91 Mrd. €", "89 000 $", "4,91 Md €", "1'234".
  // Returns the parts and a formatter, or null when the text holds no number.
  var parseNum = function (text) {
    var m = text.match(/\d(?:[\d.,'’\u00a0\u202f ]*\d)?/);
    if (!m) return null;
    var raw = m[0];
    var lang = (document.documentElement.lang || "en").slice(0, 2);
    var decSep = lang === "en" ? "." : ",";
    var parts = raw.split(decSep);
    var decimals = parts.length > 1 && parts[parts.length - 1].length <= 2 ? parts[parts.length - 1].length : 0;
    var num = parseFloat(raw.replace(/[^\d]/g, "")) / Math.pow(10, decimals);
    if (!isFinite(num)) return null;
    var intPart = decimals ? raw.slice(0, raw.lastIndexOf(decSep)) : raw;
    var groupSep = (intPart.match(/[^\d]/) || [""])[0];
    var prefix = text.slice(0, m.index), suffix = text.slice(m.index + raw.length);
    return { text: text, num: num, at: function (n) {
      var fixed = n.toFixed(decimals).split(".");
      var whole = groupSep ? fixed[0].replace(/\B(?=(\d{3})+(?!\d))/g, groupSep) : fixed[0];
      return prefix + (decimals ? whole + decSep + fixed[1] : whole) + suffix;
    } };
  };
  var runCount = function (el, duration) {
    var parsed = parseNum(el.textContent);
    if (!parsed) return;
    var start = null, dur = duration || 2000;
    el.classList.add("is-counting");
    el.setAttribute("data-counting", "1");
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      el.textContent = parsed.at(parsed.num * ease(p));
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = parsed.text; el.classList.remove("is-counting"); el.removeAttribute("data-counting"); }
    };
    requestAnimationFrame(step);
  };

  // ---------- Live counter ----------
  var counter = document.querySelector("[data-counter]");
  if (counter) {
    var dataEl = counter.querySelector("[data-sites]");
    var readingsEl = counter.querySelector("[data-counter-readings]");
    if (dataEl && readingsEl) {
      try {
        var sites = JSON.parse(dataEl.textContent).sites;
        var lang = readingsEl.getAttribute("data-lang") || "en";
        var fmt = new Intl.NumberFormat(lang === "de" ? "de-DE" : lang === "fr" ? "fr-CH" : "en-US");
        var compute = function () {
          var now = Date.now();
          var total = 0;
          sites.forEach(function (s) {
            var days = Math.max(0, (now - Date.parse(s.liveSince)) / 86400000);
            total += s.points * 144 * days;
          });
          return Math.floor(total);
        };
        // Same number format as the ticking total (the build-time per-day figure may differ, e.g. fr-CH separators)
        var perDayEl = counter.querySelector("[data-counter-perday]");
        if (perDayEl) perDayEl.textContent = fmt.format(sites.reduce(function (n, s) { return n + s.points * 144; }, 0));
        var paint = function () { if (readingsEl.getAttribute("data-counting")) return; readingsEl.textContent = fmt.format(compute()); };
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


  // ---------- Start when seen ----------
  // The first section of a page (its hero) plays on load, as before. Everywhere else a content animation starts
  // only once its visual is properly in view: at least 45% of its height inside the viewport, or, for a visual
  // taller than the viewport, once its top edge has risen above 55% of the viewport height.
  // [data-reveal] keeps its early fade (is-visible). Sequences key on is-playing, set here on the element
  // named first and measured on the visual named second. Count-ups start here too. Looping drawings stay paused
  // (is-offscreen) until seen and pause again once fully out of view. A play-once item scrolled past unseen
  // (a jump to an anchor) is started as well, so nothing stays hidden.
  var PLAYS = [
    [".dc-seq", ".dc-steps"],
    [".step", ".dc-vis"],
    [".dc-path", ""],
    [".anchor-stat", ".anchor-bar"],
    [".ins-timeline", "svg"],
    [".ins-book-visual", ".media"],
    [".chapter", ".chapter-line, .chapter-node"],
    [".spirit-tile", ".spirit-icon"]
  ];
  var LOOPS = ".hero-visual, .media-vis, .media-twin, .step-visual, .alert-card";
  var mainEl = document.querySelector("main");
  var heroEl = mainEl && mainEl.firstElementChild;
  var inHero = function (el) { return Boolean(heroEl && heroEl.contains(el)); };
  // Layout box of an element without its own transform (a bar at scaleY(0) still has its real size).
  var boxOf = function (el) {
    var op = el.offsetParent;
    if (op && "offsetTop" in el) {
      var top = op.getBoundingClientRect().top + op.clientTop + el.offsetTop;
      return { top: top, bottom: top + el.offsetHeight, height: el.offsetHeight };
    }
    var r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, height: r.height };
  };
  var seen = function (b, vh) {
    if (b.height <= 0) return false;
    if (b.height > vh) return b.top <= vh * 0.55 && b.bottom > 0;
    return (Math.min(b.bottom, vh) - Math.max(b.top, 0)) / b.height >= 0.45;
  };
  if ("IntersectionObserver" in window) {
    var items = [];
    PLAYS.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        var parts = pair[1] ? el.querySelectorAll(pair[1]) : [el];
        if (!parts.length) return;
        if (inHero(el)) el.classList.add("is-playing");
        else items.push({ el: el, parts: parts, kind: "play" });
      });
    });
    var heroCounts = [];
    if (!reducedMotion) {
      document.querySelectorAll(".stat-value").forEach(function (el) {
        if (el.closest("[data-scrub]")) return;
        if (inHero(el)) heroCounts.push(el);
        else items.push({ el: el, parts: [el], kind: "count", dur: el.closest("[data-counter]") ? 1600 : 2000 });
      });
    }
    var heroLoops = [];
    document.querySelectorAll(LOOPS).forEach(function (el) {
      el.classList.add("is-offscreen");
      if (inHero(el)) heroLoops.push(el);
      else items.push({ el: el, parts: [el], kind: "loop" });
    });

    // Hero: as before (count when 40% visible, loops run while near the screen).
    if (heroCounts.length) {
      var hco = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); hco.unobserve(en.target); } });
      }, { threshold: 0.4 });
      heroCounts.forEach(function (el) { hco.observe(el); });
    }
    if (heroLoops.length) {
      var hlo = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { en.target.classList.toggle("is-offscreen", !en.isIntersecting); });
      }, { rootMargin: "120px 0px", threshold: 0.01 });
      heroLoops.forEach(function (el) { hlo.observe(el); });
    }

    // Everything else: the observer keeps a short list of items on screen, scroll frames test only those.
    var near = [], queued = false;
    var start = function (it) {
      if (it.kind === "play") it.el.classList.add("is-playing");
      else if (it.kind === "count") runCount(it.el, it.dur);
      else { it.el.classList.remove("is-offscreen"); it.running = true; return; }
      it.done = true;
      po.unobserve(it.el);
    };
    var visualOf = function (it) {
      for (var i = 0; i < it.parts.length; i++) { if (it.parts[i].getClientRects().length && it.parts[i].offsetHeight !== 0) return it.parts[i]; }
      return it.parts[0];
    };
    var check = function () {
      queued = false;
      var vh = window.innerHeight;
      var hits = near.map(function (it) { return seen(boxOf(visualOf(it)), vh); });
      near.forEach(function (it, i) { if (hits[i]) start(it); });
      near = near.filter(function (it) { return !it.done && !it.running; });
    };
    var queue = function () { if (!queued && near.length) { queued = true; requestAnimationFrame(check); } };
    var po = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var it = null;
        for (var i = 0; i < items.length; i++) { if (items[i].el === en.target) { it = items[i]; break; } }
        if (!it || it.done) return;
        var at = near.indexOf(it);
        if (en.isIntersecting) { if (at < 0 && !it.running) near.push(it); return; }
        if (at >= 0) near.splice(at, 1);
        if (it.kind === "loop") { it.running = false; it.el.classList.add("is-offscreen"); }
        else if (en.boundingClientRect.bottom <= 0) start(it);
      });
      queue();
    }, { threshold: 0 });
    items.forEach(function (it) { po.observe(it.el); });
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue, { passive: true });
  }

  // ---------- Scroll-scrubbed band (home: "Water is the one building system you cannot see") ----------
  // Every [data-scrub] element gets --p from 0 (its top at 88% of the viewport height) to 1 (its top at 38%),
  // or the range it names, e.g. data-scrub="85 45". Children of [data-scrub-row] that sit in one row share the
  // row's progress, staggered left to right. Its .stat-value numbers follow --p, [data-scrub-words] lights up
  // word by word. CSS defaults to --p: 1, so without JS or under reduced motion the band shows finished.
  var scrubEls = document.querySelectorAll("[data-scrub]");
  if (scrubEls.length && "IntersectionObserver" in window && !reducedMotion) {
    document.body.classList.add("has-scrub");
    var scrubs = [];
    var splitWords = function (el) {
      var text = el.textContent.trim();
      var words = text.split(/[ \t\r\n]+/);
      var plain = document.createElement("span");
      plain.className = "sr-only";
      plain.textContent = text;
      var shown = document.createElement("span");
      shown.setAttribute("aria-hidden", "true");
      words.forEach(function (w, i) {
        if (i) shown.appendChild(document.createTextNode(" "));
        var s = document.createElement("span");
        s.className = "scrub-word";
        s.style.setProperty("--a", (words.length > 1 ? i / (words.length - 1) * 0.8 : 0).toFixed(4));
        s.textContent = w;
        shown.appendChild(s);
      });
      el.textContent = "";
      el.appendChild(plain);
      el.appendChild(shown);
    };
    scrubEls.forEach(function (el) {
      var range = (el.getAttribute("data-scrub") || "").split(/\s+/).map(Number);
      var it = { el: el, from: (range[0] || 88) / 100, to: (range[1] || 38) / 100, p: -1, nums: [], done: null };
      el.querySelectorAll(".stat-value").forEach(function (n) {
        var parsed = parseNum(n.textContent);
        if (parsed) it.nums.push({ el: n, parsed: parsed, shown: parsed.text });
      });
      if (el.hasAttribute("data-scrub-words")) splitWords(el);
      var row = el.parentElement && el.parentElement.hasAttribute("data-scrub-row") ? el.parentElement : null;
      if (row) {
        it.row = row;
        it.mates = Array.prototype.filter.call(row.children, function (c) { return c.hasAttribute("data-scrub"); });
        it.index = it.mates.indexOf(el);
      }
      scrubs.push(it);
    });

    // Layout cache: page positions from the offset parent and offsets (so no transform counts), refreshed on
    // resize, load, font swap and any change of the page height. A scroll frame then reads only scrollY.
    var vh = window.innerHeight;
    var measure = function () {
      vh = window.innerHeight;
      var y = window.pageYOffset;
      scrubs.forEach(function (it) {
        var op = it.el.offsetParent || document.documentElement;
        var base = op.getBoundingClientRect().top + op.clientTop + y;
        it.docTop = base + it.el.offsetTop;
        if (it.row) {
          var tops = it.mates.map(function (m) { return m.offsetTop; });
          it.inRow = Math.max.apply(null, tops) - Math.min.apply(null, tops) < 2;
          if (it.inRow) it.docTop = base + Math.min.apply(null, tops);
        }
      });
    };
    var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var update = function () {
      var y = window.pageYOffset;
      scrubs.forEach(function (it) {
        var top = it.docTop - y;
        var p = clamp01((it.from * vh - top) / ((it.from - it.to) * vh));
        if (it.inRow && it.mates.length > 1) {
          var span = 0.6, step = (1 - span) / (it.mates.length - 1);
          p = clamp01((p - it.index * step) / span);
        }
        p = Math.round(p * 10000) / 10000;
        if (p === it.p) return;
        it.p = p;
        it.el.style.setProperty("--p", String(p));
        var done = p >= 1;
        if (done !== it.done) { it.done = done; it.el.classList.toggle("is-done", done); }
        it.nums.forEach(function (n) {
          var text = done ? n.parsed.text : n.parsed.at(n.parsed.num * ease(p));
          if (text !== n.shown) { n.shown = text; n.el.textContent = text; }
        });
      });
    };
    var scrubQueued = false;
    var frame = function () { scrubQueued = false; update(); };
    var onScroll = function () { if (!scrubQueued) { scrubQueued = true; requestAnimationFrame(frame); } };
    var onResize = function () { measure(); onScroll(); };
    var listening = false, nearCount = 0;
    var listen = function (on) {
      if (on === listening) return;
      listening = on;
      var fn = on ? "addEventListener" : "removeEventListener";
      window[fn]("scroll", onScroll, { passive: true });
      window[fn]("resize", onResize, { passive: true });
    };
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (Boolean(en.target.__scrubNear) === en.isIntersecting) return;
        en.target.__scrubNear = en.isIntersecting;
        en.target.classList.toggle("is-near", en.isIntersecting);
        nearCount += en.isIntersecting ? 1 : -1;
      });
      listen(nearCount > 0);
      measure();
      onScroll();
    }, { rootMargin: "50% 0px" });
    scrubEls.forEach(function (el) { so.observe(el); });
    measure();
    update();
    window.addEventListener("load", onResize);
    if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); onScroll(); }).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
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
