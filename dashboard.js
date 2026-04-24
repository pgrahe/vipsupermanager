const toast = document.querySelector("#toast");
const settingsOverlay = document.querySelector("#settingsOverlay");
const settingsClose = document.querySelector("#settingsClose");
const settingsCancel = document.querySelector("#settingsCancel");
const settingsSave = document.querySelector("#settingsSave");
const themeStatus = document.querySelector("#themeStatus");
const themeButtons = [...document.querySelectorAll("[data-theme-option]")];
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const desktopAdmin = document.querySelector(".desktop-admin");
const accessTrigger = document.querySelector("#accessSwitcherTrigger");
const accessMenu = document.querySelector("#accessSwitcherMenu");
const accessLabel = document.querySelector("#currentAccessLabel");

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

const accessModes = {
  director: { label: "Director", page: "overview" },
  barra: { label: "Barra TPV", page: "tpv", catalog: "barra" },
  taquilla: { label: "Taquilla", page: "tpv", catalog: "taquilla" },
  vip: { label: "VIP", page: "personal", staff: "elena" },
  office: { label: "Office", page: "finanzas" },
};

const tpvCatalogs = {
  taquilla: [
    { id: "comp-godo", name: "Compromiso GODÓ", price: 0, tag: "Compromiso", tone: "amber", icon: "confirmation_number", category: "Entradas" },
    { id: "rrpp", name: "Compromiso via RRPP", price: 0, tag: "RRPP", tone: "violet", icon: "confirmation_number", category: "Entradas" },
    { id: "img-chica", name: "Imagen chica", price: 0, tag: "Imagen chica", tone: "pink", icon: "confirmation_number", category: "Entradas" },
    { id: "inv-chico", name: "Invitación chico", price: 0, tag: "Invitación chico", tone: "cyan", icon: "confirmation_number", category: "Entradas" },
    { id: "compromiso", name: "Compromiso", price: 5, tag: "Compromiso", tone: "amber", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada10", name: "Entrada 10€", price: 10, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada12", name: "Entrada 12€", price: 12, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada15", name: "Entrada 15€", price: 15, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada18", name: "Entrada 18€", price: 18, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada20", name: "Entrada 20€", price: 20, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada25", name: "Entrada 25€", price: 25, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada30", name: "Entrada 30€", price: 30, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada35", name: "Entrada 35€", price: 35, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada40", name: "Entrada 40€", price: 40, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada45", name: "Entrada 45€", price: 45, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada50", name: "Entrada 50€", price: 50, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada60", name: "Entrada 60€", price: 60, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada80", name: "Entrada 80€", price: 80, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
    { id: "entrada100", name: "Entrada 100€", price: 100, tag: "Entrada", tone: "green", icon: "confirmation_number", category: "Entradas" },
  ],
  barra: [
    { id: "ron-cola", name: "Ron Cola", price: 12, tag: "Combinado", tone: "green", icon: "liquor", category: "Ron" },
    { id: "vodka-rb", name: "Vodka Red Bull", price: 15, tag: "Premium", tone: "cyan", icon: "liquor", category: "Vodka" },
    { id: "gin-tonic", name: "Gin Tonic", price: 14, tag: "Copa", tone: "violet", icon: "wine_bar", category: "Ginebra" },
    { id: "jb-cola", name: "JB Cola", price: 12, tag: "Whisky", tone: "amber", icon: "liquor", category: "Whisky" },
    { id: "barcelo-cola", name: "Barceló Cola", price: 13, tag: "Ron", tone: "green", icon: "liquor", category: "Ron" },
    { id: "moet", name: "Moët Brut", price: 220, tag: "Botella", tone: "amber", icon: "liquor", category: "Champagne" },
    { id: "grey-goose", name: "Grey Goose VIP", price: 260, tag: "Botella", tone: "violet", icon: "liquor", category: "Vodka" },
    { id: "redbull", name: "Red Bull", price: 6, tag: "Refresco", tone: "cyan", icon: "bolt", category: "Refrescos" },
    { id: "coca-cola", name: "Coca-Cola", price: 5, tag: "Refresco", tone: "cyan", icon: "bolt", category: "Refrescos" },
    { id: "agua", name: "Agua", price: 5, tag: "Soft", tone: "slate", icon: "water_drop", category: "Agua" },
    { id: "zumo-pina", name: "Zumo Piña", price: 6, tag: "Zumo", tone: "amber", icon: "water_drop", category: "Zumos" },
    { id: "tequila-shot", name: "Tequila Shot", price: 8, tag: "Shot", tone: "green", icon: "liquor", category: "Tequila" },
    { id: "shisha", name: "Shisha Love 66", price: 45, tag: "Shisha", tone: "pink", icon: "air", category: "Snack & Fun" },
  ],
};

const tpvProductsById = Object.values(tpvCatalogs).flat().reduce((acc, product) => {
  acc[product.id] = product;
  return acc;
}, {});

const tpvState = {
  catalog: "taquilla",
  ticket: [],
  sort: "price-asc",
  search: "",
  category: "all",
};

function formatMoney(value) {
  return `${Number(value).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
}

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

function openAccessMenu() {
  if (!accessMenu || !accessTrigger) return;
  accessMenu.hidden = false;
  accessTrigger.setAttribute("aria-expanded", "true");
}

function closeAccessMenu() {
  if (!accessMenu || !accessTrigger) return;
  accessMenu.hidden = true;
  accessTrigger.setAttribute("aria-expanded", "false");
}

function switchPage(page, scope) {
  document.querySelectorAll(`.${scope}-page`).forEach((section) => section.classList.toggle("active", section.dataset.page === page));
  const navSelector = scope === "desktop" ? ".desktop-sidebar a[data-page]" : ".mobile-bottom-nav button[data-page]";
  document.querySelectorAll(navSelector).forEach((item) => item.classList.toggle("active", item.dataset.page === page));
}

function renderTPVClock() {
  const now = new Date();
  const dateLabel = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "2-digit", month: "short" }).format(now);
  const timeLabel = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(now);
  fillText("#tpvDateLabel", dateLabel);
  fillText("#tpvClockLabel", timeLabel);
  fillText("#tpvClockBadge", timeLabel);
}

function renderTPVCatalog() {
  const grid = document.querySelector("#tpvProductGrid");
  const searchWrap = document.querySelector("#tpvSearchWrap");
  const searchInput = document.querySelector("#tpvSearchInput");
  const categoryTabs = document.querySelector("#tpvCategoryTabs");
  const sortButton = document.querySelector("#tpvSortButton");
  if (!grid) return;
  const catalogProducts = tpvCatalogs[tpvState.catalog] || [];
  const isBarra = tpvState.catalog === "barra";
  const sortMode = tpvState.sort || (isBarra ? "featured" : "price-asc");
  let products = [...catalogProducts];
  if (isBarra && tpvState.category && tpvState.category !== "all") {
    products = products.filter((product) => product.category === tpvState.category);
  }
  if (isBarra && tpvState.search.trim()) {
    const query = tpvState.search.trim().toLowerCase();
    products = products.filter((product) =>
      [product.name, product.category, product.tag].filter(Boolean).some((value) => value.toLowerCase().includes(query))
    );
  }
  products.sort((a, b) => {
    if (sortMode === "name-asc") return a.name.localeCompare(b.name, "es");
    if (sortMode === "name-desc") return b.name.localeCompare(a.name, "es");
    if (sortMode === "price-desc") return b.price - a.price || a.name.localeCompare(b.name, "es");
    return a.price - b.price || a.name.localeCompare(b.name, "es");
  });
  fillText("#tpvContextTitle", tpvState.catalog === "taquilla" ? "Entradas Taquilla" : "Catálogo Barra");
  fillText("#tpvUserLabel", tpvState.catalog === "taquilla" ? "Taquilla" : "Barra");
  fillText("#tpvAccessModeLabel", tpvState.catalog === "taquilla" ? "Usuario Taquilla" : "Usuario Barra");
  document.querySelectorAll("[data-pos-catalog]").forEach((button) => button.classList.toggle("active", button.dataset.posCatalog === tpvState.catalog));
  if (searchWrap) searchWrap.hidden = !isBarra;
  if (categoryTabs) categoryTabs.hidden = !isBarra;
  grid.dataset.catalog = tpvState.catalog;
  if (searchInput && searchInput.value !== tpvState.search) searchInput.value = tpvState.search;
  if (sortButton) sortButton.textContent = sortMode === "name-asc" ? "Alfabeto A-Z" : sortMode === "name-desc" ? "Alfabeto Z-A" : sortMode === "price-desc" ? "Precio mayor-menor" : "Precio menor-mayor";
  if (categoryTabs && isBarra) {
    const categories = ["all", ...new Set(catalogProducts.map((product) => product.category).filter(Boolean))];
    categoryTabs.innerHTML = categories.map((category) => `
      <button class="${tpvState.category === category ? "active" : ""}" type="button" data-pos-category="${category}">
        ${category === "all" ? "Todo" : category}
      </button>
    `).join("");
    categoryTabs.querySelectorAll("[data-pos-category]").forEach((button) => {
      button.addEventListener("click", () => {
        tpvState.category = button.dataset.posCategory || "all";
        renderTPVCatalog();
      });
    });
  } else if (categoryTabs) {
    categoryTabs.innerHTML = "";
  }
  grid.innerHTML = products.map((product) => `
    <article class="tpv-product-card ${product.tone}">
      <div class="tpv-product-main">
        <strong>${product.name}</strong>
        <b>${formatMoney(product.price)}</b>
        <span>${product.tag}</span>
      </div>
      <i class="material-symbols-outlined">${product.icon}</i>
      <button class="tpv-add-button" type="button" data-pos-add="${product.id}">+</button>
    </article>
  `).join("");
  grid.querySelectorAll("[data-pos-add]").forEach((button) => button.addEventListener("click", () => addTPVItem(button.dataset.posAdd)));
}

function renderTPVTicket() {
  const itemsWrap = document.querySelector("#tpvTicketItems");
  const emptyState = document.querySelector("#tpvEmptyState");
  const total = tpvState.ticket.reduce((sum, item) => sum + item.price * item.qty, 0);
  fillText("#tpvTotalAmount", formatMoney(total));
  fillText("#tpvItemCount", `${tpvState.ticket.reduce((sum, item) => sum + item.qty, 0)} ítems`);
  if (!itemsWrap || !emptyState) return;
  if (!tpvState.ticket.length) {
    itemsWrap.innerHTML = "";
    emptyState.hidden = false;
    emptyState.classList.remove("is-hidden");
    return;
  }
  emptyState.hidden = true;
  emptyState.classList.add("is-hidden");
  itemsWrap.innerHTML = tpvState.ticket.map((item) => `
    <article class="tpv-ticket-item">
      <div class="tpv-ticket-top">
        <div class="tpv-ticket-copy">
          <strong>${item.name}</strong>
          <span>${item.category || item.tag || ""}</span>
        </div>
        <b>${formatMoney(item.price * item.qty)}</b>
      </div>
      <div class="tpv-ticket-bottom">
        <div class="tpv-qty-pill">
          <button type="button" data-pos-remove="${item.id}">−</button>
          <span>${item.qty}</span>
          <button type="button" data-pos-add="${item.id}">+</button>
        </div>
        <button class="tpv-ticket-remove" type="button" data-pos-delete="${item.id}">
          <span class="material-symbols-outlined">delete</span>Quitar
        </button>
      </div>
    </article>
  `).join("");
  itemsWrap.querySelectorAll("[data-pos-remove]").forEach((button) => button.addEventListener("click", () => removeTPVItem(button.dataset.posRemove)));
  itemsWrap.querySelectorAll("[data-pos-add]").forEach((button) => button.addEventListener("click", () => addTPVItem(button.dataset.posAdd)));
  itemsWrap.querySelectorAll("[data-pos-delete]").forEach((button) => button.addEventListener("click", () => {
    tpvState.ticket = tpvState.ticket.filter((item) => item.id !== button.dataset.posDelete);
    renderTPVTicket();
  }));
}

function addTPVItem(id) {
  const product = tpvProductsById[id];
  if (!product) return;
  const existing = tpvState.ticket.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else tpvState.ticket.push({ ...product, qty: 1 });
  renderTPVTicket();
}

function removeTPVItem(id) {
  const existing = tpvState.ticket.find((item) => item.id === id);
  if (!existing) return;
  existing.qty -= 1;
  if (existing.qty <= 0) tpvState.ticket = tpvState.ticket.filter((item) => item.id !== id);
  renderTPVTicket();
}

function setTPVCatalog(catalog, announce = true) {
  tpvState.catalog = catalog in tpvCatalogs ? catalog : "taquilla";
  tpvState.search = "";
  tpvState.category = "all";
  tpvState.sort = tpvState.catalog === "barra" ? "price-asc" : "price-asc";
  renderTPVCatalog();
  if (announce) showToast(`TPV abierto: ${tpvState.catalog}.`);
}

function applyAccessMode(mode, announce = true) {
  const config = accessModes[mode] || accessModes.director;
  if (accessLabel) accessLabel.textContent = config.label;
  document.querySelectorAll(".access-option").forEach((button) => button.classList.toggle("active", button.dataset.access === mode));
  desktopAdmin?.classList.toggle("pos-access", config.page === "tpv");
  desktopAdmin?.setAttribute("data-access-mode", mode);
  closeVenueDetail();
  closeStaffDetail();
  switchPage(config.page, "desktop");
  if (config.page === "tpv") setTPVCatalog(config.catalog || "taquilla", false);
  if (config.staff) openStaffDetail(config.staff);
  closeAccessMenu();
  if (announce) showToast(`Acceso cambiado a ${config.label}.`);
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

function renderVisualRows(selector, rows) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = (rows || []).map(([title, detail, status]) => {
    const showStatus = status && status !== "OK" && status !== "-";
    return `
      <article class="visual-status-item">
        <i class="material-symbols-outlined">${iconForLabel(title)}</i>
        <div>
          <strong>${title}</strong>
          <span>${detail}</span>
        </div>
        ${showStatus ? `<b>${status}</b>` : ""}
      </article>
    `;
  }).join("");
}

function renderOperationalRows(selector, rows) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = (rows || []).map(([title, detail]) => `
    <article class="operational-item">
      <i class="material-symbols-outlined">${iconForLabel(title)}</i>
      <div>
        <span>${title}</span>
        <strong>${detail}</strong>
      </div>
      <button class="edit-chip operational-edit" type="button" aria-label="Editar ${title}">
        <span class="material-symbols-outlined">edit</span>
      </button>
    </article>
  `).join("");
  node.querySelectorAll(".operational-edit").forEach((button) => button.addEventListener("click", (event) => {
    event.stopPropagation();
    showToast("Editar dato operativo: próximamente.");
  }));
}

function iconForLabel(label = "") {
  const key = label.toLowerCase();
  if (key.includes("permiso")) return "admin_panel_settings";
  if (key.includes("conect")) return "devices";
  if (key.includes("acción") || key.includes("accion")) return "history";
  if (key.includes("modelo") || key.includes("salario")) return "payments";
  if (key.includes("coste") || key.includes("bonus") || key.includes("recargo")) return "euro";
  if (key.includes("hora") || key.includes("límite") || key.includes("máx")) return "schedule";
  if (key.includes("turno") || key.includes("vacaciones") || key.includes("festivo")) return "calendar_month";
  if (key.includes("ausencia") || key.includes("cumplimiento")) return "verified_user";
  if (key.includes("fichaje") || key.includes("gps") || key.includes("método")) return "location_on";
  if (key.includes("retras") || key.includes("abandono") || key.includes("falso")) return "warning";
  if (key.includes("dni") || key.includes("seguridad") || key.includes("iban")) return "badge";
  if (key.includes("contacto")) return "call";
  if (key.includes("tipo") || key.includes("empresa") || key.includes("contrato")) return "business";
  if (key.includes("document")) return "description";
  if (key.includes("tpv") || key.includes("ventas") || key.includes("ticket") || key.includes("pago")) return "point_of_sale";
  if (key.includes("walkie")) return "settings_input_antenna";
  if (key.includes("tablet") || key.includes("mobile") || key.includes("laptop")) return "devices";
  if (key.includes("alerta")) return "notifications_active";
  return "radio_button_checked";
}

function renderProfileGrid(selector, rows) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = (rows || []).map(([title, detail, status]) => `<article><button class="edit-chip" type="button" aria-label="Editar ${title}"><span class="material-symbols-outlined">edit</span></button><div class="profile-card-top"><i class="material-symbols-outlined">${iconForLabel(title)}</i><span>${title}</span></div><strong>${detail}</strong><em>${status}</em></article>`).join("");
  node.querySelectorAll(".edit-chip").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); showToast("Editar campo: próximamente."); }));
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
  renderOperationalRows("#employeeDetailRows", data.detail);
  renderRows("#employeeRiskRows", data.risks);
  renderProfileGrid("#employeeCostEngine", data.costEngine);
  renderProfileGrid("#employeeScheduling", data.scheduling);
  renderVisualRows("#employeeGeoFraud", data.geoFraud);
  renderProfileGrid("#employeeFullProfile", data.profile);
  renderRows("#employeeCompany", data.company);
  renderProfileGrid("#employeeDevices", data.devices);
  renderVisualRows("#employeePos", data.pos);
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
renderTPVClock();
renderTPVTicket();
renderTPVCatalog();
setInterval(renderTPVClock, 60000);

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
accessTrigger?.addEventListener("click", () => {
  if (accessMenu?.hidden) openAccessMenu();
  else closeAccessMenu();
});
document.querySelectorAll(".access-option").forEach((button) => button.addEventListener("click", () => applyAccessMode(button.dataset.access)));
document.querySelectorAll("[data-pos-catalog]").forEach((button) => button.addEventListener("click", () => setTPVCatalog(button.dataset.posCatalog)));
document.querySelector("#tpvSearchInput")?.addEventListener("input", (event) => {
  tpvState.search = event.target.value || "";
  renderTPVCatalog();
});
document.querySelector("#tpvSortButton")?.addEventListener("click", () => {
  const sequence = ["price-asc", "price-desc", "name-asc", "name-desc"];
  const currentIndex = sequence.indexOf(tpvState.sort);
  tpvState.sort = sequence[(currentIndex + 1) % sequence.length];
  renderTPVCatalog();
});
document.querySelector("#tpvClearButton")?.addEventListener("click", () => {
  tpvState.ticket = [];
  renderTPVTicket();
  showToast("Ticket vaciado.");
});
document.addEventListener("click", (event) => {
  if (!accessMenu || accessMenu.hidden) return;
  if (event.target instanceof Node && (accessMenu.contains(event.target) || accessTrigger?.contains(event.target))) return;
  closeAccessMenu();
});

document.querySelectorAll(".permission-save").forEach((button) => button.addEventListener("click", () => showToast("Permisos actualizados y auditados.")));
document.querySelectorAll(".sidebar-footer a").forEach((link) => link.addEventListener("click", (event) => event.preventDefault()));

bindActionButtons();
applyAccessMode("director", false);
