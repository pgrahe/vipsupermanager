const toast = document.querySelector("#toast");
const settingsOverlay = document.querySelector("#settingsOverlay");
const settingsClose = document.querySelector("#settingsClose");
const settingsCancel = document.querySelector("#settingsCancel");
const settingsSave = document.querySelector("#settingsSave");
const themeStatus = document.querySelector("#themeStatus");
const themeButtons = [...document.querySelectorAll("[data-theme-option]")];
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

const staffData = {
  carlos: {
    title: "Carlos R.", initials: "CR", tags: ["Interno", "Barra Central", "Online", "Riesgo medio"], subtitle: "Perfil empleado · Barra Central", mainLabel: "Rendimiento barra central", main: "€1,840/h", mainText: "312 tickets · ticket medio €18.40 · velocidad media 18s · 98.7% cobros OK.", riskLabel: "Riesgo auditoría", risk: "Medio", riskText: "12 voids · 3 cajón abierto.", shiftCost: "€80", shiftText: "22:30–06:00 · fichaje NFC.", badge: "Live", sideTitle: "Fraude & control", sideAction: "Abrir timeline",
    detail: [["Permisos", "POS, cobro, cajón, descuentos limitados", "Editable"], ["Conectado", "Terminal Barra Central · iPad POS 03", "Online"], ["Última acción", "Void ticket #B1-1842 · motivo: error producto", "02:28"], ["Ventas", "€14,720 · 800 bebidas · margen 82.1%", "OK"]],
    risks: [["Voids", "12 eventos · €420 acumulado", "Medio"], ["Cajón abierto", "3 eventos · 2 con venta asociada", "Revisar"], ["Invitaciones", "0 fuera de política", "OK"]],
  },
  elena: {
    title: "Elena M.", initials: "EM", tags: ["Interna", "VIP V1-V6", "Online", "Upsell +14%"], subtitle: "Perfil empleado · VIP V1-V6", mainLabel: "Rendimiento VIP", main: "€2,120/h", mainText: "6 mesas activas · upsell +14% · mínimos recuperados €2,840 · 0 no-shows sin gestionar.", riskLabel: "Satisfacción sala", risk: "96%", riskText: "Notas internas cumplidas.", shiftCost: "€80", shiftText: "23:00–06:00 · zona VIP.", badge: "Live", sideTitle: "VIP intelligence", sideAction: "Ver mesas",
    detail: [["Permisos", "VIP, reservas, notas cliente, descuentos manager", "Editable"], ["Conectada", "Mobile VIP · zona V1-V6", "Online"], ["Última acción", "Upsell pack champagne V4", "02:31"], ["Ventas influenciadas", "€18,240 · margen 71.4%", "OK"]],
    risks: [["Mesa inactiva", "V2 · 28 minutos sin pedir", "Acción"], ["Mínimo pendiente", "€1,860 entre V2 y V5", "Alto"], ["Notas cliente", "4 notas aplicadas correctamente", "OK"]],
  },
  juan: {
    title: "Juan G.", initials: "JG", tags: ["Externo", "Runner VIP", "BDS", "SLA 92%"], subtitle: "Perfil empleado · Runner VIP", mainLabel: "Rendimiento runner", main: "18", mainText: "Entregas VIP · tiempo medio BDS 03:12 · 2 incidencias resueltas.", riskLabel: "Pedidos en ruta", risk: "3", riskText: "V4, V6, shisha station.", shiftCost: "€80", shiftText: "23:30–06:30 · runner VIP.", badge: "BDS", sideTitle: "Operativa BDS", sideAction: "Abrir cola",
    detail: [["Permisos", "BDS, entregas, incidencias, reposición interna", "Editable"], ["Conectado", "Runner app · dispositivo RG-02", "Online"], ["Última acción", "Entregado combo V6 · firma staff", "02:35"], ["SLA", "92% entregas dentro de objetivo", "OK"]],
    risks: [["Preparando", "2 tickets VIP · office", "Live"], ["En ruta", "3 pedidos · ETA 04:20", "OK"], ["Incidencias", "1 reposición Red Bull", "Acción"]],
  },
  sofia: {
    title: "Sofia L.", initials: "SL", tags: ["Interna", "Office", "OCR", "Finanzas"], subtitle: "Perfil empleado · Office", mainLabel: "Office & finanzas", main: "2 OCR", mainText: "4 ajustes de coste · 3 pedidos proveedor · 0 descuadres críticos.", riskLabel: "Stock revisado", risk: "€28.4K", riskText: "Almacén central y VIP office.", shiftCost: "€80", shiftText: "22:00–05:30 · office.", badge: "Office", sideTitle: "Supply chain", sideAction: "Ver OCR",
    detail: [["Permisos", "OCR, proveedores, stock, costes y cierre parcial", "Editable"], ["Conectada", "Backoffice · MacBook Office", "Online"], ["Última acción", "Ajuste coste Tanqueray +7.4%", "02:11"], ["Impacto margen", "Escandallos recalculados para 12 productos", "OK"]],
    risks: [["Albaranes", "2 procesados · 1 pendiente revisión", "96%"], ["Subida coste", "Tanqueray +7.4% vs referencia", "Alerta"], ["Pedido rápido", "Red Bull y Moët programados", "06:00"]],
  },
};

