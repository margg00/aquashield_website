/* AquaShield site script. No dependencies. Loaded with defer. */
(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Language by browser ----------
  // There is no language switch in the header. On a visitor's first page view (no stored choice), an English
  // page with a German or French translation (its own hreflang alternate links) sends a visitor whose browser
  // prefers German or French there once, with location.replace. The choice is stored, so it never happens
  // again, and a click on a footer language link stores that language, so a manual choice always wins.
  // Never for crawlers, never when the visit came from another page of this site (that includes the other
  // language versions), and only ever from English, so a redirect cannot loop.
  var LANG_KEY = "aquashield-lang";
  var readLang = function () { try { return window.localStorage.getItem(LANG_KEY); } catch (err) { return null; } };
  var saveLang = function (v) { try { window.localStorage.setItem(LANG_KEY, v); } catch (err) { /* storage blocked: no memory */ } };
  document.querySelectorAll(".lang-switch-footer a[hreflang]").forEach(function (a) {
    a.addEventListener("click", function () { saveLang(a.getAttribute("hreflang")); });
  });
  var langTarget = (function () {
    var pageLang = (document.documentElement.lang || "en").slice(0, 2).toLowerCase();
    if (readLang()) return null;
    var ua = navigator.userAgent || "";
    if (/bot|crawl|spider|slurp|mediapartners|lighthouse|headless|preview|facebookexternalhit|embedly|pinterest|vkshare|w3c_validator|ia_archiver/i.test(ua)) return null;
    var fromSite = false;
    try { fromSite = Boolean(document.referrer) && new URL(document.referrer).origin === window.location.origin; } catch (err) { fromSite = false; }
    var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    var want = String(prefs[0] || "").slice(0, 2).toLowerCase();
    saveLang(pageLang);
    if (fromSite || pageLang !== "en" || (want !== "de" && want !== "fr")) return null;
    var alt = document.querySelector('link[rel="alternate"][hreflang="' + want + '"]');
    var own = document.querySelector('link[rel="alternate"][hreflang="en"]');
    if (!alt || !own) return null;
    var altUrl, ownUrl;
    try { altUrl = new URL(alt.href); ownUrl = new URL(own.href); } catch (err) { return null; }
    // The same page in the other language, on whatever host and folder this copy of the site is served from
    // (the alternates name the live domain, a local preview lives elsewhere).
    var here = window.location.pathname;
    var hereDir = here.replace(/index\.html$/, "");
    var target;
    if (hereDir.slice(-ownUrl.pathname.length) === ownUrl.pathname) {
      target = hereDir.slice(0, hereDir.length - ownUrl.pathname.length) + altUrl.pathname;
      if (here !== hereDir && /\/$/.test(target)) target += "index.html";
      target = window.location.protocol === "file:" ? "file://" + target : window.location.origin + target;
    } else if (altUrl.origin === window.location.origin) {
      target = altUrl.href.split("#")[0].split("?")[0];
    } else {
      return null;
    }
    saveLang(want);
    return target + window.location.search + window.location.hash;
  })();
  if (langTarget) { window.location.replace(langTarget); return; }

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
      // counts up from 60 percent of the value, so no reading near zero is ever on screen
      el.textContent = parsed.at(parsed.num * (0.6 + 0.4 * ease(p)));
      if (p < 1) requestAnimationFrame(step);
      else { el.textContent = parsed.text; el.classList.remove("is-counting"); el.removeAttribute("data-counting"); }
    };
    requestAnimationFrame(step);
  };

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
    [".step", ".dc-vis"],
    [".dc-path", ""],
    [".hm-play", ""],
    [".pf-stage", ""],
    [".anchor-stat", ".anchor-bar"],
    [".ins-timeline", "svg"],
    [".ins-book-visual", ".media"],
    [".chapter", ".chapter-line, .chapter-node"],
    [".proof-strip", ".proof-cells"]
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
    // Proof strip: its values stay hidden until it plays (CSS keys on is-armed), so only when the play can run.
    if (!reducedMotion) document.querySelectorAll(".proof-strip").forEach(function (el) { el.classList.add("is-armed"); });
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
      document.querySelectorAll(".stat-value, [data-count]").forEach(function (el) {
        if (el.closest("[data-scrub]")) return;
        if (inHero(el)) heroCounts.push(el);
        else items.push({ el: el, parts: [el], kind: "count", dur: el.closest("[data-proof]") ? 1400 : 2000 });
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

  // ---------- Scroll-scrubbed and pinned sections (home band, data centers leak cable band) ----------
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

    // Pinned sections: every [data-pin] is a tall wrapper around one section, the section is sticky inside it, so
    // the page holds while the visitor scrolls through the wrapper's extra height (native scroll, nothing is
    // intercepted). One progress P (0 to 1) per section runs its story, then a short hold before release.
    // data-pin names the story ("band" by default, the home band). Used only when the pinned section fits the
    // small viewport height (100svh, so the address bar never moves it), re-checked when the width or that height
    // changes. Otherwise the per-element scrub above applies to its [data-scrub] elements.
    var headerEl = document.querySelector(".site-header");
    var pinW = -1, pinSvh = -1;
    var probe = document.createElement("div");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100vh;visibility:hidden;pointer-events:none";
    probe.style.height = "100svh";
    document.body.appendChild(probe);
    var phone = window.matchMedia("(max-width: 767px)");

    var TAU = 0.16;
    var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var smooth = function (a, b, v) { var t = (v - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
    var r4 = function (v) { return Math.round(v * 10000) / 10000; };
    // opacities and scales in steps of 1/200, too fine to see, so a slow glide skips frames with no visible change
    var r2 = function (v) { return Math.round(v * 200) / 200; };
    // Each section writes transform, opacity or stroke-dashoffset straight onto the few elements that change, and
    // only when the value changed. It keeps a list of what it wrote, so a change of mode starts clean.
    var makePut = function (g) {
      return function (el, prop, val) {
        if (!el) return;
        var s = el.__put || (el.__put = {});
        if (s[prop] === val) return;
        if (!(prop in s)) g.written.push([el, prop]);
        s[prop] = val;
        el.style[prop] = val;
      };
    };
    var clearPut = function (g) {
      g.written.forEach(function (w) { w[0].style[w[1]] = ""; w[0].__put = null; });
      g.written = [];
    };

    // ---- Home band: "Water is the one building system you cannot see" ----
    // Desktop and tablet: tiles in one row, staggered. Phones: the tiles slide sideways, one in focus at a time.
    // Story: a spotlight moves from tile 1 to tile 2 to tile 3, the tile in focus draws and counts across its
    // whole share, then all three return to full strength while the closing line lights up word by word, a hold.
    var bandTile = function (put, t, q) {
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
      // the tile's number is invisible until the tile comes into focus, then fades in while it counts from 60 percent
      it.nums.forEach(function (n) {
        var text = done ? n.parsed.text : n.parsed.at(n.parsed.num * (0.6 + 0.4 * smooth(0, 1, q)));
        if (text !== n.shown) { n.shown = text; n.el.textContent = text; }
        put(n.el, "opacity", String(r2(smooth(0.04, 0.3, q))));
      });
    };
    var bandKind = {
      setup: function (g) {
        g.grid = g.band.querySelector("[data-scrub-row]");
        return Boolean(g.band.classList.contains("problem-band") && g.grid);
      },
      dist: function (g, svh) {
        g.track = phone.matches;
        return Math.round(svh * (g.track ? 2 : 1.3));
      },
      layout: function (g, pin) {
        var tiles = g.grid.children;
        pin.track = g.track;
        pin.pitch = tiles.length > 1 ? tiles[1].offsetLeft - tiles[0].offsetLeft : 0;
      },
      collect: function (g) {
        var q = function (root, sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
        var parts = { tiles: [], words: [], rail: g.el.querySelector(".pin-rail span") };
        g.scrubs.forEach(function (it) {
          if (!it.row) { parts.line = it; parts.words = q(it.el, ".scrub-word"); return; }
          var t = it.el;
          parts.tiles[it.index] = { it: it, el: t, focus: t.querySelector(".pb-focus"), line: t.querySelector(".pb-line"), area: t.querySelector(".pb-area"), tip: t.querySelector(".pb-tip"), dot: t.querySelector(".pb-dot"), ring: t.querySelector(".pb-ring"), holes: q(t, ".pb-hole"), marks: q(t, ".pb-nums > g"), trails: q(t, ".pb-trail"), stain: t.querySelector(".pb-stain"), leaks: q(t, ".pb-leak"), bars: q(t, ".pb-bar") };
        });
        return parts;
      },
      render: function (g, S) {
        var put = g.put, parts = g.parts, pin = g.pin, grid = g.grid;
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
          bandTile(put, t, clamp01(track ? local / 0.78 : local));
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
      }
    };

    // ---- Data centers: "Floor leak cables tell you after the fact" ----
    // Two cards of four steps. Pinned, both advance together row by row: step 1 lights up (0 to 0.2), step 2
    // (0.2 to 0.42), step 3 (0.42 to 0.64), step 4 (0.64 to 0.88), where the cable card ends dark and red and the
    // AquaShield card lit and calm, then a hold. Each rail fills continuously from node to node. Steps not yet
    // reached rest at 35 percent, reached steps stay at full strength. Never pinned on phones (the stacked cards are
    // taller than the screen): there each card runs the same story on its own scrub (data-scrub="85 30").
    var DC_RAMPS = [[0.02, 0.18], [0.17, 0.38], [0.39, 0.6], [0.61, 0.84]];
    var DC_MIDS = DC_RAMPS.map(function (r) { return (r[0] + r[1]) / 2; });
    var dcCard = function (g, el) {
      var q = function (sel) { return Array.prototype.slice.call(el.querySelectorAll(sel)); };
      var end = el.querySelector(".dc-step-end");
      return { steps: q(".dc-steps > li"), rings: q(".dc-ring"), segs: q(".dc-seg"), endBg: el.querySelector(".dc-end-bg"), endNode: end && end.querySelector(".dc-node"), glow: el.querySelector(".dc-seq-glow"), s: -1 };
    };
    var dcDraw = function (g, c, S) {
      S = r4(S);
      if (S === c.s) return;
      c.s = S;
      var put = g.put, i, lit;
      for (i = 0; i < c.steps.length; i++) {
        lit = smooth(DC_RAMPS[i][0], DC_RAMPS[i][1], S);
        put(c.steps[i], "opacity", String(r2(0.35 + 0.65 * lit)));
        put(c.rings[i], "opacity", String(r2(lit)));
      }
      for (i = 0; i < c.segs.length; i++) {
        var f = r4(clamp01((S - DC_MIDS[i]) / (DC_MIDS[i + 1] - DC_MIDS[i])));
        put(c.segs[i], "transform", f >= 1 ? "none" : "scaleY(" + f + ")");
      }
      lit = smooth(0.64, 0.86, S);
      put(c.endBg, "opacity", String(r2(lit)));
      var sc = Math.round((0.82 + 0.18 * lit) * 2000) / 2000;
      put(c.endNode, "transform", sc === 1 ? "none" : "scale(" + sc + ")");
      put(c.glow, "opacity", String(r2(smooth(0.68, 0.88, S))));
    };
    var dcKind = {
      setup: function (g) {
        g.cards = [];
        g.scrubs.forEach(function (it) {
          if (!it.el.classList.contains("dc-seq")) return;
          var c = dcCard(g, it.el);
          g.cards.push(c);
          it.draw = function (p) { dcDraw(g, c, p); };
        });
        return g.cards.length > 0;
      },
      dist: function (g, svh) { return phone.matches ? 0 : Math.round(svh * 1.2); },
      layout: function () {},
      collect: function (g) {
        g.cards.forEach(function (c) { c.s = -1; });
        return { rail: g.el.querySelector(".pin-rail span") };
      },
      render: function (g, S) {
        g.cards.forEach(function (c) { dcDraw(g, c, S); });
        g.put(g.parts.rail, "transform", "scaleX(" + r4(S) + ")");
      }
    };

    var KINDS = { band: bandKind, dc: dcKind };
    var groups = [];
    document.querySelectorAll("[data-pin]").forEach(function (el) {
      var kind = KINDS[el.getAttribute("data-pin") || "band"];
      var band = el.firstElementChild;
      if (!kind || !band) return;
      var g = { el: el, band: band, kind: kind, written: [], pin: null, parts: null, S: -1, T: 0, last: 0, running: false, near: 0 };
      g.put = makePut(g);
      g.scrubs = scrubs.filter(function (it) { return el.contains(it.el); });
      if (!kind.setup(g)) return;
      g.scrubs.forEach(function (it) { it.group = g; });
      g.frame = function (now) { pinTick(g, now); };
      groups.push(g);
    });

    var evaluateGroup = function (g, svh, top, tallEmbed) {
      g.el.style.setProperty("--pin-top", top + "px");
      g.el.style.height = "";
      var dist = g.kind.dist(g, svh);
      g.el.classList.add("pin-on");
      var cs = window.getComputedStyle(g.band);
      var need = g.band.querySelector(".container").offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
      var fits = dist > 0 && need <= svh - top && !tallEmbed;
      if (fits) {
        g.el.style.height = (g.band.offsetHeight + dist) + "px";
        g.pin = { top: top, dist: dist, docTop: 0 };
        g.kind.layout(g, g.pin);
      } else {
        g.el.classList.remove("pin-on");
        g.pin = null;
      }
      // pinned mode writes inline styles, the scrub without pinning uses --p (or draws): start each mode clean
      clearPut(g);
      g.parts = null;
      if (g.cards) g.cards.forEach(function (c) { c.s = -1; });
      g.scrubs.forEach(function (it) { it.p = -1; it.done = null; it.el.style.removeProperty("--p"); it.nums.forEach(function (n) { n.op = null; n.el.style.opacity = ""; }); });
      g.S = -1;
    };
    var evaluatePin = function (force) {
      if (!groups.length) return;
      var w = window.innerWidth, svh = probe.offsetHeight;
      if (!force && w === pinW && svh === pinSvh) return;
      pinW = w; pinSvh = svh;
      var top = headerEl ? headerEl.offsetHeight : 0;
      // Inside a frame that is as tall as its whole page (no scrolling of its own) the viewport is taller
      // than the physical screen: pinning would have nothing to hold against, so stay unpinned there.
      var tallEmbed = window.self !== window.top && window.screen && window.screen.height && svh > window.screen.height * 1.25;
      groups.forEach(function (g) { evaluateGroup(g, svh, top, tallEmbed); });
    };

    // Layout cache: page positions from the offset parent and offsets (so no transform counts), refreshed on
    // resize, load, font swap and any change of the page height. A scroll frame then reads only scrollY.
    var vh = window.innerHeight;
    var measure = function () {
      vh = window.innerHeight;
      var y = window.pageYOffset;
      groups.forEach(function (g) { if (g.pin) g.pin.docTop = g.el.getBoundingClientRect().top + y; });
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
    var apply = function (it, p) {
      p = Math.round(p * 10000) / 10000;
      if (p === it.p) return;
      it.p = p;
      if (it.draw) { it.draw(p); return; }
      it.el.style.setProperty("--p", String(p));
      var done = p >= 1;
      if (done !== it.done) { it.done = done; it.el.classList.toggle("is-done", done); }
      // the number stays invisible at the start, fades in as it counts, and counts from 60 percent of its value
      it.nums.forEach(function (n) {
        var text = done ? n.parsed.text : n.parsed.at(n.parsed.num * (0.6 + 0.4 * ease(p)));
        if (text !== n.shown) { n.shown = text; n.el.textContent = text; }
        var o = done ? "" : String(r2(smooth(0.05, 0.35, p)));
        if (o !== n.op) { n.op = o; n.el.style.opacity = o; }
      });
    };
    // ---- Pinned choreography ----
    // The scroll gives a target T. The value on screen S follows it with a time-based damping (a scrub with a
    // smoothing time): S += (T - S) * (1 - exp(-dt / tau)). A wheel notch plays as a short glide, a direction
    // change eases. The loop runs only while S still moves.
    var render = function (g, S) {
      if (!g.parts) g.parts = g.kind.collect(g);
      g.kind.render(g, S);
    };
    var pinTick = function (g, now) {
      if (!g.pin) { g.running = false; return; }
      // a slow frame counts as at most two: after a hiccup the glide resumes instead of jumping ahead
      var dt = Math.min(0.034, Math.max(0, (now - g.last) / 1000));
      g.last = now;
      var d = g.T - g.S;
      // first frame: run the frame code once through a mid state (never painted) so its first real glide frame
      // does not pay for script compilation, then show the true state
      if (g.S < 0) { render(g, 0.5); render(g, 0.9); }
      if (g.S < 0 || Math.abs(d) < 0.0005) g.S = g.T;
      else g.S += d * (1 - Math.exp(-dt / TAU));
      render(g, g.S);
      if (g.S !== g.T) requestAnimationFrame(g.frame);
      else g.running = false;
    };
    var pinKick = function (g) { if (!g.running) { g.running = true; g.last = window.performance.now(); requestAnimationFrame(g.frame); } };

    var scrollAt = null;
    var update = function () {
      var y = scrollAt === null ? window.pageYOffset : scrollAt;
      scrollAt = null;
      groups.forEach(function (g) {
        if (!g.pin) return;
        g.T = r4(clamp01((y - g.pin.docTop + g.pin.top) / g.pin.dist));
        if (g.T !== g.S) pinKick(g);
      });
      scrubs.forEach(function (it) {
        if (it.group && it.group.pin) return;
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
    };
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (Boolean(en.target.__scrubNear) === en.isIntersecting) return;
        en.target.__scrubNear = en.isIntersecting;
        en.target.classList.toggle("is-near", en.isIntersecting);
        var d = en.isIntersecting ? 1 : -1;
        nearCount += d;
        var g = en.target.__scrubGroup;
        if (g) { g.near += d; g.el.classList.toggle("pin-live", g.near > 0); }
      });
      listen(nearCount > 0);
      measure();
      onScroll();
    }, { rootMargin: "50% 0px" });
    scrubs.forEach(function (it) { it.el.__scrubGroup = it.group || null; so.observe(it.el); });
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
