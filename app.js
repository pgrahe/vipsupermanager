const toast = document.querySelector("#toast");
const settingsOverlay = document.querySelector("#settingsOverlay");
const settingsClose = document.querySelector("#settingsClose");
const settingsCancel = document.querySelector("#settingsCancel");
const settingsSave = document.querySelector("#settingsSave");
const themeStatus = document.querySelector("#themeStatus");
const themeButtons = [...document.querySelectorAll("[data-theme-option]")];
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function resolveTheme(mode) {
  if (mode === "system") return systemTheme.matches ? "dark" : "light";
  return mode === "dark" ? "dark" : "light";
}

function applyTheme(mode = localStorage.getItem("opsnight-theme") || "light") {
  const resolvedTheme = resolveTheme(mode);
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.classList.toggle("light", resolvedTheme !== "dark");
  document.documentElement.dataset.themeMode = mode;
  localStorage.setItem("opsnight-theme", mode);

  themeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.themeOption === mode);
  });

  if (themeStatus) {
    const label = mode === "system" ? `Sistema (${resolvedTheme === "dark" ? "oscuro" : "claro"})` : mode === "dark" ? "Oscuro" : "Claro";
    themeStatus.textContent = `Tema ${label.toLowerCase()} activo.`;
  }
}

function openSettings() {
  if (!settingsOverlay) return;
  settingsOverlay.hidden = false;
  requestAnimationFrame(() => settingsOverlay.classList.add("open"));
}

function closeSettings() {
  if (!settingsOverlay) return;
  settingsOverlay.classList.remove("open");
  setTimeout(() => {
    settingsOverlay.hidden = true;
  }, 220);
}

function bindActionButtons(root = document) {
  root.querySelectorAll(".js-action").forEach((button) => {
    if (button.dataset.boundAction) return;
    button.dataset.boundAction = "true";
    button.addEventListener("click", () => showToast("Accion registrada en OPSNIGHT."));
  });
}

function switchPage(page, scope) {
  document.querySelectorAll(`.${scope}-page`).forEach((section) => {
    section.classList.toggle("active", section.dataset.page === page);
  });

  const navSelector = scope === "desktop" ? ".desktop-sidebar a[data-page]" : ".mobile-bottom-nav button[data-page]";
  document.querySelectorAll(navSelector).forEach((item) => {
    item.classList.toggle("active", item.dataset.page === page);
  });
}


function switchStaff(staff) {
  document.querySelectorAll("[data-staff-detail]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.staffDetail === staff);
  });
  document.querySelectorAll(".employee-row[data-staff]").forEach((row) => {
    row.classList.toggle("active", row.dataset.staff === staff);
  });
  document.querySelectorAll("[data-staff-mobile-detail]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.staffMobileDetail === staff);
  });
  const label = { carlos: "Carlos R.", elena: "Elena M.", juan: "Juan G.", sofia: "Sofia L." }[staff] || "empleado";
  showToast(`Perfil abierto: ${label}.`);
}

function switchVenue(venue) {
  document.querySelectorAll("[data-venue-detail]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.venueDetail === venue);
  });
  document.querySelectorAll("[data-venue-row]").forEach((row) => {
    row.classList.toggle("active", row.dataset.venueRow === venue);
  });
  const label = { kapital: "Kapital Madrid", pacha: "Pacha Ibiza", opium: "Opium Barcelona" }[venue] || "local";
  showToast(`Detalle abierto: ${label}.`);
}

applyTheme();

themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.themeOption));
});

systemTheme.addEventListener("change", () => {
  if (document.documentElement.dataset.themeMode === "system") applyTheme("system");
});

document.querySelectorAll(".settings-trigger").forEach((button) => {
  button.addEventListener("click", openSettings);
});

[settingsClose, settingsCancel].forEach((button) => {
  button?.addEventListener("click", closeSettings);
});

settingsSave?.addEventListener("click", () => {
  closeSettings();
  showToast("Ajustes guardados correctamente.");
});

settingsOverlay?.addEventListener("click", (event) => {
  if (event.target === settingsOverlay) closeSettings();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && settingsOverlay?.classList.contains("open")) closeSettings();
});

document.querySelectorAll(".mobile-bottom-nav button[data-page]").forEach((button) => {
  button.addEventListener("click", () => switchPage(button.dataset.page, "mobile"));
});

document.querySelectorAll(".desktop-sidebar a[data-page]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    switchPage(link.dataset.page, "desktop");
  });
});


document.querySelectorAll("[data-staff]").forEach((button) => {
  button.addEventListener("click", () => switchStaff(button.dataset.staff));
});

document.querySelectorAll(".venue-detail-button[data-venue]").forEach((button) => {
  button.addEventListener("click", () => switchVenue(button.dataset.venue));
});

document.querySelectorAll(".sidebar-footer a").forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

bindActionButtons();