const sharedStaffModules = {
  carlos: {
    costEngine: [["Modelo salarial", "Mixto: €80 noche + 2% comisión barra", "Activo"], ["Coste en tiempo real", "€64.20 acumulado · ETA cierre €96.40", "Live"], ["Horas extra", "0.5h previstas si sale 06:30", "Aviso"], ["Recargo festivo/nocturno", "+12% desde 02:00", "Aplicado"], ["Bonus/Penalización", "+€18 bonus velocidad · -€0 penalización", "OK"], ["Límite legal", "Máx. 8h turno · descanso mínimo 12h", "OK"]],
    scheduling: [["Turno evento", "Sábado Main Room · 22:30-06:00", "Asignado"], ["Vacaciones", "14 días disponibles · 0 solicitudes", "OK"], ["Ausencias", "0 no-show · 0 baja médica", "OK"], ["Festivo regional", "Recargo configurable Madrid", "+12%"], ["Cumplimiento", "Descanso mínimo y horas semanales dentro de límite", "OK"]],
    geoFraud: [["Fichaje entrada", "22:27 · GPS dentro de zona", "OK"], ["Fichaje salida", "Pendiente", "Live"], ["Método", "NFC + QR local obligatorio", "Activo"], ["Antifraude", "0 fichajes falsos · 0 abandono detectado", "OK"], ["Retrasos", "0 min", "OK"]],
    profile: [["DNI", "***4821L", "Verificado"], ["Seguridad Social", "Alta activa", "OK"], ["IBAN", "ES12 **** 1842", "Validado"], ["Contacto", "+34 *** 420 · carlos@staff.local", "OK"], ["Tipo", "Interno · Barra", "Activo"], ["Documentación", "Contrato + alta + PRL", "Completa"]],
    company: [["Empresa", "OPSNIGHT Staff Internal", "Interno"], ["Tipo contrato", "Fijo discontinuo", "Activo"], ["Estado legal", "Alta y documentación vigente", "OK"]],
    devices: [["TPV", "POS-BC-03 · asignado 22:25", "Online"], ["Walkie", "WK-14 · canal Barra", "OK"], ["Tablet", "No asignada", "-"], ["Alertas pérdida", "0", "OK"]],
    pos: [["Ventas totales", "€14,720 · 312 tickets", "Live"], ["Ticket medio", "€18.40", "OK"], ["Método pago", "NFC 62% · QR 21% · Cash 17%", "Mix"], ["Asociación", "Empleado · Barra Central · Turno noche", "OK"]],
  },
  elena: {
    costEngine: [["Modelo salarial", "Salario noche €80 + bonus upsell VIP", "Activo"], ["Coste en tiempo real", "€58.10 acumulado · ETA cierre €88.00", "Live"], ["Horas extra", "Sin previsión", "OK"], ["Recargo festivo/nocturno", "+12% desde 02:00", "Aplicado"], ["Bonus/Penalización", "+€42 bonus mínimos VIP", "OK"], ["Límite legal", "Descanso mínimo 12h", "OK"]],
    scheduling: [["Turno evento", "VIP Floor · 23:00-06:00", "Asignado"], ["Vacaciones", "9 días disponibles · 1 solicitud pendiente", "Pendiente"], ["Ausencias", "0 no-show · 0 permisos", "OK"], ["Festivo regional", "Recargo Madrid configurable", "+12%"], ["Cumplimiento", "Horas semanales 28/40", "OK"]],
    geoFraud: [["Fichaje entrada", "22:55 · GPS dentro de zona", "OK"], ["Método", "Face check opcional + NFC", "Activo"], ["Retrasos", "0 min", "OK"], ["Abandono", "No detectado", "OK"]],
    profile: [["DNI", "***1930R", "Verificado"], ["Seguridad Social", "Alta activa", "OK"], ["IBAN", "ES77 **** 2120", "Validado"], ["Contacto", "+34 *** 120 · elena@staff.local", "OK"], ["Tipo", "Interno · Hostess VIP", "Activo"], ["Documentación", "Contrato + protección datos + PRL", "Completa"]],
    company: [["Empresa", "OPSNIGHT Staff Internal", "Interno"], ["Tipo contrato", "Temporal evento", "Activo"], ["Estado legal", "Documentación vigente", "OK"]],
    devices: [["Mobile VIP", "VIP-MOB-02 · asignado 22:50", "Online"], ["Walkie", "WK-03 · canal VIP", "OK"], ["Tablet", "iPad VIP-01", "OK"]],
    pos: [["Ventas influenciadas", "€18,240 · 6 mesas", "Live"], ["Ticket medio mesa", "€3,040", "VIP"], ["Método pago", "QR split 44% · NFC 56%", "Mix"], ["Asociación", "Empleado · VIP V1-V6 · Turno noche", "OK"]],
  },
  juan: {
    costEngine: [["Modelo salarial", "Salario noche €80", "Activo"], ["Coste en tiempo real", "€52.70 acumulado", "Live"], ["Horas extra", "0h previstas", "OK"], ["Recargo nocturno", "+10% desde 02:00", "Aplicado"], ["Bonus", "+€12 SLA entregas", "OK"], ["Máx. legal", "Dentro de límite", "OK"]],
    scheduling: [["Turno evento", "Runner VIP · 23:30-06:30", "Asignado"], ["Vacaciones", "18 días disponibles", "OK"], ["Ausencias", "0", "OK"], ["Festivo", "Sin festivo regional", "-"], ["Cumplimiento", "Descanso anterior 14h", "OK"]],
    geoFraud: [["Fichaje entrada", "23:25 · GPS dentro", "OK"], ["Método", "QR office + GPS", "Activo"], ["Abandono", "No detectado", "OK"], ["Fichajes falsos", "0", "OK"]],
    profile: [["DNI", "***7714P", "Verificado"], ["Seguridad Social", "Alta activa", "OK"], ["IBAN", "ES45 **** 7714", "Validado"], ["Contacto", "+34 *** 714 · juan@staff.local", "OK"], ["Tipo", "Externo · Runner", "Activo"], ["Documentación", "Contrato + PRL", "Completa"]],
    company: [["Empresa", "Night Runners SL", "Externa"], ["Tipo contrato", "Servicios por evento", "Activo"], ["Estado legal", "CAE validado", "OK"]],
    devices: [["Walkie", "WK-22 · asignado 23:25", "OK"], ["Runner app", "RG-02", "Online"], ["Alertas pérdida", "0", "OK"]],
    pos: [["Ventas directas", "No aplica", "-"], ["BDS entregas", "18 entregas · SLA 92%", "Live"], ["Asociación", "Empleado · Runner VIP · Turno noche", "OK"]],
  },
  sofia: {
    costEngine: [["Modelo salarial", "Salario por hora €14.20", "Activo"], ["Coste en tiempo real", "€71.00 acumulado", "Live"], ["Horas extra", "Sin previsión", "OK"], ["Recargo festivo", "Configurable por región", "Listo"], ["Bonus", "No aplica", "-"], ["Máx. legal", "Horas semanales 32/40", "OK"]],
    scheduling: [["Turno evento", "Office · 22:00-05:30", "Asignado"], ["Vacaciones", "11 días disponibles", "OK"], ["Ausencias", "0 bajas · 0 permisos", "OK"], ["Festivo", "Calendario Madrid sincronizado", "OK"], ["Cumplimiento", "Descanso mínimo OK", "OK"]],
    geoFraud: [["Fichaje entrada", "21:58 · GPS dentro", "OK"], ["Método", "NFC office", "Activo"], ["Retrasos", "0 min", "OK"], ["Abandono", "No detectado", "OK"]],
    profile: [["DNI", "***6200A", "Verificado"], ["Seguridad Social", "Alta activa", "OK"], ["IBAN", "ES88 **** 6200", "Validado"], ["Contacto", "+34 *** 620 · sofia@staff.local", "OK"], ["Tipo", "Interno · Finanzas", "Activo"], ["Documentación", "Contrato + certificados admin", "Completa"]],
    company: [["Empresa", "OPSNIGHT Staff Internal", "Interno"], ["Tipo contrato", "Indefinido parcial", "Activo"], ["Estado legal", "Vigente", "OK"]],
    devices: [["Laptop", "MB-Office-01 · asignado 21:55", "Online"], ["Tablet stock", "STK-02", "OK"], ["Walkie", "No asignado", "-"], ["Alertas pérdida", "0", "OK"]],
    pos: [["Ventas directas", "No aplica", "-"], ["OCR / costes", "2 OCR · 4 ajustes coste", "Live"], ["Asociación", "Empleado · Office · Turno noche", "OK"]],
  },
};

