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
    // Layout is read when the check is queued (scroll event, observer callback: layout is clean there) and the
    // classes are written in the next frame, so no frame forces a style or layout pass.
    var check = function () {
      queued = false;
      near.forEach(function (it) { if (it.hit) start(it); });
      near = near.filter(function (it) { return !it.done && !it.running; });
    };
    var queue = function () {
      if (!near.length) return;
      var vh = window.innerHeight;
      near.forEach(function (it) { it.hit = seen(boxOf(visualOf(it)), vh); });
      if (!queued) { queued = true; requestAnimationFrame(check); }
    };
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

    // Pinned mode: [data-pin] is a tall wrapper around the band, the band is sticky inside it, so the page holds
    // while the visitor scrolls through the wrapper's extra height (native scroll, nothing is intercepted).
    // One progress P (0 to 1) runs the tiles first, then the closing line, then a short hold before release.
    // Desktop and tablet: tiles in one row, staggered. Phones: the tiles slide sideways, one in focus at a time.
    // Used only when the pinned band fits the small viewport height (100svh, so the address bar never moves it),
    // re-checked when the width or that height changes. Otherwise the per-element scrub above applies.
    var pinEl = document.querySelector("[data-pin]");
    var band = pinEl && pinEl.querySelector(".problem-band");
    var grid = band && band.querySelector("[data-scrub-row]");
    var headerEl = document.querySelector(".site-header");
    var pin = null, pinW = -1, pinSvh = -1;
    var probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none";
    probe.style.height = "100svh";
    document.body.appendChild(probe);
    var phone = window.matchMedia("(max-width: 767px)");
    var evaluatePin = function (force) {
      if (!band || !grid) return;
      var w = window.innerWidth, svh = probe.offsetHeight;
      if (!force && w === pinW && svh === pinSvh) return;
      pinW = w; pinSvh = svh;
      var top = headerEl ? headerEl.offsetHeight : 0;
      pinEl.style.setProperty("--pin-top", top + "px");
      pinEl.style.height = "";
      pinEl.classList.add("pin-on");
      var cs = window.getComputedStyle(band);
      var need = band.querySelector(".container").offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      // Inside a frame that is as tall as its whole page (no scrolling of its own) the viewport is taller
      // than the physical screen: pinning would have nothing to hold against, so stay unpinned there.
      var tallEmbed = window.self !== window.top && window.screen && window.screen.height && svh > window.screen.height * 1.25;
      var fits = need <= svh - top && !tallEmbed;
      if (fits) {
        var track = phone.matches;
        var dist = Math.round(svh * (track ? 2 : 1.3));
        pinEl.style.height = (band.offsetHeight + dist) + "px";
        var tiles = grid.children;
        pin = { top: top, dist: dist, track: track, docTop: 0, pitch: tiles.length > 1 ? tiles[1].offsetLeft - tiles[0].offsetLeft : 0 };
      } else {
        pinEl.classList.remove("pin-on");
        pin = null;
      }
      // pinned mode writes inline styles, the scrub without pinning uses --p: start each mode clean
      clearPut();
      parts = null;
      scrubs.forEach(function (it) { it.p = -1; it.done = null; it.el.style.removeProperty("--p"); });
      pinS = -1;
    };

    // Layout cache: page positions from the offset parent and offsets (so no transform counts), refreshed on
    // resize, load, font swap and any change of the page height. A scroll frame then reads only scrollY.
    var vh = window.innerHeight;
    var measure = function () {
      vh = window.innerHeight;
      var y = window.pageYOffset;
      if (pin) pin.docTop = pinEl.getBoundingClientRect().top + y;
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
    var apply = function (it, p) {
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
    };
    // ---- Pinned choreography ----
    // The scroll gives a target T. The value on screen S follows it with a time-based damping (a scrub with a
    // smoothing time): S += (T - S) * (1 - exp(-dt / tau)). A wheel notch plays as a short glide, a direction
    // change eases. The loop runs only while S still moves. Every frame writes transform, opacity or
    // stroke-dashoffset straight onto the few elements that change, and only when the value changed.
    // Story: a spotlight moves from tile 1 to tile 2 to tile 3, the tile in focus draws and counts across its
    // whole share, then all three return to full strength while the closing line lights up word by word, a hold.
    var TAU = 0.16;
    var smooth = function (a, b, v) { var t = (v - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
    var r4 = function (v) { return Math.round(v * 10000) / 10000; };
    // opacities and scales in steps of 1/200, too fine to see, so a slow glide skips frames with no visible change
    var r2 = function (v) { return Math.round(v * 200) / 200; };
    var written = [];
    var put = function (el, prop, val) {
      if (!el) return;
      var s = el.__put || (el.__put = {});
      if (s[prop] === val) return;
      if (!(prop in s)) written.push([el, prop]);
      s[prop] = val;
      el.style[prop] = val;
    };
    var clearPut = function () {
      written.forEach(function (w) { w[0].style[w[1]] = ""; w[0].__put = null; });
      written = [];
    };
    var parts = null;
    var collect = function () {
      var q = function (root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
      parts = { tiles: [], words: [], rail: pinEl.querySelector(".pin-rail span") };
      scrubs.forEach(function (it) {
        if (!it.row) { parts.line = it; parts.words = q(it.el, ".scrub-word"); return; }
        var t = it.el;
        parts.tiles[it.index] = { it: it, el: t, focus: t.querySelector(".pb-focus"), line: t.querySelector(".pb-line"), area: t.querySelector(".pb-area"), tip: t.querySelector(".pb-tip"), dot: t.querySelector(".pb-dot"), ring: t.querySelector(".pb-ring"), holes: q(t, ".pb-hole"), marks: q(t, ".pb-nums > g"), trails: q(t, ".pb-trail"), stain: t.querySelector(".pb-stain"), leaks: q(t, ".pb-leak"), bars: q(t, ".pb-bar") };
      });
    };
    var drawTile = function (t, q) {
      q = r4(q);
      if (q === t.q) return;
      t.q = q;
      var i, r;
      if (t.line) {
        // the curve draws at an even pace, its end dot rides the tip (cubic of the curve, reparameterised by length)
        var s = q, u = 0.9598 * s + 0.0583 * s * s - 0.0181 * s * s * s;
        put(t.line, "strokeDashoffset", String(r4(1 - s)));
        put(t.area, "opacity", String(r2(smooth(0.45, 1, q))));
        put(t.dot, "opacity", String(r2(smooth(0, 0.04, q))));
        put(t.ring, "opacity", String(r2(0.35 * smooth(0.8, 1, q))));
        var dx = 246 * u - 6 * u * u - 16 * u * u * u - 224, dy = 68 - 6 * u - 48 * u * u - 14 * u * u * u;
        put(t.tip, "transform", q >= 1 ? "none" : "translate(" + r4(dx) + "px, " + r4(dy) + "px)");
      }
      if (t.holes.length) {
        // five openings fade in on overlapping eased ramps, the fifth (the leak) last (opacity only: no SVG layout)
        for (i = 0; i < t.holes.length; i++) {
          r = smooth(i * 0.15, i * 0.15 + 0.32, q);
          put(t.holes[i], "opacity", String(r2(r)));
          // the small numbers under the openings are SVG text: any style change there costs a text layout, so they
          // fade in steps of 1/20 (still smooth at 11px) instead of every frame
          put(t.marks[i], "opacity", String(Math.round(r * 20) / 20));
        }
        // the dotted path from one opening to the next fades in (opacity on the path, the mask stays drawn)
        for (i = 0; i < t.trails.length; i++) put(t.trails[i], "opacity", String(r2(smooth(i * 0.15 + 0.14, i * 0.15 + 0.3, q))));
        put(t.stain, "opacity", String(r2(smooth(0, 0.15, q))));
        r = smooth(0.84, 1, q);
        t.leaks.forEach(function (l) { put(l, "opacity", String(r2(r))); });
      }
      // twelve bars rise as one wave
      for (i = 0; i < t.bars.length; i++) { r = smooth(i * 0.055, i * 0.055 + 0.4, q); put(t.bars[i], "strokeDashoffset", String(r4(1 - r))); }
      var done = q >= 1, it = t.it;
      if (done !== it.done) { it.done = done; it.el.classList.toggle("is-done", done); }
      it.nums.forEach(function (n) {
        var text = done ? n.parsed.text : n.parsed.at(n.parsed.num * smooth(0, 1, q));
        if (text !== n.shown) { n.shown = text; n.el.textContent = text; }
      });
    };
    var render = function (S) {
      if (!parts) collect();
      var track = pin.track;
      var tilesEnd = track ? 0.76 : 0.7, share = tilesEnd / 3;
      var lineFrom = track ? 0.8 : 0.74, lineTo = track ? 0.95 : 0.94;
      var slide = 0, focusAt;
      if (track) {
        for (var k = 0; k < 2; k++) slide += smooth(0.74, 1, (S - k * share) / share);
        focusAt = slide;
        put(grid, "transform", "translate3d(" + r4(-slide * pin.pitch) + "px, 0, 0)");
      } else {
        focusAt = Math.min(2, Math.max(0, S / share - 0.5));
      }
      var all = smooth(tilesEnd, tilesEnd + 0.06, S);
      parts.tiles.forEach(function (t, i) {
        var local = (S - i * share) / share;
        drawTile(t, clamp01(track ? local / 0.78 : local));
        var f = 1 - smooth(0.3, 0.7, Math.abs(focusAt - i));
        var op = 0.55 + 0.45 * f;
        op = op + (1 - op) * all;
        var sc = 1 + 0.02 * f * (1 - all);
        put(t.el, "opacity", String(r2(op)));
        sc = Math.round(sc * 2000) / 2000;
        put(t.el, "transform", sc === 1 ? "none" : "scale(" + sc + ")");
        put(t.focus, "opacity", String(r2(f * (1 - all))));
      });
      // closing line: each word fades in over the span of about three words
      var n = parts.words.length, W = Math.min(1, 3 / Math.max(1, n)), wp = clamp01((S - lineFrom) / (lineTo - lineFrom));
      parts.words.forEach(function (w, i) {
        var a = n > 1 ? i / (n - 1) * (1 - W) : 0;
        put(w, "opacity", String(r2(0.28 + 0.72 * smooth(a, a + W, wp))));
      });
      if (parts.line) {
        var lineDone = wp >= 1;
        if (lineDone !== parts.line.done) { parts.line.done = lineDone; parts.line.el.classList.toggle("is-done", lineDone); }
      }
      put(parts.rail, "transform", "scaleX(" + r4(S) + ")");
    };
    var pinS = -1, pinT = 0, pinLast = 0, pinRunning = false;
    var pinTick = function (now) {
      if (!pin) { pinRunning = false; return; }
      // a slow frame counts as at most two: after a hiccup the glide resumes instead of jumping ahead
      var dt = Math.min(0.034, Math.max(0, (now - pinLast) / 1000));
      pinLast = now;
      var d = pinT - pinS;
      // first frame: run the frame code once through a mid state (never painted) so its first real glide frame
      // does not pay for script compilation, then show the true state
      if (pinS < 0) { render(0.5); render(0.9); }
      if (pinS < 0 || Math.abs(d) < 0.0005) pinS = pinT;
      else pinS += d * (1 - Math.exp(-dt / TAU));
      render(pinS);
      if (pinS !== pinT) requestAnimationFrame(pinTick);
      else pinRunning = false;
    };
    var pinKick = function () { if (!pinRunning) { pinRunning = true; pinLast = window.performance.now(); requestAnimationFrame(pinTick); } };

    var scrollAt = null;
    var update = function () {
      var y = scrollAt === null ? window.pageYOffset : scrollAt;
      scrollAt = null;
      if (pin) {
        pinT = r4(clamp01((y - pin.docTop + pin.top) / pin.dist));
        if (pinT !== pinS) pinKick();
        return;
      }
      scrubs.forEach(function (it) {
        var top = it.docTop - y;
        var p = clamp01((it.from * vh - top) / ((it.from - it.to) * vh));
        if (it.inRow && it.mates.length > 1) {
          var span = 0.6, step = (1 - span) / (it.mates.length - 1);
          p = clamp01((p - it.index * step) / span);
        }
        apply(it, p);
      });
    };
    var scrubQueued = false;
    var frame = function () { scrubQueued = false; update(); };
    // read the position when the frame is queued (scroll event, observers: layout is clean there), not in the frame
    var onScroll = function () { scrollAt = window.pageYOffset; if (!scrubQueued) { scrubQueued = true; requestAnimationFrame(frame); } };
    var onResize = function () { evaluatePin(false); measure(); onScroll(); };
    var onReflow = function () { evaluatePin(true); measure(); onScroll(); };
    var listening = false, nearCount = 0;
    var listen = function (on) {
      if (on === listening) return;
      listening = on;
      var fn = on ? "addEventListener" : "removeEventListener";
      window[fn]("scroll", onScroll, { passive: true });
      if (pinEl) pinEl.classList.toggle("pin-live", on);
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
    evaluatePin(true);
    measure();
    update();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("load", onReflow);
    if ("ResizeObserver" in window) new ResizeObserver(function () { measure(); onScroll(); }).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onReflow);
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
