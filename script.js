const header = document.querySelector("[data-header]");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const revealSections = document.querySelectorAll("[data-reveal-section]");
const themeDebug = document.querySelector("[data-theme-debug]");
const heroVisualFrame = document.querySelector(".blob-frame");

function setupScrollReveals() {
  if (
    revealSections.length > 0 &&
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.body.classList.add("has-scroll-reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const section = entry.target;
          section.classList.add("is-visible");
          revealObserver.unobserve(section);
        });
      },
      {
        rootMargin: "0px 0px -14% 0px",
        threshold: 0.22
      }
    );

    revealSections.forEach((section) => {
      section.querySelectorAll("[data-reveal]").forEach((item) => {
        const delay = Number(item.getAttribute("data-reveal-delay") || 0);
        item.style.setProperty("--reveal-delay", delay);
      });

      revealObserver.observe(section);
    });
    return;
  }

  revealSections.forEach((section) => {
    section.classList.add("is-visible");
  });
}

function setupAnchorScrolling() {
  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerOffset = header ? header.offsetHeight + 12 : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    });
  });
}

function setupContactForm() {
  if (!contactForm || !formNote) {
    return;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fields = Array.from(contactForm.querySelectorAll("input, select"));
    const invalidField = fields.find((field) => !field.checkValidity());
    const submitButton = contactForm.querySelector('button[type="submit"]');

    formNote.classList.remove("is-success", "is-error");

    if (invalidField) {
      formNote.textContent = "Complete all fields with valid work details to continue.";
      formNote.classList.add("is-error");
      invalidField.focus();
      return;
    }

    const endpoint = contactForm.getAttribute("action");

    if (!endpoint) {
      formNote.textContent = "Form endpoint is missing.";
      formNote.classList.add("is-error");
      return;
    }

    const originalButtonText = submitButton ? submitButton.textContent : "";

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending...";
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      formNote.textContent = "Thanks. Your pilot request was sent successfully.";
      formNote.classList.add("is-success");
      contactForm.reset();
    } catch (error) {
      formNote.textContent = "Submission failed. Try again in a moment or email us directly.";
      formNote.classList.add("is-error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}

function normalizeHexColor(value) {
  const color = value.trim();

  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.toLowerCase();
  }

  const rgbMatch = color.match(/^rgba?\(([^)]+)\)$/i);

  if (!rgbMatch) {
    return "#000000";
  }

  const [r, g, b] = rgbMatch[1]
    .split(",")
    .slice(0, 3)
    .map((channel) => Math.max(0, Math.min(255, Number.parseInt(channel.trim(), 10) || 0)));

  return `#${[r, g, b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function hexToRgbChannels(hex) {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

function getContrastInk(hex) {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.6 ? "#041017" : "#f6fbff";
}

function syncHeroVisualAccent(accent) {
  if (!heroVisualFrame?.contentWindow) {
    return;
  }

  heroVisualFrame.contentWindow.postMessage(
    {
      type: "aquashield-accent",
      accent
    },
    "*"
  );
}

function setupThemeDebug() {
  if (!themeDebug) {
    return;
  }

  const root = document.documentElement;
  const computed = getComputedStyle(root);
  const accentInput = themeDebug.querySelector('[data-theme-input="accent"]');
  const accentValue = themeDebug.querySelector('[data-theme-value="accent"]');
  const resetButton = themeDebug.querySelector("[data-theme-reset]");
  const toggleButton = themeDebug.querySelector("[data-theme-toggle]");
  const themeBody = themeDebug.querySelector("[data-theme-body]");

  if (!accentInput || !accentValue) {
    return;
  }

  const defaults = {
    accent: normalizeHexColor(computed.getPropertyValue("--accent"))
  };

  const deriveColorSet = (accent) => {
    const normalized = normalizeHexColor(accent);
    const normalizedBody = normalized.replace("#", "");
    const r = Number.parseInt(normalizedBody.slice(0, 2), 16);
    const g = Number.parseInt(normalizedBody.slice(2, 4), 16);
    const b = Number.parseInt(normalizedBody.slice(4, 6), 16);
    const brighten = (channel, amount) => Math.max(0, Math.min(255, Math.round(channel + (255 - channel) * amount)));

    const bright = `#${[brighten(r, 0.38), brighten(g, 0.38), brighten(b, 0.38)]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")}`;
    const light = `#${[brighten(r, 0.68), brighten(g, 0.68), brighten(b, 0.68)]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")}`;

    return {
      accent: normalized,
      bright,
      light
    };
  };

  const updateTheme = (accentColor, persist = true) => {
    const { accent, bright, light } = deriveColorSet(accentColor);

    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-rgb", hexToRgbChannels(accent));
    root.style.setProperty("--accent-bright", bright);
    root.style.setProperty("--accent-bright-rgb", hexToRgbChannels(bright));
    root.style.setProperty("--accent-light", light);
    root.style.setProperty("--accent-light-rgb", hexToRgbChannels(light));
    root.style.setProperty("--accent-ink", getContrastInk(accent));
    root.style.setProperty("--border-strong", `rgb(${hexToRgbChannels(accent)} / 0.24)`);

    accentInput.value = accent;
    accentValue.textContent = accent;

    if (persist) {
      window.localStorage.setItem("aquashield-theme-debug", accent);
    }

    syncHeroVisualAccent(accent);
  };

  const storedTheme = window.localStorage.getItem("aquashield-theme-debug");

  if (storedTheme) {
    try {
      updateTheme(storedTheme, false);
    } catch {
      updateTheme(defaults.accent, false);
    }
  } else {
    updateTheme(defaults.accent, false);
  }

  accentInput.addEventListener("input", () => {
    updateTheme(accentInput.value);
  });

  resetButton?.addEventListener("click", () => {
    window.localStorage.removeItem("aquashield-theme-debug");
    updateTheme(defaults.accent, false);
  });

  heroVisualFrame?.addEventListener("load", () => {
    syncHeroVisualAccent(accentInput.value);
  });

  const setCollapsed = (collapsed, persist = true) => {
    themeDebug.classList.toggle("is-collapsed", collapsed);

    if (toggleButton) {
      toggleButton.textContent = collapsed ? "Show" : "Hide";
      toggleButton.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }

    if (themeBody) {
      themeBody.hidden = collapsed;
    }

    if (persist) {
      window.localStorage.setItem("aquashield-theme-debug-collapsed", collapsed ? "true" : "false");
    }
  };

  const storedCollapsed = window.localStorage.getItem("aquashield-theme-debug-collapsed") === "true";
  setCollapsed(storedCollapsed, false);

  toggleButton?.addEventListener("click", () => {
    setCollapsed(!themeDebug.classList.contains("is-collapsed"));
  });
}

setupScrollReveals();
setupAnchorScrolling();
setupContactForm();
// setupThemeDebug();