for (const [key, modules] of Object.entries(sharedStaffModules)) {
  Object.assign(staffData[key], modules);
}

const venueData = {
  kapital: {
    title: "Kapital Madrid",
    subtitle: "Kapital Madrid · Madrid",
    revenue: "€142,890.00",
    breakdown: "Anticipadas €18,420 · Taquilla €8,150 · VIP €12,320 · Barras €98,420.",
    bar: "€98,420",
    capacity: "1,842",
    capacityLegal: "Legal 2,100 · 87.7% dentro.",
    avgTicket: "€77.57",
    bottleCost: "€32,570",
    margin: "COGS 22.8% · margen 34.2%.",
    audit: [
      ["Usuarios conectados", "8 activos · 3 POS · 2 puerta · 2 BDS · 1 office", "Live"],
      ["Última edición", "Sofia L. cambió precio Tanqueray · 02:11", "Auditado"],
      ["Personal contratado hoy", "46 fichados · coste €812/h", "OK"],
      ["Permisos dirección", "Owner ve P&L, stock y auditoría", "Editable"],
    ],
    closing: [
      ["Destinatarios", "owner@opsnight.local · direccion@kapital.local", "2"],
      ["Hora estimada", "Al cierre de caja + reconciliación de pagos", "06:30"],
      ["Informe tochísimo", "P&L, rentabilidad sesión, costes, staff, stock, fraude, aforo, tickets, márgenes y OCR.", "PDF"],
    ],
  },
  pacha: {
    title: "Pacha Ibiza",
    subtitle: "Pacha Ibiza · Ibiza",
    revenue: "€188,420.00",
    breakdown: "Anticipadas €42,100 · Taquilla €21,800 · VIP €38,400 · Barras €86,120.",
    bar: "€86,120",
    capacity: "2,320",
    capacityLegal: "Legal 2,800 · 82.8% dentro.",
    avgTicket: "€81.22",
    bottleCost: "€48,920",
    margin: "COGS 25.9% · margen 31.8%.",
    audit: [
      ["Usuarios conectados", "11 activos · 5 POS · 2 puerta · 3 BDS · 1 office", "Live"],
      ["Última edición", "Marc P. ajustó mínimo VIP V8 · 01:58", "Auditado"],
      ["Personal contratado hoy", "62 fichados · coste €1,180/h", "OK"],
      ["Permisos dirección", "Manager ve ventas y staff, no P&L global", "Editable"],
    ],
    closing: [
      ["Destinatarios", "owner@opsnight.local · direccion@pacha.local", "2"],
      ["Hora estimada", "Al cierre de caja + conciliación cashless", "07:00"],
      ["Informe final", "Rentabilidad DJ set, VIP, barras, puerta, stock crítico, pagos y no-shows.", "PDF"],
    ],
  },
  opium: {
    title: "Opium Barcelona",
    subtitle: "Opium Barcelona · Barcelona",
    revenue: "€64,210.00",
    breakdown: "Anticipadas €14,200 · Taquilla €6,900 · VIP €18,400 · Barras €24,710.",
    bar: "€24,710",
    capacity: "766",
    capacityLegal: "Legal 1,000 · 76.6% dentro.",
    avgTicket: "€83.82",
    bottleCost: "€18,680",
    margin: "COGS 29.1% · evento privado con margen controlado.",
    audit: [
      ["Usuarios conectados", "5 activos · 2 POS · 1 puerta · 1 BDS · 1 office", "Live"],
      ["Última edición", "Laura B. añadió lista privada · 00:42", "Auditado"],
      ["Personal contratado hoy", "28 fichados · coste €520/h", "OK"],
      ["Permisos evento", "Cliente ve consumo VIP, no staff ni auditoría", "Editable"],
    ],
    closing: [
      ["Destinatarios", "owner@opsnight.local · eventos@opium.local", "2"],
      ["Hora estimada", "Tras cierre parcial de barra y consumo VIP", "05:45"],
      ["Informe final", "Consumo mínimo, rentabilidad por mesa, barras, coste staff y desviación stock.", "PDF"],
    ],
  },
};

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
  themeButtons.forEach((button) => button.classList.toggle("active", button.dataset.themeOption === mode));
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
  setTimeout(() => { settingsOverlay.hidden = true; }, 220);
}

function bindActionButtons(root = document) {
  root.querySelectorAll(".js-action").forEach((button) => {
    if (button.dataset.boundAction) return;
    button.dataset.boundAction = "true";
    button.addEventListener("click", () => showToast("Accion registrada en OPSNIGHT."));
  });
}

function switchPage(page, scope) {
  document.querySelectorAll(`.${scope}-page`).forEach((section) => section.classList.toggle("active", section.dataset.page === page));
  const navSelector = scope === "desktop" ? ".desktop-sidebar a[data-page]" : ".mobile-bottom-nav button[data-page]";
  document.querySelectorAll(navSelector).forEach((item) => item.classList.toggle("active", item.dataset.page === page));
}

function fillText(id, value) {
  const node = document.querySelector(id);
  if (node) node.textContent = value;
}

function openVenueDetail(venue) {
  const data = venueData[venue];
  if (!data) return;
  document.querySelector("#venueListScreen")?.classList.remove("active");
  const detailScreen = document.querySelector("#localDetailScreen");
  if (detailScreen) {
    detailScreen.hidden = false;
    detailScreen.classList.add("active");
  }
  fillText("#localDetailTitle", data.title);
  fillText("#localDetailSubtitle", data.subtitle);
  fillText("#localRevenue", data.revenue);
  fillText("#localRevenueBreakdown", data.breakdown);
  fillText("#localBarRevenue", data.bar);
  fillText("#localCapacity", data.capacity);
  fillText("#localCapacityLegal", data.capacityLegal);
  fillText("#localAvgTicket", data.avgTicket);
  fillText("#localBottleCost", data.bottleCost);
  fillText("#localMargin", data.margin);
  const auditRows = document.querySelector("#localAuditRows");
  if (auditRows) {
    auditRows.innerHTML = data.audit.map(([area, datum, status]) => `<tr><td>${area}</td><td>${datum}</td><td>${status}</td></tr>`).join("");
  }
  const closingRows = document.querySelector("#localClosingRows");
  if (closingRows) {
    closingRows.innerHTML = data.closing.map(([title, detail, status]) => `<article><strong>${title}</strong><span>${detail}</span><b>${status}</b></article>`).join("");
  }
  showToast(`Pantalla abierta: ${data.title}.`);
}

function closeVenueDetail() {
  document.querySelector("#localDetailScreen")?.classList.remove("active");
  const detailScreen = document.querySelector("#localDetailScreen");
  if (detailScreen) detailScreen.hidden = true;
  document.querySelector("#venueListScreen")?.classList.add("active");
}

function renderRows(selector, rows) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = (rows || []).map(([title, detail, status]) => `<article><strong>${title}</strong><span>${detail}</span><b>${status}</b></article>`).join("");
}

function renderProfileGrid(selector, rows) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = (rows || []).map(([title, detail, status]) => `<article><span>${title}</span><strong>${detail}</strong><em>${status}</em></article>`).join("");
}

function openStaffDetail(staff) {
  const data = staffData[staff];
  if (!data) return;
  document.querySelector("#employeeListScreen")?.classList.remove("active");
  const detailScreen = document.querySelector("#employeeDetailScreen");
  if (detailScreen) {
    detailScreen.hidden = false;
    detailScreen.classList.add("active");
  }
  fillText("#employeeDetailTitle", data.title);
  fillText("#employeeDetailSubtitle", data.subtitle);
  fillText("#employeeInitials", data.initials || data.title.slice(0, 2));
  const quickTags = document.querySelector("#employeeQuickTags");
  if (quickTags) quickTags.innerHTML = (data.tags || []).map((tag) => `<span>${tag}</span>`).join("");
  switchEmployeeTab("overview", false);
  fillText("#employeeMainMetricLabel", data.mainLabel);
  fillText("#employeeMainMetric", data.main);
  fillText("#employeeMainMetricText", data.mainText);
  fillText("#employeeRiskLabel", data.riskLabel);
  fillText("#employeeRiskMetric", data.risk);
  fillText("#employeeRiskText", data.riskText);
  fillText("#employeeShiftCost", data.shiftCost);
  fillText("#employeeShiftText", data.shiftText);
  fillText("#employeeDetailBadge", data.badge);
  fillText("#employeeSideTitle", data.sideTitle);
  fillText("#employeeSideAction", data.sideAction);
  const detailRows = document.querySelector("#employeeDetailRows");
  if (detailRows) detailRows.innerHTML = data.detail.map(([area, datum, status]) => `<tr><td>${area}</td><td>${datum}</td><td>${status}</td></tr>`).join("");
  renderRows("#employeeRiskRows", data.risks);
  renderProfileGrid("#employeeCostEngine", data.costEngine);
  renderProfileGrid("#employeeScheduling", data.scheduling);
  renderRows("#employeeGeoFraud", data.geoFraud);
  renderProfileGrid("#employeeFullProfile", data.profile);
  renderRows("#employeeCompany", data.company);
  renderProfileGrid("#employeeDevices", data.devices);
  renderRows("#employeePos", data.pos);
  showToast(`Pantalla abierta: ${data.title}.`);
}

function switchEmployeeTab(tab, announce = true) {
  document.querySelectorAll("[data-employee-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.employeePanel === tab);
  });
  document.querySelectorAll("[data-employee-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.employeeTab === tab);
  });
  if (announce) showToast(`Sección abierta: ${tab}.`);
}

function closeStaffDetail() {
  document.querySelector("#employeeDetailScreen")?.classList.remove("active");
  const detailScreen = document.querySelector("#employeeDetailScreen");
  if (detailScreen) detailScreen.hidden = true;
  document.querySelector("#employeeListScreen")?.classList.add("active");
}

function switchStaff(staff) {
  document.querySelectorAll("[data-staff-mobile-detail]").forEach((panel) => panel.classList.toggle("active", panel.dataset.staffMobileDetail === staff));
  openStaffDetail(staff);
}

applyTheme();

themeButtons.forEach((button) => button.addEventListener("click", () => applyTheme(button.dataset.themeOption)));
systemTheme.addEventListener("change", () => { if (document.documentElement.dataset.themeMode === "system") applyTheme("system"); });
document.querySelectorAll(".settings-trigger").forEach((button) => button.addEventListener("click", openSettings));
[settingsClose, settingsCancel].forEach((button) => button?.addEventListener("click", closeSettings));
settingsSave?.addEventListener("click", () => { closeSettings(); showToast("Ajustes guardados correctamente."); });
settingsOverlay?.addEventListener("click", (event) => { if (event.target === settingsOverlay) closeSettings(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && settingsOverlay?.classList.contains("open")) closeSettings(); });
document.querySelectorAll(".mobile-bottom-nav button[data-page]").forEach((button) => button.addEventListener("click", () => switchPage(button.dataset.page, "mobile")));
document.querySelectorAll(".desktop-sidebar a[data-page]").forEach((link) => link.addEventListener("click", (event) => { event.preventDefault(); switchPage(link.dataset.page, "desktop"); closeVenueDetail(); closeStaffDetail(); }));
document.querySelectorAll(".venue-detail-button[data-venue]").forEach((button) => button.addEventListener("click", () => openVenueDetail(button.dataset.venue)));
document.querySelector("#backToVenues")?.addEventListener("click", closeVenueDetail);
document.querySelector("#backToEmployees")?.addEventListener("click", closeStaffDetail);
document.querySelectorAll("[data-staff]").forEach((button) => button.addEventListener("click", () => switchStaff(button.dataset.staff)));
document.querySelectorAll("[data-employee-tab]").forEach((button) => button.addEventListener("click", () => switchEmployeeTab(button.dataset.employeeTab)));

document.querySelectorAll(".permission-save").forEach((button) => button.addEventListener("click", () => showToast("Permisos actualizados y auditados.")));
document.querySelectorAll(".sidebar-footer a").forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));

bindActionButtons();
