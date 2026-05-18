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
const accessOptions = [...document.querySelectorAll(".access-option")];
const desktopSidebarLinks = [...document.querySelectorAll(".desktop-sidebar a[data-page]")];
const mobileModeTrigger = document.querySelector("#mobileModeTrigger");
const authGate = document.querySelector("#authGate");
const authForm = document.querySelector("#authForm");
const authEmailInput = document.querySelector("#authEmail");
const authPasswordInput = document.querySelector("#authPassword");
const authSubmit = document.querySelector("#authSubmit");
const authStatus = document.querySelector("#authStatus");
const authError = document.querySelector("#authError");
const authRoles = document.querySelector("#authRoles");
const desktopAuthAvatar = document.querySelector("#desktopAuthAvatar");
const mobileAuthAvatar = document.querySelector("#mobileAuthAvatar");
const logoutLinks = [...document.querySelectorAll("[data-auth-logout]")];
const drawerAvatar = document.querySelector("#mphDrawerAvatar");
const drawerName = document.querySelector("#mphDrawerName");
const drawerSubtitle = document.querySelector("#mphDrawerSubtitle");
const drawerRoleBadge = document.querySelector("#mphDrawerRoleBadge");
const drawerAccountName = document.querySelector("#mphDrawerAccountName");
const drawerAccountEmail = document.querySelector("#mphDrawerAccountEmail");
const drawerAccountRole = document.querySelector("#mphDrawerAccountRole");

const mphAuthState = {
  roles: [],
  pending: true,
  booted: false,
  userId: null,
  activeRoleKey: null,
  isManager: false,
  defaultDesktopMode: "director",
  allowedDesktopModes: new Set(["director"]),
  appliedSignature: "",
};

const staffPhotos = {
  carlos: "icons/staff/carlos.jpg",
  elena:  "icons/staff/elena.jpg",
  juan:   "icons/staff/juan.jpg",
  lucas:  "icons/staff/lucas.jpg",
};

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

function staffAvatarHtml(id, initials, cssClass = "mph-roster-avatar") {
  const photo = staffPhotos[id];
  if (photo) return `<div class="${cssClass} mph-avatar-photo"><img src="${photo}" alt="${initials}" onerror="this.parentElement.innerHTML='${initials}'"/></div>`;
  return `<div class="${cssClass}">${initials}</div>`;
}

function createMphExistingStaffProfile(id, config) {
  const data = staffData[id];
  return {
    id,
    title: data.title,
    initials: data.initials,
    tags: data.tags,
    summaryRows: [...data.detail, ...data.risks],
    costRows: data.costEngine,
    shiftRows: data.scheduling,
    controlRows: [...data.geoFraud, ...data.devices],
    profileRows: [...data.profile, ...data.company, ...data.pos],
    ...config,
  };
}

const mphStaffProfiles = {
  carlos: createMphExistingStaffProfile("carlos", {
    category: "barra",
    role: "Barra Central · Online",
    productivity: "€1,840/h",
    costPerHour: "€64/h",
    liveNote: "312 tickets monitorizados · ticket medio €18.40",
    statusNote: "Online · POS-BC-03 · Barra principal",
  }),
  elena: createMphExistingStaffProfile("elena", {
    category: "vip",
    role: "VIP V1-V6 · Online",
    productivity: "€2,120/h",
    costPerHour: "€58/h",
    liveNote: "6 mesas activas · upsell +14%",
    statusNote: "Online · VIP-MOB-02 · Floor V1-V6",
  }),
  juan: createMphExistingStaffProfile("juan", {
    category: "vip",
    role: "Runner VIP · SLA 92%",
    productivity: "18 entregas",
    costPerHour: "€53/h",
    liveNote: "3 pedidos en ruta · ETA 04:20",
    statusNote: "Online · Runner RG-02 · VIP floor",
  }),
  sofia: createMphExistingStaffProfile("sofia", {
    category: "otros",
    role: "Office · Finanzas",
    productivity: "2 OCR",
    costPerHour: "€71/h",
    liveNote: "4 ajustes coste · 3 pedidos proveedor",
    statusNote: "Online · Backoffice · Control financiero",
  }),
  lucas: {
    id: "lucas",
    category: "barra",
    title: "Lucas V.",
    initials: "LV",
    role: "Barra 2 · Speed rail",
    productivity: "€1,260/h",
    costPerHour: "€49/h",
    liveNote: "221 tickets · 19s por cobro · 0 descuadres",
    statusNote: "Online · POS-B2-04 · Barra 2",
    tags: ["Interno", "Barra 2", "Online", "Sin incidencias"],
    summaryRows: [["Permisos", "POS, descuentos limitados, cierre parcial", "Editable"], ["Última acción", "Cierre parcial barra 2 · 02:19", "OK"], ["Ritmo", "221 tickets · ticket medio €15.30", "Live"], ["Riesgo", "0 voids y 0 cajón sin venta", "Bajo"]],
    costRows: [["Modelo salarial", "€80 noche + bonus velocidad", "Activo"], ["Coste en tiempo real", "€49.80 acumulado · ETA cierre €81.20", "Live"], ["Horas extra", "Sin previsión", "OK"], ["Recargo nocturno", "+12% desde 02:00", "Aplicado"]],
    shiftRows: [["Turno evento", "Barra 2 · 23:00-06:00", "Asignado"], ["Vacaciones", "8 días disponibles", "OK"], ["Ausencias", "0 incidencias", "OK"], ["Cumplimiento", "Descanso y horas semanales OK", "OK"]],
    controlRows: [["Fichaje entrada", "22:54 · GPS dentro de zona", "OK"], ["Método", "NFC + PIN supervisor", "Activo"], ["Dispositivo", "POS-B2-04 · Walkie WK-19", "Online"], ["Antifraude", "0 eventos fuera de patrón", "OK"]],
    profileRows: [["DNI", "***9184D", "Verificado"], ["Seguridad Social", "Alta activa", "OK"], ["Empresa", "OPSNIGHT Staff Internal", "Interno"], ["Tipo", "Interno · Barra", "Activo"], ["Método pago", "NFC 68% · QR 18% · Cash 14%", "Mix"]],
  },
  nuria: {
    id: "nuria",
    category: "seguridad",
    title: "Nuria P.",
    initials: "NP",
    role: "Coordinadora acceso norte",
    productivity: "96% SLA",
    costPerHour: "€74/h",
    liveNote: "1.248 accesos validados · 0 colas críticas",
    statusNote: "Online · Acceso Norte · Control puertas",
    tags: ["Externa", "Seguridad", "Coordinación", "Live"],
    summaryRows: [["Cobertura", "8 vigilantes coordinados · acceso norte y VIP", "Live"], ["Incidencias", "1 cacheo ampliado · 0 expulsiones", "Bajo"], ["Última acción", "Refuerzo puerta VIP solicitado · 02:07", "OK"], ["Cumplimiento", "Aforos, listas y pulseras dentro de SLA", "OK"]],
    costRows: [["Modelo salarial", "Proveedor externo por horas", "Activo"], ["Coste en tiempo real", "€74.00/h · ETA cierre €518", "Live"], ["Horas extra", "1h extra aprobada si pico 05:00", "Aviso"], ["Factura proveedor", "Night Security SL · validación automática", "OK"]],
    shiftRows: [["Turno evento", "22:00-06:00 · Coordinación accesos", "Asignado"], ["Rotación", "Acceso norte, VIP, perímetro", "Activo"], ["Descansos", "2 pausas planificadas", "OK"], ["Cumplimiento", "Cobertura completa en 3 zonas", "OK"]],
    controlRows: [["Fichaje entrada", "21:51 · geofence puerta", "OK"], ["Bodycam / radio", "WK-02 · bodycam enlazada", "Online"], ["Alertas", "0 intrusiones · 0 abandono", "OK"], ["Checklist", "Cacheo, listas y pulseras completado", "96%"]],
    profileRows: [["DNI", "***5412T", "Verificado"], ["Empresa", "Night Security SL", "Externa"], ["Tipo", "Jefa de equipo seguridad", "Activo"], ["CAE", "Documentación al día", "OK"], ["Contacto", "+34 *** 210 · nuria@security.local", "OK"]],
  },
  raul: {
    id: "raul",
    category: "seguridad",
    title: "Raúl C.",
    initials: "RC",
    role: "Control perimetral VIP",
    productivity: "92% SLA",
    costPerHour: "€62/h",
    liveNote: "22 incidencias resueltas · perímetro estable",
    statusNote: "Online · VIP access · perímetro",
    tags: ["Externo", "Seguridad", "VIP", "Perímetro"],
    summaryRows: [["Cobertura", "Controla entrada VIP y backstage", "Live"], ["Incidencias", "2 conflictos leves resueltos", "OK"], ["Última acción", "Acompañamiento cliente high-value · 01:42", "OK"], ["Riesgo", "Sin alarmas críticas", "Bajo"]],
    costRows: [["Modelo salarial", "Proveedor externo por hora", "Activo"], ["Coste en tiempo real", "€62.00/h", "Live"], ["Horas extra", "No previstas", "OK"], ["Bonus", "Plus evento premium", "Activo"]],
    shiftRows: [["Turno evento", "23:00-06:00 · acceso VIP", "Asignado"], ["Puesto", "VIP + backstage", "Activo"], ["Descanso", "1 pausa completada", "OK"], ["Cumplimiento", "Checklist de accesos completa", "OK"]],
    controlRows: [["Fichaje entrada", "22:56 · geofence VIP", "OK"], ["Radio", "WK-08 · canal seguridad", "Online"], ["Bodycam", "Sin incidencias", "OK"], ["Alertas", "0 fugas de perímetro", "OK"]],
    profileRows: [["DNI", "***3021G", "Verificado"], ["Empresa", "Night Security SL", "Externa"], ["Tipo", "Seguridad VIP", "Activo"], ["Certificación", "TIP vigente", "OK"], ["Contacto", "+34 *** 302 · raul@security.local", "OK"]],
  },
  andrea: {
    id: "andrea",
    category: "otros",
    title: "Andrea S.",
    initials: "AS",
    role: "Coordinación RRPP y listas",
    productivity: "84 listas",
    costPerHour: "€44/h",
    liveNote: "84 check-ins RRPP · 3 upgrades gestionados",
    statusNote: "Online · Front desk · RRPP",
    tags: ["Interna", "RRPP", "Listas", "Front desk"],
    summaryRows: [["Permisos", "Listas, upgrades y soporte puerta", "Editable"], ["Última acción", "Upgrade VIP aprobado · 02:03", "Live"], ["Ritmo", "84 check-ins · 3 incidencias resueltas", "OK"], ["Impacto", "Deriva tráfico a VIP y puerta sin bloqueo", "OK"]],
    costRows: [["Modelo salarial", "€44/h evento", "Activo"], ["Coste en tiempo real", "€44.00/h", "Live"], ["Horas extra", "No previstas", "OK"], ["Bonus", "No aplica", "-"]],
    shiftRows: [["Turno evento", "22:30-05:30 · Front desk", "Asignado"], ["Cobertura", "Lista, upgrades, soporte RRPP", "Activo"], ["Vacaciones", "6 días disponibles", "OK"], ["Cumplimiento", "Check-in y notas al día", "OK"]],
    controlRows: [["Fichaje entrada", "22:24 · GPS puerta principal", "OK"], ["Dispositivo", "iPad check-in 02", "Online"], ["Alertas", "0 colas fuera de rango", "OK"], ["Checklist", "Listas y pulseras auditadas", "OK"]],
    profileRows: [["DNI", "***7710M", "Verificado"], ["Empresa", "OPSNIGHT Staff Internal", "Interno"], ["Tipo", "RRPP / Listas", "Activo"], ["Contacto", "+34 *** 771 · andrea@staff.local", "OK"], ["Documento", "Contrato + PRL + protección datos", "Completa"]],
  },
};

const mphCategoryOrder = ["barra", "seguridad", "vip", "otros"];

const mphCategoryData = {
  barra: {
    id: "barra",
    title: "Barra",
    subtitle: "4 barras operativas · 14 POS sincronizados · velocidad media 19s",
    icon: "sports_bar",
    iconClass: "mph-cat-barra",
    staffActive: "56",
    costPerHour: "€612",
    productivity: "€1,324",
    insights: [["Cobertura", "56 staff activos · Barra Central, B1, B2 y terraza", "Live"], ["Coste estimado cierre", "€4,896 con bonus velocidad y recargo nocturno", "OK"], ["Calidad operativa", "12 voids revisados · 0 descuadres críticos", "Controlado"]],
    staffIds: ["carlos", "lucas"],
  },
  seguridad: {
    id: "seguridad",
    title: "Seguridad",
    subtitle: "Accesos, perímetro y backstage con SLA y control de aforo",
    icon: "security",
    iconClass: "mph-cat-seg",
    staffActive: "38",
    costPerHour: "€426",
    productivity: "€892",
    insights: [["Cobertura", "38 agentes desplegados · puertas, VIP y perímetro", "Live"], ["Incidencias", "2 leves resueltas · 0 alarmas críticas", "Bajo"], ["Cumplimiento", "Control de listas, pulseras y cacheos dentro de SLA", "96%"]],
    staffIds: ["nuria", "raul"],
  },
  vip: {
    id: "vip",
    title: "VIP",
    subtitle: "Hostess, runners y floor managers conectados en directo",
    icon: "diamond",
    iconClass: "mph-cat-vip",
    staffActive: "18",
    costPerHour: "€220",
    productivity: "€1,742",
    insights: [["Cobertura", "18 perfiles activos · mesas V1-V10 y backstage", "Live"], ["Mínimos VIP", "€6,480 recuperados · upsell +14%", "OK"], ["Operativa", "3 pedidos en ruta · 1 mesa inactiva bajo seguimiento", "Acción"]],
    staffIds: ["elena", "juan"],
  },
  otros: {
    id: "otros",
    title: "Otros",
    subtitle: "Office, RRPP y soporte operativo sin venta directa imputada",
    icon: "more_horiz",
    iconClass: "mph-cat-otros",
    staffActive: "20",
    costPerHour: "€0",
    productivity: "€0",
    insights: [["Soporte", "Office, OCR, RRPP y front desk sincronizados", "Live"], ["Coste imputado", "Categoría auxiliar sin revenue directo atribuible", "Modelo"], ["Impacto", "3 upgrades, 2 OCR y cierre parcial preparados", "OK"]],
    staffIds: ["sofia", "andrea"],
  },
};

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
  guardarropia: { label: "Guardarropía", page: "tpv", catalog: "guardarropia" },
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
  guardarropia: [
    { id: "cloak-basic", name: "Ticket guardarropía", price: 3, tag: "Ticket", tone: "slate", icon: "checkroom", category: "Guardarropía" },
    { id: "cloak-fastlane", name: "Fast lane guardarropía", price: 5, tag: "Fast lane", tone: "amber", icon: "checkroom", category: "Guardarropía" },
    { id: "cloak-vip", name: "Guardarropía VIP", price: 8, tag: "VIP", tone: "violet", icon: "checkroom", category: "Guardarropía" },
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

const mphSupabaseRuntime = {
  productsBySection: {
    barra: [],
    taquilla: [],
    guardarropia: [],
    vip: [],
  },
  vipTables: [],
  vipReservations: [],
  capacityCounters: [],
};

const mphVenueProfiles = [
  { id: "kapital-madrid", name: "Kapital Madrid", logo: "K", logoClass: "mph-logo-k", baseRevenue: 34850, baseOccupancy: 78, baseMargin: 28.4, seed: 1.2 },
  { id: "barcelo-sevilla", name: "Barceló Sevilla", logo: "B", logoClass: "mph-logo-b", baseRevenue: 26300, baseOccupancy: 65, baseMargin: 24.1, seed: 2.6 },
  { id: "opium-barcelona", name: "Opium Barcelona", logo: "O", logoClass: "mph-logo-o", baseRevenue: 23150, baseOccupancy: 62, baseMargin: 23.5, seed: 4.1 },
  { id: "moma-valencia", name: "Moma Valencia", logo: "M", logoClass: "mph-logo-m", baseRevenue: 20880, baseOccupancy: 58, baseMargin: 21.2, seed: 5.4 },
];

const mphVenueOperations = {
  "kapital-madrid": {
    city: "Madrid",
    legalCapacity: 2100,
    revenueMix: { bars: 0.62, taquilla: 0.21, vip: 0.13, guardarropia: 0.04 },
    staffActiveBase: 42,
    bars: [
      { id: "b1", label: "B1", name: "Barra 1", subtitle: "Main room · lateral norte", share: 0.34, bank: "Sabadell", terminal: "Ingenico Move 5000", account: "ES91 **** 4820", operator: "Carlos R.", device: "Datáfono fijo + QR", mix: "62% NFC · 21% QR · 17% cashless", x: 18, y: 68 },
      { id: "b2", label: "B2", name: "Barra 2", subtitle: "Main room · speed rail", share: 0.27, bank: "CaixaBank", terminal: "PAX A920", account: "ES66 **** 1045", operator: "Lucas V.", device: "PAX móvil + caja rápida", mix: "58% NFC · 24% QR · 18% cashless", x: 35, y: 74 },
      { id: "b3", label: "B3", name: "Barra 3", subtitle: "VIP bridge", share: 0.21, bank: "Santander", terminal: "Verifone V400m", account: "ES54 **** 3398", operator: "Elena M.", device: "Verifone + split QR", mix: "49% QR · 39% NFC · 12% cashless", x: 64, y: 42 },
      { id: "b4", label: "B4", name: "Barra 4", subtitle: "Terraza interior", share: 0.18, bank: "BBVA", terminal: "SumUp Solo", account: "ES27 **** 7712", operator: "Andrei K.", device: "Terminal móvil outdoor", mix: "67% NFC · 19% QR · 14% cashless", x: 80, y: 60 },
    ],
    taquilla: [
      { id: "t1", label: "T1", name: "Taquilla 1", subtitle: "Walk-in principal", share: 0.58, bank: "CaixaBank", terminal: "PAX A920", account: "ES33 **** 9180", operator: "Andrea S.", device: "Terminal puerta 01", mix: "Walk-in 58% · anticipadas 34% · upgrades 8%", x: 12, y: 20 },
      { id: "t2", label: "T2", name: "Taquilla 2", subtitle: "Invitados y RRPP", share: 0.42, bank: "Sabadell", terminal: "Ingenico Desk 3500", account: "ES91 **** 4820", operator: "Marta P.", device: "Desk + scanner QR", mix: "RRPP 41% · guestlist 33% · cashless 26%", x: 30, y: 18 },
    ],
    vip: [
      { id: "v1", label: "V1", name: "VIP V1-V4", subtitle: "Botellas + mínimos", share: 0.57, bank: "Santander", terminal: "Verifone Carbon", account: "ES54 **** 3398", operator: "Elena M.", device: "Carbon + split pay", mix: "Botellas 72% · upgrades 18% · fees 10%", x: 70, y: 28 },
      { id: "v2", label: "V2", name: "VIP V5-V10", subtitle: "Terraza + backstage", share: 0.43, bank: "BBVA", terminal: "Stripe Tap to Pay", account: "ES27 **** 7712", operator: "Juan G.", device: "iPhone POS + QR mesa", mix: "Botellas 63% · mínimos 24% · extras 13%", x: 84, y: 22 },
    ],
    guardarropia: [
      { id: "g1", label: "G1", name: "Guardarropía principal", subtitle: "Chaquetas y fast-lane", share: 0.76, bank: "Sabadell", terminal: "SumUp Solo Lite", account: "ES91 **** 4820", operator: "Lucía T.", device: "Terminal móvil mostrador", mix: "Ticket físico 81% · QR 19%", x: 48, y: 84 },
      { id: "g2", label: "G2", name: "Guardarropía VIP", subtitle: "Backstage y reservado", share: 0.24, bank: "Santander", terminal: "Zettle Reader 2", account: "ES54 **** 3398", operator: "Nora B.", device: "Reader portátil VIP", mix: "Fast-lane 64% · extra bags 36%", x: 72, y: 82 },
    ],
    aforo: [
      { id: "a1", label: "E1", name: "Entrada principal", subtitle: "Picado general", share: 0.68, scannedBy: "Nuria P.", device: "iPhone Scanner 02", account: "Control acceso principal", mix: "Anticipadas 54% · RRPP 28% · walk-in 18%", x: 10, y: 16 },
      { id: "a2", label: "E2", name: "Entrada VIP", subtitle: "Invitados y mesas", share: 0.19, scannedBy: "Raúl C.", device: "iPhone Scanner VIP 01", account: "Control acceso VIP", mix: "Mesas 61% · upgrades 22% · invitados 17%", x: 82, y: 14 },
      { id: "a3", label: "E3", name: "Guest list / RRPP", subtitle: "Pulsera + validación", share: 0.13, scannedBy: "Andrea S.", device: "iPad Check-in 02", account: "Desk RRPP", mix: "RRPP 72% · guestlist 28%", x: 28, y: 12 },
    ],
  },
  "barcelo-sevilla": {
    city: "Sevilla",
    legalCapacity: 1600,
    revenueMix: { bars: 0.59, taquilla: 0.24, vip: 0.12, guardarropia: 0.05 },
    staffActiveBase: 31,
    bars: [
      { id: "b1", label: "B1", name: "Barra 1", subtitle: "Pista central", share: 0.44, bank: "CaixaBank", terminal: "Ingenico Move 5000", account: "ES14 **** 5502", operator: "Javi M.", device: "Datáfono fijo + QR", mix: "NFC 66% · QR 14% · cashless 20%", x: 22, y: 70 },
      { id: "b2", label: "B2", name: "Barra 2", subtitle: "Lateral escenario", share: 0.31, bank: "BBVA", terminal: "PAX A920 Pro", account: "ES81 **** 1904", operator: "Lola C.", device: "PAX móvil", mix: "NFC 61% · QR 22% · cashless 17%", x: 48, y: 62 },
      { id: "b3", label: "B3", name: "Barra terraza", subtitle: "Patio interior", share: 0.25, bank: "Santander", terminal: "SumUp Solo", account: "ES77 **** 4308", operator: "Álex R.", device: "Terminal móvil terraza", mix: "NFC 58% · QR 27% · cashless 15%", x: 78, y: 72 },
    ],
    taquilla: [
      { id: "t1", label: "T1", name: "Taquilla principal", subtitle: "Walk-in", share: 0.64, bank: "CaixaBank", terminal: "PAX A920", account: "ES14 **** 5502", operator: "Carla S.", device: "Terminal puerta", mix: "Walk-in 62% · anticipadas 24% · RRPP 14%", x: 14, y: 18 },
      { id: "t2", label: "T2", name: "Lista y reservas", subtitle: "RRPP / invitados", share: 0.36, bank: "Sabadell", terminal: "Ingenico Desk 3500", account: "ES45 **** 8801", operator: "Mireia N.", device: "Desk + QR", mix: "RRPP 51% · invitados 49%", x: 32, y: 16 },
    ],
    vip: [
      { id: "v1", label: "V1", name: "VIP Patio", subtitle: "Mesas premium", share: 0.63, bank: "Santander", terminal: "Verifone Carbon", account: "ES77 **** 4308", operator: "Sara G.", device: "POS VIP + split pay", mix: "Botellas 69% · mínimos 31%", x: 74, y: 28 },
      { id: "v2", label: "V2", name: "VIP Escenario", subtitle: "Front stage", share: 0.37, bank: "BBVA", terminal: "Stripe Tap to Pay", account: "ES81 **** 1904", operator: "Mario T.", device: "iPhone Tap to Pay", mix: "Botellas 74% · extras 26%", x: 60, y: 26 },
    ],
    guardarropia: [
      { id: "g1", label: "G1", name: "Guardarropía central", subtitle: "Acceso principal", share: 1, bank: "CaixaBank", terminal: "Zettle Reader 2", account: "ES14 **** 5502", operator: "Elisa D.", device: "Reader mostrador", mix: "Ticket físico 76% · QR 24%", x: 54, y: 84 },
    ],
    aforo: [
      { id: "a1", label: "E1", name: "Entrada principal", subtitle: "Escaneo general", share: 0.71, scannedBy: "Nuria P.", device: "Scanner puerta 01", account: "Control principal", mix: "Anticipadas 47% · walk-in 31% · RRPP 22%", x: 12, y: 14 },
      { id: "a2", label: "E2", name: "Acceso patio VIP", subtitle: "Control pulsera", share: 0.17, scannedBy: "Raúl C.", device: "Scanner VIP 02", account: "VIP patio", mix: "VIP 73% · invitados 27%", x: 78, y: 14 },
      { id: "a3", label: "E3", name: "Lista lateral", subtitle: "RRPP", share: 0.12, scannedBy: "Mireia N.", device: "iPad RRPP", account: "Desk lateral", mix: "RRPP 82% · guestlist 18%", x: 28, y: 12 },
    ],
  },
  "opium-barcelona": {
    city: "Barcelona",
    legalCapacity: 1000,
    revenueMix: { bars: 0.57, taquilla: 0.23, vip: 0.16, guardarropia: 0.04 },
    staffActiveBase: 24,
    bars: [
      { id: "b1", label: "B1", name: "Barra principal", subtitle: "Frente pista", share: 0.52, bank: "Santander", terminal: "Verifone V400m", account: "ES64 **** 4412", operator: "Claudia F.", device: "Verifone fijo", mix: "NFC 63% · QR 21% · cashless 16%", x: 24, y: 72 },
      { id: "b2", label: "B2", name: "Barra beach", subtitle: "Zona terraza", share: 0.28, bank: "Sabadell", terminal: "SumUp Solo", account: "ES88 **** 1205", operator: "Bruno A.", device: "Terminal móvil terraza", mix: "NFC 59% · QR 26% · cashless 15%", x: 74, y: 74 },
      { id: "b3", label: "B3", name: "Backstage bar", subtitle: "Artistas y staff", share: 0.20, bank: "BBVA", terminal: "PAX A920", account: "ES17 **** 3309", operator: "Mia K.", device: "PAX backstage", mix: "NFC 54% · QR 32% · cashless 14%", x: 66, y: 40 },
    ],
    taquilla: [
      { id: "t1", label: "T1", name: "Puerta club", subtitle: "Walk-in y QR", share: 1, bank: "Santander", terminal: "Ingenico Move 5000", account: "ES64 **** 4412", operator: "David L.", device: "Desk puerta + scanner", mix: "Walk-in 49% · anticipadas 38% · RRPP 13%", x: 14, y: 18 },
    ],
    vip: [
      { id: "v1", label: "V1", name: "VIP Sea View", subtitle: "Mesas premium", share: 0.61, bank: "BBVA", terminal: "Stripe Tap to Pay", account: "ES17 **** 3309", operator: "Elena M.", device: "Tap to Pay + QR mesa", mix: "Mínimos 64% · botellas 36%", x: 82, y: 26 },
      { id: "v2", label: "V2", name: "VIP Stage", subtitle: "Front artist", share: 0.39, bank: "Sabadell", terminal: "Zettle Reader 2", account: "ES88 **** 1205", operator: "Juan G.", device: "Reader VIP", mix: "Botellas 72% · extras 28%", x: 62, y: 24 },
    ],
    guardarropia: [
      { id: "g1", label: "G1", name: "Guardarropía club", subtitle: "Entrada única", share: 1, bank: "Santander", terminal: "SumUp Air", account: "ES64 **** 4412", operator: "Sara T.", device: "Reader mostrador", mix: "Físico 79% · QR 21%", x: 48, y: 84 },
    ],
    aforo: [
      { id: "a1", label: "E1", name: "Entrada club", subtitle: "Scanner general", share: 0.76, scannedBy: "Nuria P.", device: "Scanner puerta 01", account: "Control general", mix: "Anticipadas 52% · walk-in 34% · RRPP 14%", x: 12, y: 14 },
      { id: "a2", label: "E2", name: "VIP access", subtitle: "Pulsera y reservas", share: 0.24, scannedBy: "Raúl C.", device: "Scanner VIP 01", account: "Control VIP", mix: "VIP 68% · invitados 32%", x: 80, y: 14 },
    ],
  },
  "moma-valencia": {
    city: "Valencia",
    legalCapacity: 900,
    revenueMix: { bars: 0.55, taquilla: 0.26, vip: 0.13, guardarropia: 0.06 },
    staffActiveBase: 19,
    bars: [
      { id: "b1", label: "B1", name: "Barra central", subtitle: "Sala principal", share: 0.49, bank: "CaixaBank", terminal: "PAX A920", account: "ES40 **** 2401", operator: "Leo S.", device: "PAX fijo", mix: "NFC 61% · QR 23% · cashless 16%", x: 28, y: 72 },
      { id: "b2", label: "B2", name: "Barra lateral", subtitle: "Zona lounge", share: 0.29, bank: "Sabadell", terminal: "Ingenico Move 5000", account: "ES22 **** 8104", operator: "Paula H.", device: "Move + QR", mix: "NFC 57% · QR 28% · cashless 15%", x: 62, y: 66 },
      { id: "b3", label: "B3", name: "Barra VIP", subtitle: "Reservados", share: 0.22, bank: "BBVA", terminal: "Stripe Tap to Pay", account: "ES18 **** 6607", operator: "Elena M.", device: "iPhone POS VIP", mix: "QR mesa 42% · NFC 46% · cashless 12%", x: 80, y: 34 },
    ],
    taquilla: [
      { id: "t1", label: "T1", name: "Taquilla principal", subtitle: "Walk-in", share: 0.73, bank: "CaixaBank", terminal: "Desk 3500", account: "ES40 **** 2401", operator: "Andrea S.", device: "Desk + scanner", mix: "Walk-in 56% · anticipadas 29% · RRPP 15%", x: 16, y: 18 },
      { id: "t2", label: "T2", name: "Taquilla RRPP", subtitle: "Listas", share: 0.27, bank: "Sabadell", terminal: "SumUp Solo", account: "ES22 **** 8104", operator: "Clara M.", device: "Solo mostrador", mix: "RRPP 69% · guestlist 31%", x: 30, y: 16 },
    ],
    vip: [
      { id: "v1", label: "V1", name: "VIP Lounge", subtitle: "Mesas reservadas", share: 1, bank: "BBVA", terminal: "Verifone Carbon", account: "ES18 **** 6607", operator: "Juan G.", device: "Carbon VIP", mix: "Botellas 74% · extras 26%", x: 78, y: 24 },
    ],
    guardarropia: [
      { id: "g1", label: "G1", name: "Guardarropía general", subtitle: "Fast check", share: 1, bank: "CaixaBank", terminal: "Zettle Reader 2", account: "ES40 **** 2401", operator: "Sonia V.", device: "Reader mostrador", mix: "Físico 74% · QR 26%", x: 52, y: 84 },
    ],
    aforo: [
      { id: "a1", label: "E1", name: "Entrada principal", subtitle: "Control general", share: 0.81, scannedBy: "Nuria P.", device: "Scanner puerta", account: "Control principal", mix: "Anticipadas 49% · walk-in 36% · RRPP 15%", x: 12, y: 14 },
      { id: "a2", label: "E2", name: "Acceso VIP", subtitle: "Pulseras", share: 0.19, scannedBy: "Raúl C.", device: "Scanner VIP", account: "Control VIP", mix: "VIP 71% · invitados 29%", x: 78, y: 14 },
    ],
  },
};

const mphLocalDetailState = {
  venueId: "kapital-madrid",
  section: "bars",
  pointId: "b1",
  selectedDate: new Date(),
};

const mphVenueSeries = mphVenueProfiles.reduce((acc, profile) => {
  acc[profile.id] = buildMphVenueSeries(profile);
  return acc;
}, {});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeRangeToken(value = "") {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatCompactCurrency(value) {
  return `€${Math.round(value).toLocaleString("es-ES")}`;
}

function formatPreciseCurrency(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value));
}

function formatFinanceKpiCurrency(value) {
  const amount = Math.abs(Number(value) || 0);
  if (amount >= 1000000) {
    return `€${(amount / 1000000).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
  }
  if (amount >= 10000) {
    return `€${(amount / 1000).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}K`;
  }
  return formatCompactCurrency(amount);
}

function formatSignedPercent(value) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${prefix}${Math.abs(value).toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

function formatSignedPoints(value) {
  const prefix = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${prefix}${Math.abs(value).toLocaleString("es-ES", {
    minimumFractionDigits: Math.abs(value) < 1 ? 1 : 0,
    maximumFractionDigits: 1,
  })} pp`;
}

function formatMphInputDate(date) {
  return normalizeMphDate(date).toISOString().slice(0, 10);
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseMphNumber(value, fallback = 0) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isMphSameCalendarDate(value, date) {
  if (!value) return false;
  return String(value).slice(0, 10) === formatMphInputDate(date);
}

function getMphTrendMeta(value, neutralThreshold = 0.15) {
  if (Math.abs(value) < neutralThreshold) {
    return { className: "flat", icon: "remove" };
  }
  return value > 0
    ? { className: "up", icon: "arrow_upward" }
    : { className: "down", icon: "arrow_downward" };
}

function setMphTrendNode(selector, text, value, neutralThreshold = 0.15) {
  const node = document.querySelector(selector);
  if (!node) return;
  const meta = getMphTrendMeta(value, neutralThreshold);
  const labelId = node.querySelector("span:last-child")?.id;
  node.classList.remove("up", "down", "flat");
  node.classList.add(meta.className);
  node.innerHTML = `<span class="material-symbols-outlined">${meta.icon}</span><span${labelId ? ` id="${labelId}"` : ""}>${text}</span>`;
}

function setMphBadgeNode(selector, text, tone) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.textContent = text;
  node.classList.remove("up", "down", "neutral");
  node.classList.add(tone);
}

function buildMphVenueSeries(profile, days = 120) {
  const endDate = new Date();
  endDate.setHours(12, 0, 0, 0);
  return Array.from({ length: days }, (_, index) => {
    const offset = days - index - 1;
    const date = new Date(endDate);
    date.setDate(endDate.getDate() - offset);
    const weekDay = date.getDay();
    const weeklyBoost = [0.9, 0.93, 0.98, 1.02, 1.08, 1.18, 1.12][weekDay];
    const wave = 1 + Math.sin((index + profile.seed) * 0.33) * 0.06 + Math.cos((index + profile.seed) * 0.17) * 0.04;
    const revenue = Math.round(profile.baseRevenue * weeklyBoost * wave);
    const occupancy = clamp(
      Math.round(profile.baseOccupancy + (weeklyBoost - 1) * 34 + Math.sin((index + profile.seed) * 0.45) * 4 + Math.cos((index + profile.seed) * 0.14) * 2),
      42,
      98
    );
    const margin = clamp(
      Number((profile.baseMargin + (weeklyBoost - 1) * 4.5 + Math.cos((index + profile.seed) * 0.39) * 1.2).toFixed(1)),
      18,
      39.5
    );
    return { revenue, occupancy, margin };
  });
}

function resolveMphRange(periodKey, referenceDate = new Date()) {
  const token = normalizeRangeToken(periodKey || "today");
  if (token.includes("hoy") || token === "today" || token === "1d") {
    return { key: "today", days: 1, comparisonLabel: "vs ayer" };
  }
  if (token === "mtd") {
    return { key: "mtd", days: referenceDate.getDate(), comparisonLabel: "vs tramo anterior" };
  }
  const monthMatch = token.match(/(\d+)\s*mes/);
  if (monthMatch) {
    const months = Number(monthMatch[1]);
    return {
      key: `${months}m`,
      days: months * 30,
      comparisonLabel: `vs ${months} ${months === 1 ? "mes previo" : "meses previos"}`,
    };
  }
  const dayMatch = token.match(/(\d+)\s*(d|dia|dias)/);
  if (dayMatch) {
    const days = Number(dayMatch[1]);
    return {
      key: `${days}d`,
      days,
      comparisonLabel: days === 7 ? "vs 7 días previos" : days === 30 ? "vs 30 días previos" : `vs ${days} días previos`,
    };
  }
  return { key: "today", days: 1, comparisonLabel: "vs ayer" };
}

function summarizeMphVenueSlice(slice) {
  if (!slice.length) return { revenue: 0, occupancy: 0, margin: 0 };
  const totals = slice.reduce((acc, item) => {
    acc.revenue += item.revenue;
    acc.occupancy += item.occupancy;
    acc.margin += item.margin;
    return acc;
  }, { revenue: 0, occupancy: 0, margin: 0 });
  return {
    revenue: totals.revenue,
    occupancy: Math.round(totals.occupancy / slice.length),
    margin: Number((totals.margin / slice.length).toFixed(1)),
  };
}

function getMphVenueMetrics(profile, periodKey) {
  const range = resolveMphRange(periodKey);
  const series = mphVenueSeries[profile.id] || [];
  const days = clamp(range.days, 1, Math.max(1, Math.floor(series.length / 2)));
  const currentSlice = series.slice(-days);
  const previousSlice = series.slice(-(days * 2), -days);
  const current = summarizeMphVenueSlice(currentSlice);
  const previous = summarizeMphVenueSlice(previousSlice.length ? previousSlice : currentSlice);
  const delta = previous.revenue ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
  const trendClass = Math.abs(delta) < 0.15 ? "flat" : delta > 0 ? "up" : "down";
  const trendIcon = trendClass === "flat" ? "remove" : delta > 0 ? "arrow_upward" : "arrow_downward";
  return {
    ...profile,
    ...current,
    delta,
    trendClass,
    trendIcon,
    comparisonLabel: range.comparisonLabel,
    score: current.revenue * (current.margin / 100) * (0.55 + current.occupancy / 100),
  };
}

function renderMphVenueRows(periodKey = "today") {
  const venueList = document.getElementById("mphVenueList");
  if (!venueList) return;
  const venues = mphVenueProfiles
    .map((profile) => getMphVenueMetrics(profile, periodKey))
    .sort((a, b) => b.score - a.score);
  const bestVenueId = venues[0]?.id;
  venueList.innerHTML = venues.map((venue) => `
    <button class="mph-venue-row ${venue.id === bestVenueId ? "best" : ""}" data-mph-goto="local-detail" data-mph-venue-id="${venue.id}" type="button">
      <div class="mph-venue-logo ${venue.logoClass}">${venue.logo}</div>
      <div class="mph-venue-info">
        <div class="mph-venue-name-row">
          <strong>${venue.name}</strong>
          ${venue.id === bestVenueId ? '<span class="mph-best-badge">Mejor rendimiento</span>' : ""}
        </div>
        <div class="mph-venue-stats">
          <div><small>Facturación</small><b>${formatCompactCurrency(venue.revenue)}</b></div>
          <div><small>Ocupación</small><b>${venue.occupancy}%</b></div>
          <div><small>Margen</small><b>${venue.margin.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%</b></div>
        </div>
        <span class="mph-trend-sm ${venue.trendClass}">
          <span class="material-symbols-outlined">${venue.trendIcon}</span>${formatSignedPercent(venue.delta)} ${venue.comparisonLabel}
        </span>
      </div>
      <span class="mph-venue-chevron" aria-hidden="true">&gt;</span>
    </button>
  `).join("");
}

function getMphVenueProfileById(venueId) {
  return mphVenueProfiles.find((profile) => profile.id === venueId) || mphVenueProfiles[0];
}

function normalizeMphDate(date) {
  const normalized = new Date(date);
  normalized.setHours(12, 0, 0, 0);
  return normalized;
}

function getMphDayIndex(date) {
  const baseDate = new Date(2024, 0, 1, 12, 0, 0, 0);
  return Math.round((normalizeMphDate(date) - baseDate) / 86400000);
}

function getEquivalentWeekdayLastYear(date) {
  const source = normalizeMphDate(date);
  const nthWeek = Math.floor((source.getDate() - 1) / 7) + 1;
  const year = source.getFullYear() - 1;
  const month = source.getMonth();
  const weekday = source.getDay();
  const firstDay = new Date(year, month, 1);
  const offset = (weekday - firstDay.getDay() + 7) % 7;
  let day = 1 + offset + ((nthWeek - 1) * 7);
  const lastDay = new Date(year, month + 1, 0).getDate();
  if (day > lastDay) day -= 7;
  return normalizeMphDate(new Date(year, month, day));
}

function formatMphShortDate(date) {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(normalizeMphDate(date));
}

function formatMphMonthYear(date) {
  return new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric",
  }).format(normalizeMphDate(date));
}

function formatMphEquivalentComparison(date, compareDate) {
  const normalized = normalizeMphDate(date);
  const nthWeek = Math.floor((normalized.getDate() - 1) / 7) + 1;
  const weekday = new Intl.DateTimeFormat("es-ES", { weekday: "long" }).format(normalized);
  const weekLabel = `${nthWeek}a semana de ${formatMphMonthYear(compareDate)}`;
  return `vs ${weekday} equivalente · ${weekLabel}`;
}

function computeMphVenueDayMetrics(venueId, rawDate) {
  const venueProfile = getMphVenueProfileById(venueId);
  const opsProfile = mphVenueOperations[venueId] || mphVenueOperations["kapital-madrid"];
  const date = normalizeMphDate(rawDate);
  const index = getMphDayIndex(date);
  const weekDay = date.getDay();
  const weeklyBoost = [0.9, 0.93, 0.98, 1.02, 1.08, 1.18, 1.12][weekDay];
  const wave = 1 + Math.sin((index + venueProfile.seed) * 0.33) * 0.06 + Math.cos((index + venueProfile.seed) * 0.17) * 0.04;
  const yearGrowthFactor = 1 + ((date.getFullYear() - 2025) * 0.08);
  const revenue = Math.round(venueProfile.baseRevenue * weeklyBoost * wave * yearGrowthFactor);
  const occupancyPct = clamp(
    Math.round(venueProfile.baseOccupancy + (weeklyBoost - 1) * 34 + Math.sin((index + venueProfile.seed) * 0.45) * 4 + Math.cos((index + venueProfile.seed) * 0.14) * 2),
    42,
    98
  );
  const margin = clamp(
    Number((venueProfile.baseMargin + (weeklyBoost - 1) * 4.5 + Math.cos((index + venueProfile.seed) * 0.39) * 1.2).toFixed(1)),
    18,
    39.5
  );
  const realCapacity = Math.round((opsProfile.legalCapacity * occupancyPct) / 100);
  const barsRevenue = Math.round(revenue * opsProfile.revenueMix.bars);
  const taquillaRevenue = Math.round(revenue * opsProfile.revenueMix.taquilla);
  const vipRevenue = Math.round(revenue * opsProfile.revenueMix.vip);
  const guardarropiaRevenue = Math.round(revenue * opsProfile.revenueMix.guardarropia);
  const avgTicket = revenue / Math.max(realCapacity, 1);
  const queueMinutes = Math.max(4, Math.round(8 + ((weeklyBoost - 1) * 36) + Math.sin((index + 2) * 0.18) * 4));
  const staffActive = Math.max(opsProfile.staffActiveBase, Math.round(opsProfile.staffActiveBase + ((weeklyBoost - 1) * 24) + Math.cos((index + venueProfile.seed) * 0.16) * 2));
  return {
    venueProfile,
    opsProfile,
    date,
    revenue,
    occupancyPct,
    margin,
    realCapacity,
    avgTicket,
    queueMinutes,
    staffActive,
    sections: {
      bars: barsRevenue,
      taquilla: taquillaRevenue,
      vip: vipRevenue,
      guardarropia: guardarropiaRevenue,
    },
  };
}

function getMphRangeDates(periodKey, rawDate) {
  const referenceDate = normalizeMphDate(rawDate);
  const range = resolveMphRange(periodKey, referenceDate);
  let startDate = normalizeMphDate(referenceDate);
  if (range.key === "mtd") {
    startDate = normalizeMphDate(new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1));
  } else {
    startDate.setDate(referenceDate.getDate() - range.days + 1);
  }
  const dates = [];
  for (let cursor = normalizeMphDate(startDate); cursor <= referenceDate; cursor.setDate(cursor.getDate() + 1)) {
    dates.push(normalizeMphDate(cursor));
  }
  return {
    ...range,
    dates,
    startDate: normalizeMphDate(startDate),
    endDate: referenceDate,
    days: dates.length,
  };
}

function aggregateMphFinanceSnapshot(dates) {
  if (!dates.length) {
    return {
      revenue: 0,
      legalCapacity: 0,
      realCapacity: 0,
      avgTicket: 0,
      avgMarginPct: 0,
      grossMarginPct: 0,
      grossMarginValue: 0,
      ebitdaPct: 0,
      ebitdaValue: 0,
      costOfSalesPct: 0,
      costOfSalesValue: 0,
      operatingCostsPct: 0,
      operatingCostsValue: 0,
      revPerSqm: 0,
      breakdown: {
        staff: 0,
        suppliers: 0,
        rent: 0,
        marketing: 0,
        security: 0,
      },
    };
  }

  const totals = dates.reduce((acc, date) => {
    mphVenueProfiles.forEach((profile) => {
      const snapshot = computeMphVenueDayMetrics(profile.id, date);
      acc.revenue += snapshot.revenue;
      acc.legalCapacity += snapshot.opsProfile.legalCapacity;
      acc.realCapacity += snapshot.realCapacity;
      acc.marginWeighted += snapshot.margin * snapshot.revenue;
      acc.daySeed += getMphDayIndex(date) + profile.seed;
    });
    return acc;
  }, {
    revenue: 0,
    legalCapacity: 0,
    realCapacity: 0,
    marginWeighted: 0,
    daySeed: 0,
  });

  const avgMarginPct = totals.revenue ? totals.marginWeighted / totals.revenue : 0;
  const occupancyPct = totals.legalCapacity ? (totals.realCapacity / totals.legalCapacity) * 100 : 0;
  const smoothingSeed = totals.daySeed / Math.max(1, dates.length * mphVenueProfiles.length);
  const grossMarginPct = clamp(76.5 + (occupancyPct * 0.042) + Math.sin(smoothingSeed * 0.11) * 1.6, 74.5, 82.8);
  const ebitdaPct = clamp(avgMarginPct + 2.4 + Math.cos(smoothingSeed * 0.09) * 0.8, 21.5, grossMarginPct - 4.2);
  const costOfSalesPct = 100 - grossMarginPct;
  const revenue = totals.revenue;
  const grossMarginValue = revenue * (grossMarginPct / 100);
  const ebitdaValue = revenue * (ebitdaPct / 100);
  const operatingCostsValue = Math.max(0, grossMarginValue - ebitdaValue);
  const operatingCostsPct = revenue ? (operatingCostsValue / revenue) * 100 : 0;
  const averageArea = totals.legalCapacity * 0.35;
  const avgTicket = totals.realCapacity ? revenue / totals.realCapacity : 0;
  const revPerSqm = averageArea ? revenue / averageArea : 0;
  const breakdown = {
    staff: operatingCostsValue * 0.26,
    suppliers: revenue * (costOfSalesPct / 100),
    rent: operatingCostsValue * 0.42,
    marketing: operatingCostsValue * 0.18,
    security: operatingCostsValue * 0.14,
  };

  return {
    revenue,
    legalCapacity: totals.legalCapacity,
    realCapacity: totals.realCapacity,
    avgTicket,
    avgMarginPct,
    grossMarginPct,
    grossMarginValue,
    ebitdaPct,
    ebitdaValue,
    costOfSalesPct,
    costOfSalesValue: breakdown.suppliers,
    operatingCostsPct,
    operatingCostsValue,
    revPerSqm,
    breakdown,
  };
}

function computeMphFinanceMetrics(periodKey, rawDate) {
  const currentRange = getMphRangeDates(periodKey, rawDate);
  const previousEnd = normalizeMphDate(new Date(currentRange.startDate));
  previousEnd.setDate(previousEnd.getDate() - 1);
  const previousRange = getMphRangeDates(`${currentRange.days}d`, previousEnd);
  const current = aggregateMphFinanceSnapshot(currentRange.dates);
  const previous = aggregateMphFinanceSnapshot(previousRange.dates);
  return { currentRange, previousRange, current, previous };
}

function getMphLocalDateOptions() {
  const today = normalizeMphDate(new Date());
  const options = [0, 1, 7, 14, 30].map((offset) => {
    const optionDate = new Date(today);
    optionDate.setDate(today.getDate() - offset);
    const label = offset === 0
      ? `Hoy · ${formatMphShortDate(optionDate)}`
      : offset === 1
        ? `Ayer · ${formatMphShortDate(optionDate)}`
        : `${offset} días · ${formatMphShortDate(optionDate)}`;
    return {
      key: normalizeMphDate(optionDate).toISOString(),
      date: normalizeMphDate(optionDate),
      label,
    };
  });
  const selectedKey = normalizeMphDate(mphLocalDetailState.selectedDate).toISOString();
  if (!options.some((option) => option.key === selectedKey)) {
    options.unshift({
      key: selectedKey,
      date: normalizeMphDate(mphLocalDetailState.selectedDate),
      label: formatMphShortDate(mphLocalDetailState.selectedDate),
    });
  }
  return options;
}

function buildMphRevenueTimeline(snapshot) {
  const checkpoints = [0, 4, 8, 12, 16, 20, 24];
  const seed = getMphDayIndex(snapshot.date) + snapshot.venueProfile.seed;
  const baseSegments = [0, 0.02, 0.05, 0.12, 0.22, 0.34, 0.25];
  const dynamicSegments = baseSegments.map((weight, index) => index === 0
    ? 0
    : Math.max(0.01, weight * (1 + Math.sin((seed + index) * 0.28) * 0.18 + Math.cos((seed + index) * 0.17) * 0.08))
  );
  const totalWeight = dynamicSegments.slice(1).reduce((sum, weight) => sum + weight, 0);
  let runningShare = 0;
  return checkpoints.map((hour, index) => {
    runningShare = index === 0 ? 0 : runningShare + (dynamicSegments[index] / totalWeight);
    return {
      hour,
      value: Math.round(snapshot.revenue * clamp(runningShare, 0, 1)),
    };
  });
}

function renderMphLocalChart(snapshot, compareSnapshot) {
  const chart = document.getElementById("mphLocalChart");
  if (!chart) return;
  const currentSeries = buildMphRevenueTimeline(snapshot);
  const compareSeries = buildMphRevenueTimeline(compareSnapshot);
  const xStart = 32;
  const xEnd = 298;
  const yTop = 6;
  const yBottom = 68;
  const maxValue = Math.max(
    currentSeries[currentSeries.length - 1]?.value || snapshot.revenue,
    compareSeries[compareSeries.length - 1]?.value || compareSnapshot.revenue,
    20000
  );
  const axisMax = Math.ceil(maxValue / 5000) * 5000;
  const mapX = (hour) => xStart + ((xEnd - xStart) * hour) / 24;
  const mapY = (value) => yBottom - ((yBottom - yTop) * value) / axisMax;
  const buildLinePath = (series) => series.map((point, index) => `${index === 0 ? "M" : "L"}${mapX(point.hour)},${mapY(point.value)}`).join(" ");
  const currentPath = buildLinePath(currentSeries);
  const comparePath = buildLinePath(compareSeries);
  const currentArea = `${currentPath} L${mapX(24)},${yBottom} L${mapX(0)},${yBottom} Z`;
  const yTicks = [0, axisMax / 3, (axisMax / 3) * 2, axisMax];
  const xLabels = [
    { hour: 0, label: "00:00" },
    { hour: 6, label: "06:00" },
    { hour: 12, label: "12:00" },
    { hour: 18, label: "18:00" },
    { hour: 24, label: "00:00" },
  ];
  chart.innerHTML = `
    <defs>
      <linearGradient id="mphChartGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#34c759" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#34c759" stop-opacity="0"/>
      </linearGradient>
    </defs>
    ${yTicks.map((value) => `
      <line x1="${xStart}" y1="${mapY(value)}" x2="${xEnd}" y2="${mapY(value)}" stroke="#f0f0f2" stroke-width="0.8"/>
      <text x="28" y="${mapY(value) + 3}" font-size="8" fill="#c7c7cc" font-family="-apple-system,sans-serif" text-anchor="end">${value === 0 ? "0" : `${Math.round(value / 1000)}K`}</text>
    `).join("")}
    <path d="${comparePath}" stroke="#c7c7cc" stroke-width="1.6" stroke-dasharray="4 4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${currentArea}" fill="url(#mphChartGrad2)"/>
    <path d="${currentPath}" stroke="#34c759" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${xLabels.map((item) => `
      <text x="${mapX(item.hour)}" y="82" font-size="8" fill="#c7c7cc" font-family="-apple-system,sans-serif" text-anchor="middle">${item.label}</text>
    `).join("")}
  `;
}

function buildMphLocalSectionRows(sectionKey, point, snapshot, categoryTotal) {
  if (sectionKey === "aforo") {
    const scannedCount = Number.isFinite(point.counterValue) ? point.counterValue : Math.round(snapshot.realCapacity * point.share);
    const legalQuota = Math.round(snapshot.opsProfile.legalCapacity * point.share);
    return {
      metrics: [
        { label: "Picados", value: scannedCount.toLocaleString("es-ES") },
        { label: "Cupo legal", value: legalQuota.toLocaleString("es-ES") },
        { label: "Ritmo", value: `${Math.round((scannedCount / Math.max(legalQuota, 1)) * 100)}%` },
      ],
      rows: [
        ["Picado por", point.scannedBy, "Live"],
        ["Dispositivo", point.device, "OK"],
        ["Canal", point.account, "Control"],
        ["Mix acceso", point.mix, "Detalle"],
      ],
    };
  }
  if (sectionKey === "vip" && point.status) {
    return {
      metrics: [
        { label: "Mesa", value: point.label },
        { label: "Mínimo", value: formatPreciseCurrency(point.reservationMinimum || point.minimumSpend || 0) },
        { label: "Estado", value: point.statusLabel || point.status },
      ],
      rows: [
        ["Reserva", point.reservationClient || "Sin reserva activa", point.reservationStatus ? point.reservationStatus.toUpperCase() : "Libre"],
        ["Comensales", point.reservationGuests ? `${point.reservationGuests} pax` : "Pendiente", "Mesa"],
        ["Señal", formatPreciseCurrency(point.reservationDeposit || 0), point.reservationDeposit ? "Cobro" : "Pendiente"],
        ["Zona", point.device || point.subtitle, "Live"],
        ["Responsable", point.operator || "VIP", "Staff"],
        ["Referencia", point.account || "Control VIP", "Control"],
        ["Mix servicio", point.mix || "Detalle VIP", "Detalle"],
      ],
    };
  }
  const amount = Number((categoryTotal * point.share).toFixed(2));
  const tickets = Math.max(12, Math.round(amount / Math.max(snapshot.avgTicket * (sectionKey === "vip" ? 3.8 : sectionKey === "guardarropia" ? 6.4 : 1), 1)));
  return {
    metrics: [
      { label: "Facturación", value: formatPreciseCurrency(amount) },
      { label: "Tickets", value: tickets.toLocaleString("es-ES") },
      { label: "Mix", value: `${Math.round(point.share * 100)}%` },
    ],
    rows: [
      ["Datáfono", point.terminal, "Live"],
      ["Banco", point.bank, "OK"],
      ["Cuenta asociada", point.account, "Cuenta"],
      ["Dónde se cobra", point.device, "Operativo"],
      ["Responsable", point.operator, "Staff"],
      ["Mix cobro", point.mix, "Detalle"],
    ],
  };
}

function getTpvCatalogProducts(catalogKey) {
  const remoteProducts = mphSupabaseRuntime.productsBySection[catalogKey];
  if (Array.isArray(remoteProducts) && remoteProducts.length) return remoteProducts;
  return tpvCatalogs[catalogKey] || [];
}

function getTpvProductById(id) {
  const remoteMatch = Object.values(mphSupabaseRuntime.productsBySection)
    .flat()
    .find((product) => product.id === id);
  return remoteMatch || tpvProductsById[id];
}

function buildMphVipMapSeed(index, count) {
  const columns = count <= 4 ? 2 : count <= 8 ? 4 : 5;
  const row = Math.floor(index / columns);
  const col = index % columns;
  const x = Math.min(86, 18 + (col * (62 / Math.max(columns - 1, 1))));
  const y = Math.min(72, 24 + (row * 18));
  return { x, y };
}

function getVipActiveReservation(tableId, date = mphLocalDetailState.selectedDate) {
  return mphSupabaseRuntime.vipReservations.find((item) =>
    item.vip_table_id === tableId
    && isMphSameCalendarDate(item.reservation_date, date)
    && ["pending", "confirmed", "seated"].includes(item.status)
  );
}

function getMphLocalSectionItems(venueId, sectionKey) {
  const opsProfile = mphVenueOperations[venueId] || mphVenueOperations["kapital-madrid"];
  const appVenueId = window.mphSupabase?.config?.appVenueId || "kapital-madrid";

  if (venueId === appVenueId && sectionKey === "vip" && mphSupabaseRuntime.vipTables.length) {
    return mphSupabaseRuntime.vipTables.map((table, index, array) => {
      const meta = table.metadata || {};
      const reservation = getVipActiveReservation(table.id, mphLocalDetailState.selectedDate);
      const fallback = buildMphVipMapSeed(index, array.length);
      return {
        id: table.id,
        label: table.code,
        name: table.name,
        subtitle: meta.group || table.zone || "Mesa VIP",
        share: 1 / Math.max(array.length, 1),
        capacity: Number(table.capacity || 0),
        status: table.status,
        statusLabel: ({
          available: "Libre",
          reserved: "Reservada",
          occupied: "Ocupada",
          blocked: "Bloqueada",
          closed: "Cerrada",
        })[table.status] || table.status,
        reservationId: reservation?.id || null,
        reservationStatus: reservation?.status || null,
        reservationClient: reservation?.client_name || null,
        reservationGuests: Number(reservation?.guests_count || 0),
        reservationMinimum: Number(reservation?.minimum_spend ?? table.minimum_spend ?? 0),
        reservationDeposit: Number(reservation?.deposit_amount || 0),
        reservationNotes: reservation?.notes || "",
        minimumSpend: Number(table.minimum_spend || 0),
        bank: meta.bank || "Cobro central VIP",
        terminal: meta.terminal || "POS VIP",
        account: meta.account || `Min. ${formatPreciseCurrency(table.minimum_spend || 0)}`,
        operator: meta.operator || "Floor VIP",
        device: meta.device || table.zone || "Servicio en mesa",
        mix: meta.mix || `Estado ${table.status}`,
        x: typeof meta.x === "number" ? meta.x : fallback.x,
        y: typeof meta.y === "number" ? meta.y : fallback.y,
      };
    });
  }

  if (venueId === appVenueId && sectionKey === "aforo" && mphSupabaseRuntime.capacityCounters.length) {
    return mphSupabaseRuntime.capacityCounters.map((counter, index) => {
      const meta = counter.metadata || {};
      const fallback = [
        { x: 10, y: 16 },
        { x: 82, y: 14 },
        { x: 28, y: 12 },
      ][index] || { x: 18 + (index * 14), y: 16 };
      return {
        id: counter.id,
        label: meta.label || counter.code,
        name: counter.name,
        subtitle: meta.subtitle || "Control acceso",
        share: 1 / Math.max(mphSupabaseRuntime.capacityCounters.length, 1),
        counterValue: Number(counter.counter_value || 0),
        scannedBy: meta.operator || "Control acceso",
        device: meta.device || "Scanner acceso",
        account: meta.account || counter.direction_mode,
        mix: meta.mix || `${counter.counter_value.toLocaleString("es-ES")} registrados`,
        x: typeof meta.x === "number" ? meta.x : fallback.x,
        y: typeof meta.y === "number" ? meta.y : fallback.y,
      };
    });
  }

  return opsProfile[sectionKey] || [];
}

function renderMphLocalDateMenu() {
  const menu = document.getElementById("mphLocalDateMenu");
  if (!menu) return;
  const selectedKey = normalizeMphDate(mphLocalDetailState.selectedDate).toISOString();
  menu.innerHTML = getMphLocalDateOptions().map((option) => `
    <button class="${option.key === selectedKey ? "active" : ""}" type="button" data-mph-local-date="${option.key}">
      ${option.label}
    </button>
  `).join("");
}

function renderMphLocalMap() {
  const venueId = mphLocalDetailState.venueId;
  const map = document.getElementById("mphLocalOpsMap");
  const detail = document.getElementById("mphLocalOpsDetail");
  if (!map || !detail) return;
  const sectionKey = mphLocalDetailState.section;
  const items = getMphLocalSectionItems(venueId, sectionKey);
  if (!items.length) {
    map.innerHTML = "";
    detail.innerHTML = "";
    return;
  }
  if (!items.some((item) => item.id === mphLocalDetailState.pointId)) {
    mphLocalDetailState.pointId = items[0].id;
  }
  map.innerHTML = `
    <div class="mph-venue-map-shell mph-venue-map-shell--${sectionKey}">
      <div class="mph-venue-map-stage">DJ / cabina</div>
      <div class="mph-venue-map-entry">Entrada principal</div>
      <div class="mph-venue-map-zone">Main room</div>
      <div class="mph-venue-map-field">
        <div class="mph-venue-map-lane mph-venue-map-lane--north" aria-hidden="true"></div>
        <div class="mph-venue-map-lane mph-venue-map-lane--center" aria-hidden="true"></div>
        <div class="mph-venue-map-lane mph-venue-map-lane--south" aria-hidden="true"></div>
        ${items.map((item) => `
          <button
            class="mph-map-hotspot ${item.id === mphLocalDetailState.pointId ? "active" : ""}"
            type="button"
            data-mph-map-point="${item.id}"
            style="left:${item.x}%;top:${item.y}%"
          >
            ${item.label}
          </button>
        `).join("")}
      </div>
    </div>
  `;
  const snapshot = computeMphVenueDayMetrics(venueId, mphLocalDetailState.selectedDate);
  const point = items.find((item) => item.id === mphLocalDetailState.pointId) || items[0];
  const categoryTotal = sectionKey === "aforo" ? snapshot.realCapacity : snapshot.sections[sectionKey];
  const detailData = buildMphLocalSectionRows(sectionKey, point, snapshot, categoryTotal);
  const vipStatusLabel = ({
    pending: "Pendiente",
    confirmed: "Confirmada",
    seated: "Sentada",
    completed: "Completada",
    cancelled: "Cancelada",
    no_show: "No show",
  })[point.reservationStatus] || "Nueva";
  const actionMarkup = sectionKey === "aforo"
    ? `
      <div class="mph-local-ops-actions">
        <button class="mph-finance-inline-action" type="button" data-mph-capacity-delta="-1">Salida -1</button>
        <button class="mph-finance-status-pill" type="button" data-mph-capacity-delta="1">Entrada +1</button>
      </div>
    `
    : sectionKey === "vip" && point.status
      ? `
        <div class="mph-local-ops-actions">
          <button class="mph-finance-status-pill" type="button" data-mph-vip-cycle="${point.id}">
            ${point.status === "occupied" ? "Liberar mesa" : point.status === "reserved" ? "Sentar mesa" : point.status === "blocked" ? "Desbloquear mesa" : "Reservar mesa"}
          </button>
          ${point.reservationId ? `<button class="mph-finance-inline-action" type="button" data-mph-vip-cancel="${point.id}">Cancelar</button>` : ""}
        </div>
      `
      : "";
  const vipReservationMarkup = sectionKey === "vip" && point.status
    ? `
      <section class="mph-vip-reservation-card">
        <div class="mph-vip-reservation-head">
          <div>
            <strong>${point.reservationId ? "Reserva activa" : "Preparar reserva"}</strong>
            <span>${formatMphShortDate(mphLocalDetailState.selectedDate)} · ${point.statusLabel || "Mesa VIP"}</span>
          </div>
          <b class="mph-vip-reservation-status">${vipStatusLabel}</b>
        </div>
        <form class="mph-vip-reservation-form" data-mph-vip-form="${point.id}">
          <div class="mph-vip-reservation-grid">
            <label class="mph-vip-field mph-vip-field--full">
              <span>Cliente</span>
              <input name="client_name" type="text" placeholder="Nombre de la reserva" value="${escapeHtml(point.reservationClient || "")}" />
            </label>
            <label class="mph-vip-field">
              <span>Pax</span>
              <input name="guests_count" type="number" min="1" step="1" value="${Math.max(1, point.reservationGuests || point.capacity || 4)}" />
            </label>
            <label class="mph-vip-field">
              <span>Mínimo</span>
              <input name="minimum_spend" type="number" min="0" step="0.01" inputmode="decimal" value="${Number(point.reservationMinimum || point.minimumSpend || 0).toFixed(2)}" />
            </label>
            <label class="mph-vip-field">
              <span>Señal</span>
              <input name="deposit_amount" type="number" min="0" step="0.01" inputmode="decimal" value="${Number(point.reservationDeposit || 0).toFixed(2)}" />
            </label>
            <label class="mph-vip-field mph-vip-field--full">
              <span>Notas</span>
              <textarea name="notes" rows="3" placeholder="Horario, preferencias, botella o notas RRPP">${escapeHtml(point.reservationNotes || "")}</textarea>
            </label>
          </div>
          <div class="mph-vip-reservation-footer">
            <small>${point.reservationId ? "Actualiza la ficha antes de sentar o liberar la mesa." : "Guardar reserva también deja la mesa en estado reservada."}</small>
            <button class="mph-finance-status-pill" type="submit">Guardar reserva</button>
          </div>
        </form>
      </section>
    `
    : "";
  detail.innerHTML = `
    <div class="mph-local-spotlight-head">
      <div>
        <strong>${point.name}</strong>
        <span>${point.subtitle}</span>
      </div>
      <span class="mph-local-spotlight-badge">${sectionKey === "aforo" ? "Control" : "Live"}</span>
    </div>
    ${actionMarkup}
    <div class="mph-local-spotlight-grid">
      ${detailData.metrics.map((metric) => `
        <article>
          <small>${metric.label}</small>
          <b>${metric.value}</b>
        </article>
      `).join("")}
    </div>
    <div class="mph-sheet-card-list">
      ${detailData.rows.map(([title, detailText, status]) => `
        <article class="mph-sheet-row">
          <div>
            <strong>${title}</strong>
            <span>${detailText}</span>
          </div>
          <b>${status}</b>
        </article>
      `).join("")}
    </div>
    ${vipReservationMarkup}
  `;
}

function renderMphLocalDetail() {
  const venueId = mphLocalDetailState.venueId;
  const venueProfile = getMphVenueProfileById(venueId);
  const snapshot = computeMphVenueDayMetrics(venueId, mphLocalDetailState.selectedDate);
  const compareDate = getEquivalentWeekdayLastYear(mphLocalDetailState.selectedDate);
  const compareSnapshot = computeMphVenueDayMetrics(venueId, compareDate);
  const revenueDelta = compareSnapshot.revenue ? ((snapshot.revenue - compareSnapshot.revenue) / compareSnapshot.revenue) * 100 : 0;
  const barsDelta = compareSnapshot.sections.bars ? ((snapshot.sections.bars - compareSnapshot.sections.bars) / compareSnapshot.sections.bars) * 100 : 0;
  const taquillaDelta = compareSnapshot.sections.taquilla ? ((snapshot.sections.taquilla - compareSnapshot.sections.taquilla) / compareSnapshot.sections.taquilla) * 100 : 0;
  const occupancyDelta = snapshot.occupancyPct - compareSnapshot.occupancyPct;
  const marginDelta = Number((snapshot.margin - compareSnapshot.margin).toFixed(1));
  const queueTone = snapshot.queueMinutes >= 20 ? "down" : snapshot.queueMinutes >= 13 ? "neutral" : "up";
  const queueLabel = snapshot.queueMinutes >= 20 ? "Alta" : snapshot.queueMinutes >= 13 ? "Atenta" : "Fluida";
  const comparisonCopy = formatMphEquivalentComparison(mphLocalDetailState.selectedDate, compareDate);
  fillText("#mphLocalTitle", venueProfile.name);
  fillText("#mphLocalDateLabel", formatMphShortDate(mphLocalDetailState.selectedDate));
  fillText("#mphLocalRevenue", formatCompactCurrency(snapshot.revenue));
  fillText("#mphLocalBarsRevenue", formatCompactCurrency(snapshot.sections.bars));
  fillText("#mphLocalTaquillaRevenue", formatCompactCurrency(snapshot.sections.taquilla));
  fillText("#mphLocalOccupancy", `${snapshot.occupancyPct}%`);
  fillText("#mphLocalMarginMetric", `${snapshot.margin.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
  fillText("#mphLocalChartTrendText", `${formatSignedPercent(revenueDelta)} ${comparisonCopy}`);
  fillText("#mphLocalChartTrendTextHeader", formatSignedPercent(revenueDelta));
  fillText("#mphLocalCompareNote", comparisonCopy);
  fillText("#mphLocalBarsRowValue", formatCompactCurrency(snapshot.sections.bars));
  fillText("#mphLocalTaquillaRowValue", formatCompactCurrency(snapshot.sections.taquilla));
  fillText("#mphLocalVipRowValue", formatCompactCurrency(snapshot.sections.vip));
  fillText("#mphLocalGuardarropiaRowValue", formatCompactCurrency(snapshot.sections.guardarropia));
  fillText("#mphLocalLegalCapacity", snapshot.opsProfile.legalCapacity.toLocaleString("es-ES"));
  fillText("#mphLocalRealCapacity", snapshot.realCapacity.toLocaleString("es-ES"));
  fillText("#mphLocalRealCapacityPct", `${snapshot.occupancyPct}%`);
  fillText("#mphLocalTicketAvg", formatPreciseCurrency(snapshot.avgTicket));
  fillText("#mphLocalQueue", `~${snapshot.queueMinutes} min`);
  fillText("#mphLocalStaffActive", `${snapshot.staffActive} personas`);
  setMphTrendNode("#mphLocalRevenueTrend", `${formatSignedPercent(revenueDelta)} ${comparisonCopy}`, revenueDelta);
  setMphTrendNode("#mphLocalChartHeaderTrend", formatSignedPercent(revenueDelta), revenueDelta);
  setMphTrendNode("#mphLocalBarsTrend", formatSignedPercent(barsDelta), barsDelta);
  setMphTrendNode("#mphLocalTaquillaTrend", formatSignedPercent(taquillaDelta), taquillaDelta);
  setMphTrendNode("#mphLocalOccupancyTrend", formatSignedPoints(occupancyDelta), occupancyDelta, 0.4);
  setMphTrendNode("#mphLocalMarginTrend", formatSignedPoints(marginDelta), marginDelta, 0.2);
  setMphBadgeNode("#mphLocalQueueStatus", queueLabel, queueTone);
  const localDateNative = document.getElementById("mphLocalDateNative");
  if (localDateNative instanceof HTMLInputElement) {
    localDateNative.value = formatMphInputDate(mphLocalDetailState.selectedDate);
    localDateNative.max = formatMphInputDate(new Date());
  }
  document.querySelectorAll("[data-mph-local-section]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mphLocalSection === mphLocalDetailState.section);
  });
  renderMphLocalDateMenu();
  renderMphLocalChart(snapshot, compareSnapshot);
  renderMphLocalMap();
}

function openMphLocalDetail(venueId, date = mphLocalDetailState.selectedDate || new Date()) {
  mphLocalDetailState.venueId = venueId;
  mphLocalDetailState.selectedDate = normalizeMphDate(date);
  mphLocalDetailState.section = "bars";
  mphLocalDetailState.pointId = getMphLocalSectionItems(venueId, "bars")[0]?.id || null;
  renderMphLocalDetail();
}

function renderMphSheetCardList(selector, rows) {
  const node = document.querySelector(selector);
  if (!node) return;
  node.innerHTML = (rows || []).map(([title, detail, status]) => `
    <article class="mph-sheet-row">
      <div>
        <strong>${title}</strong>
        <span>${detail}</span>
      </div>
      <b>${status || "-"}</b>
    </article>
  `).join("");
}

function renderMphCategoryTable() {
  const node = document.getElementById("mphCategoryTable");
  if (!node) return;
  node.innerHTML = `
    <div class="mph-cat-head">
      <span>Categoría</span><span>Staff activo</span><span>Coste €/hora</span><span>Productividad</span><span></span>
    </div>
    ${mphCategoryOrder.map((categoryId) => {
      const category = mphCategoryData[categoryId];
      return `
        <button class="mph-cat-row" type="button" data-mph-category="${category.id}">
          <div class="mph-cat-cell mph-cat-main">
            <div class="mph-cat-icon ${category.iconClass}"><span class="material-symbols-outlined">${category.icon}</span></div>
            <span>${category.title}</span>
          </div>
          <span>${category.staffActive}</span>
          <span>${category.costPerHour}</span>
          <span>${category.productivity}</span>
          <span class="material-symbols-outlined mph-chevron">chevron_right</span>
        </button>
      `;
    }).join("")}
  `;
}

function openMphCategoryDetail(categoryId, announce = true) {
  const category = mphCategoryData[categoryId];
  if (!category) return;
  fillText("#mphCategoryTitle", category.title);
  fillText("#mphCategorySubtitle", category.subtitle);
  fillText("#mphCategoryHeading", category.title);
  fillText("#mphCategoryStaff", category.staffActive);
  fillText("#mphCategoryCost", category.costPerHour);
  fillText("#mphCategoryProductivity", category.productivity);
  fillText("#mphCategoryRosterCount", `${category.staffIds.length} perfiles monitorizados`);
  const categoryIcon = document.getElementById("mphCategoryIcon");
  if (categoryIcon) categoryIcon.innerHTML = `<span class="material-symbols-outlined">${category.icon}</span>`;
  categoryIcon?.classList.remove("mph-cat-barra", "mph-cat-seg", "mph-cat-vip", "mph-cat-otros");
  if (categoryIcon) categoryIcon.classList.add(category.iconClass);
  renderMphSheetCardList("#mphCategoryInsightRows", category.insights);
  const roster = document.getElementById("mphCategoryRoster");
  if (roster) {
    roster.innerHTML = category.staffIds.map((staffId) => {
      const profile = mphStaffProfiles[staffId];
      return `
        <button class="mph-roster-card" type="button" data-mph-staff-id="${profile.id}">
          ${staffAvatarHtml(profile.id, profile.initials, "mph-roster-avatar")}
          <div class="mph-roster-copy">
            <strong>${profile.title}</strong>
            <span>${profile.role}</span>
            <small>${profile.liveNote}</small>
          </div>
          <div class="mph-roster-metric">
            <b>${profile.productivity}</b>
            <span>${profile.costPerHour}</span>
          </div>
          <span class="material-symbols-outlined mph-chevron">chevron_right</span>
        </button>
      `;
    }).join("");
  }
  if (announce) showToast(`Categoría abierta: ${category.title}.`);
}

function renderMphStaffSheet(staffId) {
  const profile = mphStaffProfiles[staffId];
  if (!profile) return;
  fillText("#mphStaffSheetTitle", profile.title);
  fillText("#mphStaffName", profile.title);
  fillText("#mphStaffRole", profile.role);
  const avatarEl = document.getElementById("mphStaffInitials");
  if (avatarEl) {
    const photo = staffPhotos[staffId];
    if (photo) {
      avatarEl.innerHTML = "";
      avatarEl.classList.add("mph-avatar-photo");
      const img = document.createElement("img");
      img.src = photo; img.alt = profile.initials;
      img.onerror = () => { avatarEl.classList.remove("mph-avatar-photo"); avatarEl.textContent = profile.initials; };
      avatarEl.appendChild(img);
    } else {
      avatarEl.classList.remove("mph-avatar-photo");
      avatarEl.textContent = profile.initials;
    }
  }
  fillText("#mphStaffProductivity", profile.productivity);
  fillText("#mphStaffCostHour", profile.costPerHour);
  const liveNote = document.getElementById("mphStaffLiveNote");
  if (liveNote) liveNote.innerHTML = `<span class="material-symbols-outlined">arrow_upward</span>${profile.liveNote}`;
  const statusNote = document.getElementById("mphStaffStatusNote");
  if (statusNote) statusNote.innerHTML = `<span class="material-symbols-outlined">remove</span>${profile.statusNote}`;
  const tags = document.getElementById("mphStaffTags");
  if (tags) tags.innerHTML = (profile.tags || []).map((tag) => `<span>${tag}</span>`).join("");
  renderMphSheetCardList("#mphStaffSummaryRows", profile.summaryRows);
  renderMphSheetCardList("#mphStaffCostRows", profile.costRows);
  renderMphSheetCardList("#mphStaffShiftRows", profile.shiftRows);
  renderMphSheetCardList("#mphStaffControlRows", profile.controlRows);
  renderMphSheetCardList("#mphStaffProfileRows", profile.profileRows);
}

function switchMphStaffTab(tab, announce = false) {
  document.querySelectorAll("[data-mph-staff-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.mphStaffPanel === tab);
  });
  document.querySelectorAll("[data-mph-staff-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.mphStaffTab === tab);
  });
  if (announce) showToast(`Sheet abierta: ${tab}.`);
}

function openMphStaffSheet(staffId, announce = true) {
  const profile = mphStaffProfiles[staffId];
  if (!profile) return;
  renderMphStaffSheet(staffId);
  switchMphStaffTab("summary", false);
  if (announce) showToast(`Perfil abierto: ${profile.title}.`);
}

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

function getAuthRoleLabel(roleKey) {
  return {
    manager: "Director",
    barra: "Barra",
    taquilla: "Taquilla",
    guardarropia: "Guardarropía",
    vip: "VIP",
    pica: "Pica",
    office: "Office",
    director: "Director",
  }[String(roleKey || "").toLowerCase()] || roleKey || "Sin rol";
}

function getPrimaryAuthRole(roles = []) {
  const activeRoles = roles
    .filter((role) => role && role.is_active !== false)
    .map((role) => String(role.role_key || "").toLowerCase())
    .filter(Boolean);

  if (!activeRoles.length) return null;

  const rolePriority = ["manager", "office", "vip", "barra", "taquilla", "guardarropia", "pica"];
  return rolePriority.find((roleKey) => activeRoles.includes(roleKey)) || activeRoles[0];
}

function getDesktopAccessModeForRole(roleKey) {
  return {
    manager: "director",
    barra: "barra",
    taquilla: "taquilla",
    guardarropia: "guardarropia",
    vip: "vip",
    office: "office",
    pica: "director",
  }[String(roleKey || "").toLowerCase()] || "director";
}

function applyRoleChrome(roleKey) {
  const isManager = roleKey === "manager";
  const desktopMode = getDesktopAccessModeForRole(roleKey);
  const allowedPages = isManager
    ? null
    : new Set([accessModes[desktopMode]?.page || "overview"]);

  if (accessTrigger) accessTrigger.hidden = !isManager;
  if (mobileModeTrigger) mobileModeTrigger.hidden = !isManager;

  accessOptions.forEach((button) => {
    const allowed = isManager || button.dataset.access === desktopMode;
    button.hidden = !allowed;
  });

  desktopSidebarLinks.forEach((link) => {
    const allowed = isManager || allowedPages?.has(link.dataset.page || "");
    link.hidden = !allowed;
  });
}

function getAuthDisplayName(user) {
  if (!user) return "Usuario";
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
  if (typeof fullName === "string" && fullName.trim()) return fullName.trim();
  if (typeof user.email === "string" && user.email.trim()) return user.email.trim();
  return "Usuario";
}

function getAuthInitials(user) {
  const label = getAuthDisplayName(user);
  if (!label) return "OP";
  const cleanLabel = label.includes("@") ? label.split("@")[0] : label;
  const parts = cleanLabel
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "OP";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || "").join("") || "OP";
}

function setAvatarInitials(node, initials) {
  if (!node) return;
  const target = node.querySelector("span") || node;
  target.textContent = initials;
}

function getRoleSubtitle(roleKey) {
  return {
    manager: "Director General",
    barra: "Operativa de barra",
    taquilla: "Operativa de taquilla",
    guardarropia: "Operativa de guardarropía",
    vip: "Operativa VIP",
    pica: "Control de aforo",
    office: "Office y finanzas",
  }[String(roleKey || "").toLowerCase()] || "Equipo OPSNIGHT";
}

function syncDrawerProfile(user, roleKey) {
  const displayName = getAuthDisplayName(user);
  const email = typeof user?.email === "string" && user.email.trim() ? user.email.trim() : "sin-email@opsnight.com";
  const roleLabel = getAuthRoleLabel(roleKey || "manager");
  const subtitle = getRoleSubtitle(roleKey || "manager");
  const initials = getAuthInitials(user);

  setAvatarInitials(drawerAvatar, initials);
  if (drawerName) drawerName.textContent = displayName;
  if (drawerSubtitle) drawerSubtitle.textContent = subtitle;
  if (drawerRoleBadge) drawerRoleBadge.textContent = roleLabel;
  if (drawerAccountName) drawerAccountName.textContent = displayName;
  if (drawerAccountEmail) drawerAccountEmail.textContent = email;
  if (drawerAccountRole) drawerAccountRole.textContent = subtitle;
}

function setAuthBusy(isBusy, label) {
  if (!authSubmit) return;
  authSubmit.disabled = Boolean(isBusy);
  authSubmit.textContent = label || (isBusy ? "Entrando..." : "Entrar");
}

function setAuthError(message = "") {
  if (!authError) return;
  authError.hidden = !message;
  authError.textContent = message || "";
}

function renderAuthRoles(roles = []) {
  if (!authRoles) return;
  if (!roles.length) {
    authRoles.hidden = true;
    authRoles.innerHTML = "";
    return;
  }
  authRoles.hidden = false;
  authRoles.innerHTML = roles.map((role) => `<span>${getAuthRoleLabel(role.role_key)}</span>`).join("");
}

async function syncAuthUi() {
  const api = window.mphSupabase;
  const supabaseState = api?.state || {};
  const user = api?.getCurrentUser?.() || supabaseState.user || null;
  const isPending = !["connected", "error", "sdk-missing", "unconfigured"].includes(supabaseState.status || "idle");

  mphAuthState.pending = isPending;
  mphAuthState.booted = supabaseState.status !== "idle";

  setAvatarInitials(desktopAuthAvatar, getAuthInitials(user));
  setAvatarInitials(mobileAuthAvatar, getAuthInitials(user));

  if (user?.id && mphAuthState.userId !== user.id) {
    mphAuthState.userId = user.id;
    mphAuthState.roles = api?.listUserVenueRoles ? await api.listUserVenueRoles() : [];
  } else if (!user) {
    mphAuthState.userId = null;
    mphAuthState.roles = [];
    mphAuthState.activeRoleKey = null;
    mphAuthState.isManager = false;
    mphAuthState.defaultDesktopMode = "director";
    mphAuthState.allowedDesktopModes = new Set(["director"]);
    mphAuthState.appliedSignature = "";
  }

  if (!user) renderAuthRoles([]);
  else renderAuthRoles(mphAuthState.roles);
  syncDrawerProfile(user, mphAuthState.activeRoleKey || getPrimaryAuthRole(mphAuthState.roles) || "manager");

  if (isPending) {
    if (authGate) authGate.hidden = false;
    if (authStatus) authStatus.textContent = "Conectando con Supabase y restaurando la sesión...";
    setAuthError("");
    setAuthBusy(true, "Conectando...");
    return;
  }

  const primaryRoleKey = getPrimaryAuthRole(mphAuthState.roles);
  if (user && !primaryRoleKey) {
    if (authGate) authGate.hidden = false;
    document.body.classList.add("auth-locked");
    if (authStatus) authStatus.textContent = `Sesión iniciada como ${getAuthDisplayName(user)}, pero todavía no tiene un rol asignado en este local.`;
    setAuthBusy(false, "Entrar");
    setAuthError("Asigna un rol en venue_user_roles para desbloquear la app.");
    return;
  }

  mphAuthState.activeRoleKey = primaryRoleKey;
  mphAuthState.isManager = primaryRoleKey === "manager";
  mphAuthState.defaultDesktopMode = getDesktopAccessModeForRole(primaryRoleKey);
  mphAuthState.allowedDesktopModes = new Set(
    mphAuthState.isManager ? Object.keys(accessModes) : [mphAuthState.defaultDesktopMode]
  );
  applyRoleChrome(primaryRoleKey);
  syncDrawerProfile(user, primaryRoleKey);

  if (user) {
    if (authGate) authGate.hidden = true;
    document.body.classList.remove("auth-locked");
    if (authStatus) authStatus.textContent = `Sesión activa como ${getAuthDisplayName(user)} · ${getAuthRoleLabel(primaryRoleKey)}.`;
    setAuthBusy(false, "Entrar");
    setAuthError("");
    if (authPasswordInput) authPasswordInput.value = "";
    const roleSignature = `${user.id}|${primaryRoleKey}|${mphAuthState.roles.map((role) => role.role_key).sort().join(",")}`;
    if (mphAuthState.appliedSignature !== roleSignature) {
      applyAccessMode(mphAuthState.defaultDesktopMode, false);
      window.mphApplyAuthView?.(primaryRoleKey);
      mphAuthState.appliedSignature = roleSignature;
    }
    return;
  }

  if (authGate) authGate.hidden = false;
  document.body.classList.add("auth-locked");
  applyRoleChrome("manager");
  if (authStatus) authStatus.textContent = "Inicia sesión con uno de los perfiles creados en Supabase Auth para desbloquear la app.";
  setAuthBusy(false, "Entrar");
}

async function handleAuthLogout() {
  const api = window.mphSupabase;
  if (!api?.signOut) return;
  window.mphCloseDrawer?.();
  const result = await api.signOut();
  if (result?.error) {
    showToast("No se pudo cerrar la sesión.");
    return;
  }
  setAuthError("");
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
  if (!mphAuthState.isManager) return;
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
  fillText("#lsbTime", timeLabel);
  fillText("#mphClock", timeLabel);
}

function renderTPVCatalog() {
  const grid = document.querySelector("#tpvProductGrid");
  const searchWrap = document.querySelector("#tpvSearchWrap");
  const searchInput = document.querySelector("#tpvSearchInput");
  const categoryTabs = document.querySelector("#tpvCategoryTabs");
  const sortButton = document.querySelector("#tpvSortButton");
  if (!grid) return;
  const catalogProducts = getTpvCatalogProducts(tpvState.catalog);
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
  const catalogLabels = {
    taquilla: { title: "Entradas Taquilla", user: "Taquilla", access: "Usuario Taquilla" },
    barra: { title: "Catálogo Barra", user: "Barra", access: "Usuario Barra" },
    guardarropia: { title: "Tickets Guardarropía", user: "Guardarropía", access: "Usuario Guardarropía" },
  };
  const catalogLabel = catalogLabels[tpvState.catalog] || catalogLabels.taquilla;
  products.sort((a, b) => {
    if (sortMode === "name-asc") return a.name.localeCompare(b.name, "es");
    if (sortMode === "name-desc") return b.name.localeCompare(a.name, "es");
    if (sortMode === "price-desc") return b.price - a.price || a.name.localeCompare(b.name, "es");
    return a.price - b.price || a.name.localeCompare(b.name, "es");
  });
  fillText("#tpvContextTitle", catalogLabel.title);
  fillText("#tpvUserLabel", catalogLabel.user);
  fillText("#tpvAccessModeLabel", catalogLabel.access);
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
  const product = getTpvProductById(id);
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
  const allowedCatalogs = new Set([...Object.keys(tpvCatalogs), ...Object.keys(mphSupabaseRuntime.productsBySection)]);
  tpvState.catalog = allowedCatalogs.has(catalog) ? catalog : "taquilla";
  tpvState.search = "";
  tpvState.category = "all";
  tpvState.sort = tpvState.catalog === "barra" ? "price-asc" : "price-asc";
  renderTPVCatalog();
  if (announce) showToast(`TPV abierto: ${tpvState.catalog}.`);
}

function applyAccessMode(mode, announce = true) {
  const requestedMode = mphAuthState.allowedDesktopModes?.has(mode) ? mode : mphAuthState.defaultDesktopMode || "director";
  const config = accessModes[requestedMode] || accessModes.director;
  if (accessLabel) accessLabel.textContent = config.label;
  accessOptions.forEach((button) => button.classList.toggle("active", button.dataset.access === requestedMode));
  desktopAdmin?.classList.toggle("pos-access", config.page === "tpv");
  desktopAdmin?.setAttribute("data-access-mode", requestedMode);
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

// ── Panel Data ───────────────────────────────────────────
const panelData = {
  global: {
    today:  { revenue: "€142,890", label: "Facturación total (hoy)",    vsLabel: "vs ayer",          trend: "up",   trendText: "12.4% (€15,920)", aforo: "96%", aforoReal: "5,746", aforoLegal: "/ 6,000", bars: "€85,420", barsTrend: "up",   barsTrendText: "10.8%", taquilla: "€57,470", taquillaTrend: "up",   taquillaTrendText: "14.3%", margin: "34.2%", marginTrend: "up",   marginTrendText: "2.1 pp" },
    yesterday: { revenue: "€127,340", label: "Facturación total (ayer)", vsLabel: "vs mismo día sem. pasada", trend: "up",   trendText: "8.1% (€9,530)",  aforo: "89%", aforoReal: "5,340", aforoLegal: "/ 6,000", bars: "€74,810", barsTrend: "up",   barsTrendText: "7.4%",  taquilla: "€52,530", taquillaTrend: "up",   taquillaTrendText: "9.0%",  margin: "32.6%", marginTrend: "down", marginTrendText: "0.8 pp" },
    "7d":   { revenue: "€891,250", label: "Facturación (7 días)",       vsLabel: "vs 7 días anteriores", trend: "up",   trendText: "9.3% (€75,820)", aforo: "91%", aforoReal: "5,460", aforoLegal: "/ 6,000", bars: "€538,200", barsTrend: "up",   barsTrendText: "8.7%",  taquilla: "€353,050", taquillaTrend: "up",   taquillaTrendText: "10.2%", margin: "33.8%", marginTrend: "up",   marginTrendText: "1.4 pp" },
    mtd:    { revenue: "€3,214,600", label: "Facturación (mes actual)", vsLabel: "vs mes anterior",    trend: "up",   trendText: "11.2% (€324,800)", aforo: "88%", aforoReal: "5,280", aforoLegal: "/ 6,000", bars: "€1,928,760", barsTrend: "up",   barsTrendText: "10.1%", taquilla: "€1,285,840", taquillaTrend: "up",   taquillaTrendText: "12.7%", margin: "34.5%", marginTrend: "up",   marginTrendText: "1.9 pp" },
  },
  kapital: {
    today:  { revenue: "€58,420", label: "Facturación total (hoy)",    vsLabel: "vs ayer",          trend: "up",   trendText: "14.1% (€7,240)",  aforo: "98%", aforoReal: "2,940", aforoLegal: "/ 3,000", bars: "€34,750", barsTrend: "up",   barsTrendText: "12.3%", taquilla: "€23,670", taquillaTrend: "up",   taquillaTrendText: "16.8%", margin: "36.4%", marginTrend: "up",   marginTrendText: "3.1 pp" },
    yesterday: { revenue: "€51,180", label: "Facturación total (ayer)", vsLabel: "vs mismo día sem. pasada", trend: "up",   trendText: "6.8% (€3,270)",  aforo: "92%", aforoReal: "2,760", aforoLegal: "/ 3,000", bars: "€30,120", barsTrend: "up",   barsTrendText: "5.9%",  taquilla: "€21,060", taquillaTrend: "up",   taquillaTrendText: "7.9%",  margin: "34.1%", marginTrend: "up",   marginTrendText: "0.6 pp" },
    "7d":   { revenue: "€362,940", label: "Facturación (7 días)",       vsLabel: "vs 7 días anteriores", trend: "up",   trendText: "10.2% (€33,570)", aforo: "94%", aforoReal: "2,820", aforoLegal: "/ 3,000", bars: "€217,760", barsTrend: "up",   barsTrendText: "9.4%",  taquilla: "€145,180", taquillaTrend: "up",   taquillaTrendText: "11.4%", margin: "35.8%", marginTrend: "up",   marginTrendText: "2.2 pp" },
    mtd:    { revenue: "€1,312,800", label: "Facturación (mes actual)", vsLabel: "vs mes anterior",    trend: "up",   trendText: "12.4% (€145,200)", aforo: "91%", aforoReal: "2,730", aforoLegal: "/ 3,000", bars: "€787,680", barsTrend: "up",   barsTrendText: "11.2%", taquilla: "€525,120", taquillaTrend: "up",   taquillaTrendText: "13.9%", margin: "36.1%", marginTrend: "up",   marginTrendText: "2.7 pp" },
  },
  pacha: {
    today:  { revenue: "€47,310", label: "Facturación total (hoy)",    vsLabel: "vs ayer",          trend: "up",   trendText: "10.8% (€4,580)",  aforo: "95%", aforoReal: "1,900", aforoLegal: "/ 2,000", bars: "€28,380", barsTrend: "up",   barsTrendText: "9.2%",  taquilla: "€18,930", taquillaTrend: "up",   taquillaTrendText: "12.7%", margin: "33.8%", marginTrend: "up",   marginTrendText: "1.8 pp" },
    yesterday: { revenue: "€42,700", label: "Facturación total (ayer)", vsLabel: "vs mismo día sem. pasada", trend: "down", trendText: "2.1% (€913)",    aforo: "88%", aforoReal: "1,760", aforoLegal: "/ 2,000", bars: "€25,620", barsTrend: "down", barsTrendText: "1.8%",  taquilla: "€17,080", taquillaTrend: "down", taquillaTrendText: "2.5%",  margin: "31.9%", marginTrend: "down", marginTrendText: "1.3 pp" },
    "7d":   { revenue: "€295,170", label: "Facturación (7 días)",       vsLabel: "vs 7 días anteriores", trend: "up",   trendText: "7.6% (€20,850)",  aforo: "91%", aforoReal: "1,820", aforoLegal: "/ 2,000", bars: "€177,100", barsTrend: "up",   barsTrendText: "6.9%",  taquilla: "€118,070", taquillaTrend: "up",   taquillaTrendText: "8.5%",  margin: "33.2%", marginTrend: "up",   marginTrendText: "1.0 pp" },
    mtd:    { revenue: "€1,064,400", label: "Facturación (mes actual)", vsLabel: "vs mes anterior",    trend: "up",   trendText: "9.1% (€88,700)",  aforo: "87%", aforoReal: "1,740", aforoLegal: "/ 2,000", bars: "€638,640", barsTrend: "up",   barsTrendText: "8.3%",  taquilla: "€425,760", taquillaTrend: "up",   taquillaTrendText: "10.1%", margin: "33.9%", marginTrend: "up",   marginTrendText: "1.5 pp" },
  },
  opium: {
    today:  { revenue: "€37,160", label: "Facturación total (hoy)",    vsLabel: "vs ayer",          trend: "down", trendText: "3.4% (€1,310)",   aforo: "87%", aforoReal: "870",   aforoLegal: "/ 1,000", bars: "€22,290", barsTrend: "down", barsTrendText: "4.1%",  taquilla: "€14,870", taquillaTrend: "down", taquillaTrendText: "2.5%",  margin: "28.4%", marginTrend: "down", marginTrendText: "1.6 pp" },
    yesterday: { revenue: "€38,470", label: "Facturación total (ayer)", vsLabel: "vs mismo día sem. pasada", trend: "up",   trendText: "4.2% (€1,554)",   aforo: "91%", aforoReal: "910",   aforoLegal: "/ 1,000", bars: "€23,080", barsTrend: "up",   barsTrendText: "3.8%",  taquilla: "€15,390", taquillaTrend: "up",   taquillaTrendText: "4.7%",  margin: "30.0%", marginTrend: "up",   marginTrendText: "0.4 pp" },
    "7d":   { revenue: "€233,140", label: "Facturación (7 días)",       vsLabel: "vs 7 días anteriores", trend: "up",   trendText: "5.8% (€12,790)",  aforo: "89%", aforoReal: "890",   aforoLegal: "/ 1,000", bars: "€139,880", barsTrend: "up",   barsTrendText: "5.1%",  taquilla: "€93,260", taquillaTrend: "up",   taquillaTrendText: "6.7%",  margin: "29.8%", marginTrend: "up",   marginTrendText: "0.8 pp" },
    mtd:    { revenue: "€837,400", label: "Facturación (mes actual)",   vsLabel: "vs mes anterior",    trend: "down", trendText: "1.8% (€15,300)",  aforo: "85%", aforoReal: "850",   aforoLegal: "/ 1,000", bars: "€502,440", barsTrend: "down", barsTrendText: "2.2%",  taquilla: "€334,960", taquillaTrend: "down", taquillaTrendText: "1.3%",  margin: "29.1%", marginTrend: "down", marginTrendText: "0.7 pp" },
  },
};

let activePanelVenue = "global";
let activePanelDate  = "today";

function updatePanelData(venue, dateKey) {
  activePanelVenue = venue || activePanelVenue;
  activePanelDate  = dateKey || activePanelDate;
  const d = (panelData[activePanelVenue] || panelData.global)[activePanelDate] || panelData.global.today;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setTrend = (id, dir, textId, text) => {
    const el = document.getElementById(id);
    if (el) { el.className = `mph-trend ${dir}`; }
    set(textId, text);
  };
  const setTrendSm = (id, dir, textId, text) => {
    const el = document.getElementById(id);
    if (el) { el.className = `mph-trend-sm ${dir}`; }
    if (textId) { const t = el?.querySelector("span:last-child"); if (t) t.textContent = text; }
  };

  set("mphPanelRevenueLabel", d.label);
  set("mphPanelRevenue", d.revenue);
  set("mphPanelVsLabel", d.vsLabel);
  setTrend("mphPanelTrend", d.trend, "mphPanelTrendText", d.trendText);
  set("mphPanelAforoPct", d.aforo);
  set("mphPanelAforoReal", d.aforoReal);
  set("mphPanelAforoLegal", d.aforoLegal);

  const barsEl = document.getElementById("mphPanelBarsTrend");
  if (barsEl) { barsEl.className = `mph-trend-sm ${d.barsTrend}`; const t = barsEl.querySelector("span:last-child"); if (t) t.textContent = d.barsTrendText; }
  set("mphPanelBars", d.bars);

  const taqEl = document.getElementById("mphPanelTaquillaTrend");
  if (taqEl) { taqEl.className = `mph-trend-sm ${d.taquillaTrend}`; const t = taqEl.querySelector("span:last-child"); if (t) t.textContent = d.taquillaTrendText; }
  set("mphPanelTaquilla", d.taquilla);

  set("mphPanelMargin", d.margin);
  set("mphPanelMarginVsLabel", d.vsLabel);
  setTrend("mphPanelMarginTrend", d.marginTrend, "mphPanelMarginTrendText", d.marginTrendText);
}

const periodKeyMap = {
  "Hoy, 24 may": "today",
  "Ayer, 23 may": "yesterday",
  "Últimos 7 días": "7d",
  "Mes actual": "mtd",
};

const panelScopeVenueMap = {
  global: window.mphSupabase?.config?.appVenueId || "kapital-madrid",
  kapital: "kapital-madrid",
  pacha: window.mphSupabase?.config?.appVenueId || "kapital-madrid",
  opium: "opium-barcelona",
};

// ── Mobile Preview Mode ──────────────────────────────────
(function initMobilePreview() {
  const overlay = document.getElementById("mobilePreviewOverlay");
  const trigger = document.getElementById("mobileModeTrigger");
  const closeBtn = document.getElementById("mphClose");
  const backBtn = document.getElementById("mphBackBtn");
  const categoryBackBtn = document.getElementById("mphCategoryBackBtn");
  const staffBackBtn = document.getElementById("mphStaffBackBtn");
  const localDateTrigger = document.getElementById("mphLocalDateTrigger");
  const localDatePickerBtn = document.getElementById("mphLocalDatePickerBtn");
  const localDateNative = document.getElementById("mphLocalDateNative");
  const localDateMenu = document.getElementById("mphLocalDateMenu");
  const localCapacityInfoBtn = document.getElementById("mphLocalCapacityInfoBtn");
  const localMap = document.getElementById("mphLocalOpsMap");
  const localSectionTabs = [...document.querySelectorAll(".mph-local-section-tab, .mph-group-row--button[data-mph-local-section]")];
  const financeDateTrigger = document.getElementById("mphFinanceDateTrigger");
  const financeDatePickerBtn = document.getElementById("mphFinanceDatePickerBtn");
  const financeDateNative = document.getElementById("mphFinanceDateNative");
  const financePeriodTabs = [...document.querySelectorAll("[data-mph-finance-period]")];
  const quickAccessButtons = [...document.querySelectorAll("[data-mph-panel-access]")];
  const bottomNavButtons = [...document.querySelectorAll(".mph-bottom-nav button[data-mph-screen]")];
  const tpvPayCardButton = document.getElementById("tpvPayCardButton");
  const tpvPayCashButton = document.getElementById("tpvPayCashButton");
  const localOpsDetail = document.getElementById("mphLocalOpsDetail");
  const roleBackBtn = document.getElementById("mphRoleBackBtn");
  const roleTitle = document.getElementById("mphRoleTitle");
  const roleVenueLabel = document.getElementById("mphRoleVenueLabel");
  const roleSubtitle = document.getElementById("mphRoleSubtitle");
  const roleViewContent = document.getElementById("mphRoleViewContent");
  const roleAppsButton = document.querySelector('.mph-screen[data-mph-screen="role-view"] .mph-topbar .mph-icon-btn:last-child');
  const scopeTrigger = document.getElementById("mphScopeTrigger");
  const dateTrigger = document.getElementById("mphDateTrigger");
  const scopeMenu = document.getElementById("mphScopeMenu");
  const dateMenu = document.getElementById("mphDateMenu");
  const scopeLabel = document.getElementById("mphScopeLabel");
  const dateLabel = document.getElementById("mphDateLabel");
  const venueList = document.getElementById("mphVenueList");
  const venueTabs = [...document.querySelectorAll(".mph-tab[data-mph-period]")];
  const categoryTable = document.getElementById("mphCategoryTable");
  const categoryRoster = document.getElementById("mphCategoryRoster");
  const staffTabs = [...document.querySelectorAll("[data-mph-staff-tab]")];
  const stockDetailBackBtn = document.getElementById("mphStockDetailBackBtn");
  let activeVenuePeriod = venueTabs.find((tab) => tab.classList.contains("active"))?.dataset.mphPeriod || "today";
  const mphFinanceState = {
    period: financePeriodTabs.find((tab) => tab.classList.contains("active"))?.dataset.mphFinancePeriod || "today",
    selectedDate: normalizeMphDate(new Date()),
  };
  const mphRoleViewState = {
    role: "taquilla",
    venueId: window.mphSupabase?.config?.appVenueId || "kapital-madrid",
    focusId: null,
  };
  let mphFinanceRemoteSnapshot = null;
  let mphFinanceRemoteSnapshotKey = "";
  let mphFinanceRemoteSyncToken = 0;

  function setFinanceBadge(id, text, tone = "neutral") {
    const node = document.getElementById(id);
    if (!node) return;
    node.textContent = text;
    node.classList.remove("up", "down", "neutral");
    node.classList.add(tone);
  }

  function formatFinanceHeroLabel(periodKey, date) {
    if (periodKey === "today") {
      const todayKey = formatMphInputDate(new Date());
      return formatMphInputDate(date) === todayKey
        ? "Resultado operativo (hoy)"
        : `Resultado operativo (${formatMphShortDate(date)})`;
    }
    if (periodKey === "7d") return `Resultado operativo (7 días)`;
    if (periodKey === "30d") return `Resultado operativo (30 días)`;
    if (periodKey === "mtd") return "Resultado operativo (mes actual)";
    return "Resultado operativo";
  }

  function getMphFinanceSnapshotKey() {
    return `${formatMphInputDate(mphFinanceState.selectedDate)}|${mphFinanceState.period}`;
  }

  async function hydrateFinanceSnapshotFromSupabase() {
    const api = window.mphSupabase;
    const requestKey = getMphFinanceSnapshotKey();
    const requestToken = ++mphFinanceRemoteSyncToken;

    if (!api?.isConfigured?.()) {
      mphFinanceRemoteSnapshot = null;
      mphFinanceRemoteSnapshotKey = "";
      return;
    }

    const snapshot = await api.getFinanceSnapshot(formatMphInputDate(mphFinanceState.selectedDate), mphFinanceState.period);
    if (requestToken !== mphFinanceRemoteSyncToken) return;

    mphFinanceRemoteSnapshot = snapshot;
    mphFinanceRemoteSnapshotKey = snapshot ? requestKey : "";
    renderMphFinanceScreen();
  }

  function renderMphFinanceScreen() {
    const financeDateLabel = document.getElementById("mphFinanceDateLabel");
    if (financeDateLabel) financeDateLabel.textContent = formatMphShortDate(mphFinanceState.selectedDate);
    if (financeDateNative instanceof HTMLInputElement) {
      financeDateNative.value = formatMphInputDate(mphFinanceState.selectedDate);
      financeDateNative.max = formatMphInputDate(new Date());
    }
    financePeriodTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.mphFinancePeriod === mphFinanceState.period);
    });

    const { currentRange, current, previous } = computeMphFinanceMetrics(mphFinanceState.period, mphFinanceState.selectedDate);
    const revenueDelta = previous.revenue ? ((current.revenue - previous.revenue) / previous.revenue) * 100 : 0;
    const ebitdaDelta = current.ebitdaPct - previous.ebitdaPct;
    const comparisonLabel = currentRange.comparisonLabel;
    const financeSeed = getMphDayIndex(mphFinanceState.selectedDate) + currentRange.days;
    const feesValue = current.revenue * clamp(0.011 + (currentRange.days * 0.00004), 0.011, 0.018);
    const otherValue = Math.max(120 * currentRange.days, current.operatingCostsValue * 0.035);
    const barsShare = clamp(0.62 + Math.sin(financeSeed * 0.05) * 0.035, 0.57, 0.68);
    const taquillaShare = clamp(0.31 + Math.cos(financeSeed * 0.07) * 0.025, 0.24, 0.35);
    const barsValue = current.revenue * barsShare;
    const taquillaValue = current.revenue * taquillaShare;
    const netRevenueValue = Math.max(0, current.revenue - feesValue);
    const cashAvailableValue = Math.max(0, current.ebitdaValue * 0.87 + current.breakdown.staff * 0.22);
    const pendingPaymentsValue = (current.breakdown.suppliers * 0.31) + (current.breakdown.rent * 0.42) + (current.breakdown.marketing * 0.28);
    const tpvRegisteredValue = current.revenue * 0.69;
    const cashCountedValue = current.revenue * 0.097;
    const qrSettledValue = current.revenue * 0.129;
    const movementTotal = Math.max(18, Math.round(currentRange.days * 21));
    const pendingMovements = Math.max(1, Math.round(movementTotal * clamp(0.018 + Math.sin(financeSeed * 0.03) * 0.008, 0.01, 0.05)));
    const reconciledMovements = Math.max(0, movementTotal - pendingMovements);
    const reconciledPct = movementTotal ? Math.round((reconciledMovements / movementTotal) * 100) : 0;
    const mismatchValue = Math.abs(Math.round(Math.sin(financeSeed * 0.17) * 120));
    const vatOutValue = current.revenue * 0.176;
    const vatInValue = (current.breakdown.suppliers * 0.12) + (current.breakdown.marketing * 0.08) + (current.breakdown.security * 0.06);
    const vatDueValue = Math.max(0, vatOutValue - vatInValue);
    const invoiceOneValue = pendingPaymentsValue * 0.52;
    const invoiceTwoValue = pendingPaymentsValue * 0.16;
    const invoiceThreeValue = pendingPaymentsValue * 0.32;
    const remoteSnapshot = mphFinanceRemoteSnapshotKey === getMphFinanceSnapshotKey() ? mphFinanceRemoteSnapshot : null;
    const displayRevenueValue = remoteSnapshot?.gross_revenue ?? current.revenue;
    const displayNetRevenueValue = remoteSnapshot?.net_revenue ?? netRevenueValue;
    const displayProductCostValue = remoteSnapshot?.product_cost ?? current.costOfSalesValue;
    const displayStaffCostValue = remoteSnapshot?.staff_cost ?? current.breakdown.staff;
    const displayFeesValue = remoteSnapshot?.fees_cost ?? feesValue;
    const displayOtherValue = remoteSnapshot?.other_cost ?? otherValue;
    const displayOperatingProfitValue = remoteSnapshot?.operating_profit ?? current.ebitdaValue;
    const displayCashValue = remoteSnapshot?.cash_available ?? cashAvailableValue;
    const displayPendingPaymentsValue = remoteSnapshot?.pending_payments ?? pendingPaymentsValue;
    const displayMarginPct = remoteSnapshot?.margin_pct ?? current.ebitdaPct;
    const displayCostOfSalesPct = displayRevenueValue ? (displayProductCostValue / displayRevenueValue) * 100 : current.costOfSalesPct;
    const displayStaffPct = displayRevenueValue ? (displayStaffCostValue / displayRevenueValue) * 100 : 0;
    const displaySourceNote = remoteSnapshot ? "Sincronizado con Supabase." : "Sin devoluciones ni fees.";

    fillText("#mphFinanceHeroLabel", formatFinanceHeroLabel(mphFinanceState.period, mphFinanceState.selectedDate));
    fillText("#mphFinanceHeroValue", formatPreciseCurrency(displayOperatingProfitValue));
    fillText("#mphFinanceHeroTrendText", `${formatSignedPercent(revenueDelta)} (${formatPreciseCurrency(current.revenue - previous.revenue)})`);
    fillText("#mphFinanceHeroVsLabel", comparisonLabel);
    setMphTrendNode("#mphFinanceHeroTrend", `${formatSignedPercent(revenueDelta)} (${formatPreciseCurrency(current.revenue - previous.revenue)})`, revenueDelta);

    fillText("#mphFinanceNetRevenueValue", formatFinanceKpiCurrency(displayNetRevenueValue));
    fillText("#mphFinanceNetRevenueNote", displaySourceNote);
    fillText("#mphFinanceSessionMarginValue", `${displayMarginPct.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
    fillText("#mphFinanceSessionMarginNote", `${formatSignedPoints(ebitdaDelta)} vs tramo anterior.`);
    fillText("#mphFinanceCashValue", formatFinanceKpiCurrency(displayCashValue));
    fillText("#mphFinanceCashNote", "Liquidación instantánea.");
    fillText("#mphFinancePendingPaymentsValue", formatFinanceKpiCurrency(displayPendingPaymentsValue));
    fillText("#mphFinancePendingPaymentsNote", "Facturas y proveedores.");

    fillText("#mphFinanceEquationRevenue", formatCompactCurrency(displayRevenueValue));
    fillText("#mphFinanceEquationProduct", `-${formatCompactCurrency(displayProductCostValue)}`);
    fillText("#mphFinanceEquationStaff", `-${formatCompactCurrency(displayStaffCostValue)}`);
    fillText("#mphFinanceEquationFees", `-${formatCompactCurrency(displayFeesValue)}`);
    fillText("#mphFinanceEquationOther", `-${formatCompactCurrency(displayOtherValue)}`);

    fillText("#mphFinanceRevenueValue", formatCompactCurrency(displayRevenueValue));
    setFinanceBadge("mphFinanceRevenueBadge", `${getMphTrendMeta(revenueDelta).icon === "remove" ? "·" : revenueDelta >= 0 ? "↑" : "↓"}${Math.abs(revenueDelta).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`, getMphTrendMeta(revenueDelta).className === "flat" ? "neutral" : getMphTrendMeta(revenueDelta).className);

    fillText("#mphFinanceCostSalesValue", formatCompactCurrency(displayProductCostValue));
    setFinanceBadge("mphFinanceCostSalesBadge", `${displayCostOfSalesPct.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);

    fillText("#mphFinanceGrossMarginValue", formatCompactCurrency(displayRevenueValue - displayProductCostValue));
    setFinanceBadge("mphFinanceGrossMarginBadge", `${(displayRevenueValue ? (((displayRevenueValue - displayProductCostValue) / displayRevenueValue) * 100) : current.grossMarginPct).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`, "up");

    fillText("#mphFinanceOperatingCostsValue", formatCompactCurrency(displayStaffCostValue + displayFeesValue + displayOtherValue));
    setFinanceBadge("mphFinanceOperatingCostsBadge", `${(displayRevenueValue ? (((displayStaffCostValue + displayFeesValue + displayOtherValue) / displayRevenueValue) * 100) : current.operatingCostsPct).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);

    fillText("#mphFinanceEbitdaValue", formatCompactCurrency(displayOperatingProfitValue));
    setFinanceBadge("mphFinanceEbitdaBadge", `${displayMarginPct.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`, getMphTrendMeta(ebitdaDelta, 0.2).className === "flat" ? "neutral" : getMphTrendMeta(ebitdaDelta, 0.2).className);

    fillText("#mphFinanceStaffCostValue", formatCompactCurrency(displayStaffCostValue));
    setFinanceBadge("mphFinanceStaffCostBadge", `${displayStaffPct.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
    fillText("#mphFinanceSupplierCostValue", formatCompactCurrency(current.breakdown.suppliers));
    setFinanceBadge("mphFinanceSupplierCostBadge", `${((current.breakdown.suppliers / current.revenue) * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
    fillText("#mphFinanceRentCostValue", formatCompactCurrency(current.breakdown.rent));
    setFinanceBadge("mphFinanceRentCostBadge", `${((current.breakdown.rent / current.revenue) * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
    fillText("#mphFinanceMarketingCostValue", formatCompactCurrency(current.breakdown.marketing));
    setFinanceBadge("mphFinanceMarketingCostBadge", `${((current.breakdown.marketing / current.revenue) * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
    fillText("#mphFinanceSecurityCostValue", formatCompactCurrency(current.breakdown.security));
    setFinanceBadge("mphFinanceSecurityCostBadge", `${((current.breakdown.security / current.revenue) * 100).toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);

    fillText("#mphFinanceAvgTicketValue", formatPreciseCurrency(current.avgTicket));
    fillText("#mphFinanceRevPerSqmValue", formatPreciseCurrency(current.revPerSqm));
    fillText("#mphFinanceRevPerSqmVsLabel", `vs ${formatPreciseCurrency(previous.revPerSqm)} previo`);
    fillText("#mphFinanceNetMarginValue", `${displayMarginPct.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);
    setMphTrendNode("#mphFinanceNetMarginTrend", formatSignedPoints(ebitdaDelta), ebitdaDelta, 0.2);

    fillText("#mphFinanceBarsValue", formatCompactCurrency(barsValue));
    fillText("#mphFinanceTaquillaValue", formatCompactCurrency(taquillaValue));
    fillText("#mphFinanceProductCostValue", `-${formatCompactCurrency(displayProductCostValue)}`);
    fillText("#mphFinanceStaffRowValue", `-${formatCompactCurrency(displayStaffCostValue)}`);
    fillText("#mphFinanceStaffCostNote", `${Math.round(current.realCapacity / 125)} fichados · coste vivo ${formatCompactCurrency(displayStaffCostValue / Math.max(1, currentRange.days * 10))}/h`);
    fillText("#mphFinanceFeesValue", `-${formatCompactCurrency(displayFeesValue)}`);
    fillText("#mphFinanceOtherValue", `-${formatCompactCurrency(displayOtherValue)}`);

    fillText("#mphFinanceCloseTpvValue", formatCompactCurrency(tpvRegisteredValue));
    fillText("#mphFinanceCloseTpvNote", `${formatPreciseCurrency(tpvRegisteredValue)} · 4 barras`);
    fillText("#mphFinanceCloseCashValue", formatCompactCurrency(cashCountedValue));
    fillText("#mphFinanceCloseCashNote", `${formatPreciseCurrency(cashCountedValue)} · diferencia ${formatPreciseCurrency(mismatchValue)}`);
    fillText("#mphFinanceCloseQrValue", formatCompactCurrency(qrSettledValue));
    fillText("#mphFinanceCloseQrNote", `${formatPreciseCurrency(qrSettledValue)} · liquidado`);

    fillText("#mphFinanceInvoiceOneValue", formatCompactCurrency(invoiceOneValue));
    fillText("#mphFinanceInvoiceTwoValue", formatCompactCurrency(invoiceTwoValue));
    fillText("#mphFinanceInvoiceThreeValue", formatCompactCurrency(invoiceThreeValue));

    fillText("#mphFinanceRecoPct", `${reconciledPct}%`);
    fillText("#mphFinanceRecoNote", `${reconciledMovements}/${movementTotal} movimientos`);
    fillText("#mphFinancePendingMoveCount", pendingMovements.toLocaleString("es-ES"));
    fillText("#mphFinancePendingMoveNote", "2 proveedores · 1 efectivo");
    fillText("#mphFinanceMismatchValue", formatCompactCurrency(mismatchValue));
    fillText("#mphFinanceMismatchNote", mismatchValue === 0 ? "Caja cerrada sin diferencia" : "Diferencia pendiente de revisar");

    fillText("#mphFinanceVatOutValue", formatCompactCurrency(vatOutValue));
    fillText("#mphFinanceVatInValue", `-${formatCompactCurrency(vatInValue)}`);
    fillText("#mphFinanceVatDueValue", formatCompactCurrency(vatDueValue));
  }

  function openFinanceDatePicker() {
    if (!(financeDateNative instanceof HTMLInputElement)) return;
    if (typeof financeDateNative.showPicker === "function") {
      financeDateNative.showPicker();
      return;
    }
    financeDateNative.focus();
    financeDateNative.click();
  }

  function createStockBottleArt(label, accent, fill = "#f3efe7") {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 112 216">
        <rect width="112" height="216" rx="16" fill="#ffffff"/>
        <rect x="40" y="10" width="32" height="20" rx="6" fill="${accent}"/>
        <rect x="45" y="26" width="22" height="30" rx="7" fill="${accent}"/>
        <path d="M33 54h46l10 32v82c0 18-14 32-33 32H56c-19 0-33-14-33-32V86z" fill="${fill}" stroke="#d8d3ca" stroke-width="2"/>
        <rect x="28" y="102" width="56" height="44" rx="10" fill="${accent}" opacity="0.92"/>
        <rect x="36" y="150" width="40" height="18" rx="9" fill="#f5f5f5"/>
        <text x="56" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#ffffff">${label}</text>
        <text x="56" y="162" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="700" fill="#222222">STOCK</text>
      </svg>
    `)}`;
  }

  const mphStockProducts = {
    "grey-goose": {
      name: "Grey Goose", category: "Vodka", venue: "Kapital Madrid", venueKey: "kapital", status: "critical",
      img: "https://www.pngplay.com/wp-content/uploads/15/Grey-Goose-Vodka-Transparent-Images.png",
      currentUnits: 8, minUnits: 20, optimalUnits: 36, avgConsumptionUnits: 12,
      current: "8 botellas", min: "20 botellas", optimal: "36 botellas", avgConsumption: "12 bot/noche",
      supplier: "Bacardi-Martini Spain", lastOrder: "18 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€22.40", pvp: "€14.00/copa", margin: "€9.80/copa", marginPct: "69.8%", revenue7d: "€4,312", revenue7dValue: 4312,
    },
    "moet-chandon": {
      name: "Moët & Chandon", category: "Champagne", venue: "Pacha Ibiza", venueKey: "pacha", status: "critical",
      img: "https://www.pngplay.com/wp-content/uploads/15/Moet-Chandon-Brut-Imperial-PNG-Free-File-Download.png",
      currentUnits: 6, minUnits: 15, optimalUnits: 30, avgConsumptionUnits: 8,
      current: "6 botellas", min: "15 botellas", optimal: "30 botellas", avgConsumption: "8 bot/noche",
      supplier: "LVMH Moët Hennessy", lastOrder: "15 may 2026", leadTime: "72 h", orderUnit: "Caja 6 uds",
      costPrice: "€36.20", pvp: "€180.00/botella", margin: "€143.80/bot", marginPct: "79.9%", revenue7d: "€6,840", revenue7dValue: 6840,
    },
    "johnnie-walker": {
      name: "Johnnie Walker", category: "Black Label", venue: "Opium Barcelona", venueKey: "opium", status: "critical",
      img: "https://upload.wikimedia.org/wikipedia/commons/2/21/Johnnie_Walker_Black_Label.jpg",
      currentUnits: 10, minUnits: 25, optimalUnits: 40, avgConsumptionUnits: 9,
      current: "10 botellas", min: "25 botellas", optimal: "40 botellas", avgConsumption: "9 bot/noche",
      supplier: "Diageo España", lastOrder: "20 may 2026", leadTime: "24 h", orderUnit: "Caja 12 uds",
      costPrice: "€18.60", pvp: "€12.00/copa", margin: "€8.10/copa", marginPct: "67.5%", revenue7d: "€3,960", revenue7dValue: 3960,
    },
    "bombay-sapphire": {
      name: "Bombay Sapphire", category: "Gin", venue: "Kapital Madrid", venueKey: "kapital", status: "low",
      img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Bombay-sapphire.jpg",
      currentUnits: 22, minUnits: 20, optimalUnits: 45, avgConsumptionUnits: 7,
      current: "22 botellas", min: "20 botellas", optimal: "45 botellas", avgConsumption: "7 bot/noche",
      supplier: "Bacardi-Martini Spain", lastOrder: "22 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€14.80", pvp: "€11.00/copa", margin: "€7.20/copa", marginPct: "65.4%", revenue7d: "€2,750", revenue7dValue: 2750,
    },
    "patron-silver": {
      name: "Patrón Silver", category: "Tequila", venue: "Pacha Ibiza", venueKey: "pacha", status: "low",
      img: createStockBottleArt("PATRON", "#2d8a63", "#f4f0e4"),
      currentUnits: 14, minUnits: 12, optimalUnits: 24, avgConsumptionUnits: 5,
      current: "14 botellas", min: "12 botellas", optimal: "24 botellas", avgConsumption: "5 bot/noche",
      supplier: "Bacardi España", lastOrder: "21 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€28.90", pvp: "€16.00/copa", margin: "€11.20/copa", marginPct: "70.0%", revenue7d: "€3,180", revenue7dValue: 3180,
    },
    "veuve-clicquot": {
      name: "Veuve Clicquot", category: "Champagne", venue: "Opium Barcelona", venueKey: "opium", status: "low",
      img: createStockBottleArt("VEUVE", "#f5a623", "#f7edcf"),
      currentUnits: 11, minUnits: 10, optimalUnits: 22, avgConsumptionUnits: 4,
      current: "11 botellas", min: "10 botellas", optimal: "22 botellas", avgConsumption: "4 bot/noche",
      supplier: "Moët Hennessy", lastOrder: "23 may 2026", leadTime: "72 h", orderUnit: "Caja 6 uds",
      costPrice: "€39.50", pvp: "€190.00/botella", margin: "€150.50/bot", marginPct: "79.2%", revenue7d: "€4,560", revenue7dValue: 4560,
    },
    "hendricks": {
      name: "Hendrick's", category: "Gin", venue: "Kapital Madrid", venueKey: "kapital", status: "low",
      img: createStockBottleArt("HENDRIX", "#3c3c46", "#e7e7ea"),
      currentUnits: 16, minUnits: 14, optimalUnits: 30, avgConsumptionUnits: 6,
      current: "16 botellas", min: "14 botellas", optimal: "30 botellas", avgConsumption: "6 bot/noche",
      supplier: "William Grant & Sons", lastOrder: "24 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€19.20", pvp: "€13.50/copa", margin: "€8.90/copa", marginPct: "65.9%", revenue7d: "€2,940", revenue7dValue: 2940,
    },
    "don-julio": {
      name: "Don Julio Reposado", category: "Tequila", venue: "Pacha Ibiza", venueKey: "pacha", status: "low",
      img: createStockBottleArt("JULIO", "#c58a34", "#f4e2bf"),
      currentUnits: 18, minUnits: 16, optimalUnits: 28, avgConsumptionUnits: 6,
      current: "18 botellas", min: "16 botellas", optimal: "28 botellas", avgConsumption: "6 bot/noche",
      supplier: "Diageo España", lastOrder: "23 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€31.40", pvp: "€17.00/copa", margin: "€12.40/copa", marginPct: "72.9%", revenue7d: "€3,740", revenue7dValue: 3740,
    },
    "belvedere": {
      name: "Belvedere", category: "Vodka", venue: "Opium Barcelona", venueKey: "opium", status: "low",
      img: createStockBottleArt("BELVE", "#6d889f", "#eef3f7"),
      currentUnits: 19, minUnits: 18, optimalUnits: 32, avgConsumptionUnits: 7,
      current: "19 botellas", min: "18 botellas", optimal: "32 botellas", avgConsumption: "7 bot/noche",
      supplier: "Moët Hennessy", lastOrder: "24 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€24.70", pvp: "€15.00/copa", margin: "€10.10/copa", marginPct: "67.3%", revenue7d: "€3,220", revenue7dValue: 3220,
    },
    "absolut-elyx": {
      name: "Absolut Elyx", category: "Vodka", venue: "Kapital Madrid", venueKey: "kapital", status: "low",
      img: createStockBottleArt("ELYX", "#b07b3d", "#f2ead9"),
      currentUnits: 13, minUnits: 12, optimalUnits: 24, avgConsumptionUnits: 5,
      current: "13 botellas", min: "12 botellas", optimal: "24 botellas", avgConsumption: "5 bot/noche",
      supplier: "Pernod Ricard", lastOrder: "25 may 2026", leadTime: "24 h", orderUnit: "Caja 6 uds",
      costPrice: "€21.80", pvp: "€14.50/copa", margin: "€9.40/copa", marginPct: "64.8%", revenue7d: "€2,610", revenue7dValue: 2610,
    },
  };

  const stockList = document.querySelector(".mph-stock-list");
  const stockTabs = [...document.querySelectorAll(".mph-stock-tab")];
  const stockState = {
    activeFilter: "critical",
    activeVenue: "todos",
    query: "",
  };

  function getStockCoverage(product) {
    return product.minUnits > 0 ? product.currentUnits / product.minUnits : product.currentUnits;
  }

  function getStockDaysCover(product) {
    return product.avgConsumptionUnits > 0 ? product.currentUnits / product.avgConsumptionUnits : product.currentUnits;
  }

  function compareStockProducts(productA, productB) {
    const statusOrder = { critical: 0, low: 1 };
    const statusDiff = statusOrder[productA.status] - statusOrder[productB.status];
    if (statusDiff !== 0) return statusDiff;

    const coverageDiff = getStockCoverage(productA) - getStockCoverage(productB);
    if (Math.abs(coverageDiff) > 0.0001) return coverageDiff;

    const daysCoverDiff = getStockDaysCover(productA) - getStockDaysCover(productB);
    if (Math.abs(daysCoverDiff) > 0.0001) return daysCoverDiff;

    const shortfallDiff = (productB.minUnits - productB.currentUnits) - (productA.minUnits - productA.currentUnits);
    if (shortfallDiff !== 0) return shortfallDiff;

    return (productB.revenue7dValue || 0) - (productA.revenue7dValue || 0);
  }

  function getFilteredStockProducts() {
    const search = stockState.query.trim().toLowerCase();

    return Object.entries(mphStockProducts)
      .filter(([, product]) => {
        if (stockState.activeFilter !== "all" && product.status !== stockState.activeFilter) return false;
        if (stockState.activeVenue !== "todos" && product.venueKey !== stockState.activeVenue) return false;
        if (!search) return true;
        const haystack = `${product.name} ${product.category} ${product.venue}`.toLowerCase();
        return haystack.includes(search);
      })
      .sort(([, productA], [, productB]) => compareStockProducts(productA, productB));
  }

  function renderStockBadges() {
    const scopedProducts = Object.values(mphStockProducts).filter((product) => {
      return stockState.activeVenue === "todos" || product.venueKey === stockState.activeVenue;
    });
    const criticalCount = scopedProducts.filter((product) => product.status === "critical").length;
    const lowCount = scopedProducts.filter((product) => product.status === "low").length;

    stockTabs.forEach((tab) => {
      const badge = tab.querySelector(".mph-badge");
      if (!badge) return;
      if (tab.dataset.stockFilter === "critical") badge.textContent = String(criticalCount);
      if (tab.dataset.stockFilter === "low") badge.textContent = String(lowCount);
    });
  }

  function renderStockList() {
    if (!stockList || !stockEmpty) return;

    const products = getFilteredStockProducts();
    stockList.innerHTML = products.map(([productId, product]) => {
      const isCritical = product.status === "critical";
      return `
        <div class="mph-stock-item ${product.status}" data-product-id="${productId}" style="cursor:pointer">
          <div class="mph-product-accent"></div>
          <div class="mph-product-img">
            <img alt="${product.name} ${product.category}" src="${product.img}"/>
          </div>
          <div class="mph-product-info">
            <div class="mph-product-header">
              <div><strong>${product.name}</strong><small>${product.category} · ${product.venue}</small></div>
              <span class="material-symbols-outlined mph-warning-icon${isCritical ? "" : " mph-warning-icon--amber"}">warning</span>
            </div>
            <div class="mph-product-stock">
              <div><small>Stock actual</small><b${isCritical ? ' class="mph-critical-val"' : ""}>${product.current}</b></div>
              <div><small>Mínimo</small><b>${product.min}</b></div>
            </div>
          </div>
        </div>
      `;
    }).join("");

    stockEmpty.textContent = stockState.query.trim()
      ? "Sin resultados para esa búsqueda."
      : "No hay botellas en este estado para el local seleccionado.";
    stockEmpty.classList.toggle("visible", products.length === 0);
  }

  function syncStockTabs() {
    stockTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.stockFilter === stockState.activeFilter));
  }

  function refreshStockView() {
    syncStockTabs();
    renderStockBadges();
    renderStockList();
  }

  function openStockDetail(productId) {
    const p = mphStockProducts[productId];
    if (!p) return;
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const imgEl = document.getElementById("mphStockDetailImg");
    if (imgEl) { imgEl.src = p.img; imgEl.alt = p.name; }
    setText("mphStockDetailTitle", p.name);
    setText("mphStockDetailName", p.name);
    setText("mphStockDetailCategory", p.category);
    setText("mphStockDetailVenue", p.venue);
    setText("mphStockDetailCurrent", p.current);
    setText("mphStockDetailMin", p.min);
    setText("mphStockDetailOptimal", p.optimal);
    setText("mphStockDetailAvgConsumption", p.avgConsumption);
    setText("mphStockDetailSupplier", p.supplier);
    setText("mphStockDetailLastOrder", p.lastOrder);
    setText("mphStockDetailLeadTime", p.leadTime);
    setText("mphStockDetailOrderUnit", p.orderUnit);
    setText("mphStockDetailCostPrice", p.costPrice);
    setText("mphStockDetailPvp", p.pvp);
    setText("mphStockDetailMargin", p.margin);
    setText("mphStockDetailMarginPct", p.marginPct);
    setText("mphStockDetailRevenue7d", p.revenue7d);
    const badge = document.getElementById("mphStockDetailStatusBadge");
    if (badge) {
      badge.textContent = p.status === "critical" ? "Crítico" : "Bajo";
      badge.className = "mph-group-row-badge " + (p.status === "critical" ? "down" : "neutral");
    }
    const statusEl = document.getElementById("mphStockDetailStatus");
    if (statusEl) {
      statusEl.textContent = p.status === "critical" ? "Crítico" : "Bajo";
      statusEl.className = "mph-stock-detail-status " + p.status;
    }
  }

  function closeInlineMenus() {
    scopeMenu && (scopeMenu.hidden = true);
    dateMenu && (dateMenu.hidden = true);
    localDateMenu && (localDateMenu.hidden = true);
    scopeTrigger?.setAttribute("aria-expanded", "false");
    dateTrigger?.setAttribute("aria-expanded", "false");
    localDateTrigger?.setAttribute("aria-expanded", "false");
  }

  function toggleInlineMenu(menu, triggerButton) {
    if (!menu || !triggerButton) return;
    const willOpen = menu.hidden;
    closeInlineMenus();
    menu.hidden = !willOpen;
    triggerButton.setAttribute("aria-expanded", willOpen ? "true" : "false");
  }

  function openLocalDatePicker() {
    if (!(localDateNative instanceof HTMLInputElement)) return;
    closeInlineMenus();
    if (typeof localDateNative.showPicker === "function") {
      localDateNative.showPicker();
      return;
    }
    localDateNative.focus();
    localDateNative.click();
  }

  function openPreview() {
    if (!overlay) return;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closePreview() {
    if (!overlay) return;
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  function switchMphScreen(screenId) {
    document.querySelectorAll(".mph-screen").forEach((s) => s.classList.remove("active"));
    document.querySelectorAll(".mph-bottom-nav button[data-mph-screen]").forEach((b) => b.classList.remove("active"));
    const target = document.querySelector(`.mph-screen[data-mph-screen="${screenId}"]`);
    const navBtn = document.querySelector(`.mph-bottom-nav button[data-mph-screen="${screenId}"]`);
    if (target) target.classList.add("active");
    if (navBtn) navBtn.classList.add("active");
  }

  function getPanelTargetVenueId() {
    return panelScopeVenueMap[activePanelVenue] || window.mphSupabase?.config?.appVenueId || "kapital-madrid";
  }

  function getRoleCatalogKey(role) {
    return role === "bars" ? "barra" : role === "guardarropia" ? "guardarropia" : "taquilla";
  }

  function getRoleMeta(role) {
    return {
      bars: { title: "Vista Barra", subtitle: "TPV rápido para bebidas y cobro", heroLabel: "Barra activa", pill: "TPV" },
      taquilla: { title: "Vista Taquilla", subtitle: "Entradas, RRPP e incidencias de puerta", heroLabel: "Taquilla activa", pill: "Acceso" },
      guardarropia: { title: "Vista Guardarropía", subtitle: "Tickets, recogidas y extras", heroLabel: "Guardarropía activa", pill: "Tickets" },
      vip: { title: "Vista VIP", subtitle: "Mesas, reservas y servicio de sala", heroLabel: "Sala VIP", pill: "Floor" },
      aforo: { title: "Vista Pica", subtitle: "Control simple de acceso y aforo", heroLabel: "Control de aforo", pill: "Pica" },
    }[role] || { title: "Vista operativa", subtitle: "Operativa en directo", heroLabel: "Operativa", pill: "Live" };
  }

  function renderRoleTpvView(role) {
    const catalog = getRoleCatalogKey(role);
    setTPVCatalog(catalog, false);
    const products = getTpvCatalogProducts(catalog);
    const itemCount = tpvState.ticket.reduce((sum, item) => sum + item.qty, 0);
    const totalAmount = tpvState.ticket.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const meta = getRoleMeta(role);
    return `
      <div class="mph-role-shell">
        <section class="mph-role-hero-card">
          <p class="mph-role-hero-label">${meta.heroLabel}</p>
          <div class="mph-role-hero-main">
            <div>
              <strong>${formatMoney(totalAmount)}</strong>
              <span>${role === "taquilla" ? "Venta acumulada del ticket activo." : role === "guardarropia" ? "Importe actual de tickets y extras." : "Cobro en tiempo real de la barra actual."}</span>
            </div>
            <span class="mph-role-pill">${meta.pill}</span>
          </div>
          <div class="mph-role-kpi-grid">
            <article><small>Ítems</small><b>${itemCount}</b></article>
            <article><small>Ticket medio</small><b>${formatMoney(Math.max(0, totalAmount / Math.max(itemCount, 1)))}</b></article>
            <article><small>Catálogo</small><b>${catalog === "barra" ? "Barra" : catalog === "guardarropia" ? "Ropero" : "Entradas"}</b></article>
          </div>
        </section>
        <section class="mph-role-ticket-card">
          <div class="mph-role-ticket-head">
            <div>
              <strong>Ticket activo</strong>
              <span>${itemCount} líneas operativas</span>
            </div>
            <button class="mph-role-btn mph-role-btn--ghost" type="button" data-mph-role-clear>Vaciar</button>
          </div>
          <div class="mph-role-ticket-list">
            ${tpvState.ticket.length ? tpvState.ticket.map((item) => `
              <article class="mph-role-ticket-item">
                <div class="mph-role-ticket-row">
                  <div>
                    <strong>${item.name}</strong>
                    <span>${item.category || item.tag || ""}</span>
                  </div>
                  <b>${formatMoney(item.price * item.qty)}</b>
                </div>
                <div class="mph-role-ticket-actions">
                  <button class="mph-role-btn" type="button" data-mph-role-remove="${item.id}">- 1</button>
                  <button class="mph-role-btn" type="button" data-mph-role-add="${item.id}">+ 1</button>
                  <button class="mph-role-btn mph-role-btn--ghost" type="button" data-mph-role-delete="${item.id}">Quitar</button>
                </div>
              </article>
            `).join("") : `<div class="mph-role-empty">Todavía no hay productos añadidos. Pulsa una opción del catálogo para construir el ticket.</div>`}
          </div>
          <div class="mph-role-ticket-total">
            <div>
              <span>Total</span>
              <strong>${formatMoney(totalAmount)}</strong>
            </div>
            <div class="mph-role-inline-actions">
              <button class="mph-role-btn mph-role-btn--ghost" type="button" data-mph-role-pay="cash">Efectivo</button>
              <button class="mph-role-btn mph-role-btn--primary" type="button" data-mph-role-pay="card">Tarjeta</button>
            </div>
          </div>
        </section>
        <section class="mph-role-section-card">
          <div class="mph-role-section-head">
            <div>
              <strong>${catalog === "taquilla" ? "Entradas disponibles" : catalog === "guardarropia" ? "Servicios disponibles" : "Catálogo rápido"}</strong>
              <span>Pulsa para añadir al ticket</span>
            </div>
          </div>
          <div class="mph-role-product-grid">
            ${products.map((product) => `
              <article class="mph-role-product-card">
                <strong>${product.name}</strong>
                <span>${product.tag || product.category || ""}</span>
                <b>${formatMoney(product.price)}</b>
                <button class="mph-role-btn mph-role-btn--primary" type="button" data-mph-role-add="${product.id}">Añadir</button>
              </article>
            `).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderRoleVipView(venueId) {
    const meta = getRoleMeta("vip");
    const tables = getMphLocalSectionItems(venueId, "vip");
    const reservedCount = tables.filter((item) => item.status === "reserved").length;
    const occupiedCount = tables.filter((item) => item.status === "occupied").length;
    return `
      <div class="mph-role-shell">
        <section class="mph-role-hero-card">
          <p class="mph-role-hero-label">${meta.heroLabel}</p>
          <div class="mph-role-hero-main">
            <div>
              <strong>${occupiedCount + reservedCount}</strong>
              <span>Mesas activas entre reservadas y sentadas.</span>
            </div>
            <span class="mph-role-pill">${meta.pill}</span>
          </div>
          <div class="mph-role-kpi-grid">
            <article><small>Reservadas</small><b>${reservedCount}</b></article>
            <article><small>Sentadas</small><b>${occupiedCount}</b></article>
            <article><small>Libres</small><b>${tables.filter((item) => item.status === "available").length}</b></article>
          </div>
        </section>
        <section class="mph-role-section-card">
          <div class="mph-role-section-head">
            <div>
              <strong>Mesas y reservas</strong>
              <span>Estado real de sala VIP</span>
            </div>
            <button class="mph-role-btn mph-role-btn--ghost" type="button" data-mph-role-open-local="vip">Mapa</button>
          </div>
          <div class="mph-role-stack">
            ${tables.map((table) => `
              <article>
                <div class="mph-role-stack-top">
                  <div>
                    <strong>${table.label} · ${table.name}</strong>
                    <span>${table.reservationClient || "Sin reserva activa"} · ${table.reservationGuests ? `${table.reservationGuests} pax` : "pax pendiente"}</span>
                  </div>
                  <div style="text-align:right">
                    <span class="mph-role-table-status">${table.statusLabel || table.status}</span>
                    <b style="display:block;margin-top:8px">${formatPreciseCurrency(table.reservationMinimum || table.minimumSpend || 0)}</b>
                  </div>
                </div>
                <small>${table.reservationDeposit ? `Señal ${formatPreciseCurrency(table.reservationDeposit)} · ` : ""}${table.device || table.subtitle}</small>
                <div class="mph-role-inline-actions">
                  <button class="mph-role-btn mph-role-btn--primary" type="button" data-mph-role-vip-cycle="${table.id}">${table.status === "occupied" ? "Liberar" : table.status === "reserved" ? "Sentar" : table.status === "blocked" ? "Desbloquear" : "Reservar"}</button>
                  <button class="mph-role-btn mph-role-btn--ghost" type="button" data-mph-role-open-vip-detail="${table.id}">Ficha</button>
                </div>
              </article>
            `).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderRoleAforoView(venueId) {
    const meta = getRoleMeta("aforo");
    const counters = getMphLocalSectionItems(venueId, "aforo");
    if (!mphRoleViewState.focusId || !counters.some((item) => item.id === mphRoleViewState.focusId)) {
      mphRoleViewState.focusId = counters[0]?.id || null;
    }
    const activeCounter = counters.find((item) => item.id === mphRoleViewState.focusId) || counters[0];
    const snapshot = computeMphVenueDayMetrics(venueId, mphLocalDetailState.selectedDate);
    return `
      <div class="mph-role-shell">
        <section class="mph-role-hero-card">
          <p class="mph-role-hero-label">${meta.heroLabel}</p>
          <div class="mph-role-hero-main">
            <div>
              <strong>${snapshot.realCapacity.toLocaleString("es-ES")}</strong>
              <span>Personas dentro según el cierre parcial actual.</span>
            </div>
            <span class="mph-role-pill">${snapshot.occupancyPct}%</span>
          </div>
          <div class="mph-role-kpi-grid">
            <article><small>Legal</small><b>${snapshot.opsProfile.legalCapacity.toLocaleString("es-ES")}</b></article>
            <article><small>Cola</small><b>${snapshot.queueMinutes} min</b></article>
            <article><small>Activo</small><b>${activeCounter?.label || "E1"}</b></article>
          </div>
        </section>
        <section class="mph-role-section-card">
          <div class="mph-role-section-head">
            <div>
              <strong>Controladores</strong>
              <span>Selecciona un acceso</span>
            </div>
          </div>
          <div class="mph-role-counter-picker">
            ${counters.map((counter) => `
              <button class="${counter.id === mphRoleViewState.focusId ? "active" : ""}" type="button" data-mph-role-counter="${counter.id}">${counter.label}</button>
            `).join("")}
          </div>
        </section>
        <section class="mph-role-section-card">
          <div class="mph-role-counter-value">
            <div>
              <strong>${Number(activeCounter?.counterValue || 0).toLocaleString("es-ES")}</strong>
              <span>${activeCounter?.name || "Entrada principal"} · ${activeCounter?.mix || ""}</span>
            </div>
          </div>
          <div class="mph-role-inline-actions" style="margin-top:12px">
            <button class="mph-role-btn mph-role-btn--ghost" type="button" data-mph-role-capacity="-1">Salida -1</button>
            <button class="mph-role-btn mph-role-btn--primary" type="button" data-mph-role-capacity="1">Entrada +1</button>
            <button class="mph-role-btn" type="button" data-mph-role-open-local="aforo">Detalle</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderRoleView() {
    if (!roleViewContent) return;
    const venueId = mphRoleViewState.venueId || getPanelTargetVenueId();
    const venueProfile = getMphVenueProfileById(venueId);
    const meta = getRoleMeta(mphRoleViewState.role);
    if (roleTitle) roleTitle.textContent = meta.title;
    if (roleVenueLabel) roleVenueLabel.textContent = venueProfile.name;
    if (roleSubtitle) roleSubtitle.textContent = meta.subtitle;

    roleViewContent.innerHTML = mphRoleViewState.role === "vip"
      ? renderRoleVipView(venueId)
      : mphRoleViewState.role === "aforo"
        ? renderRoleAforoView(venueId)
        : renderRoleTpvView(mphRoleViewState.role);
  }

  function openRoleView(role) {
    mphRoleViewState.role = role;
    mphRoleViewState.venueId = getPanelTargetVenueId();
    mphRoleViewState.focusId = null;
    renderRoleView();
    switchMphScreen("role-view");
    showToast(`Vista ${getRoleMeta(role).title} abierta.`);
  }

  function openPanelQuickAccess(target) {
    const key = target || "bars";
    if (key === "finanzas") {
      switchMphScreen("finanzas");
      showToast("Vista Finanzas abierta.");
      return;
    }
    openRoleView(key);
  }

  function applyAuthenticatedMobileView(roleKey) {
    const normalizedRole = String(roleKey || "").toLowerCase();
    const isManager = normalizedRole === "manager";
    const roleScreenMap = {
      barra: "bars",
      taquilla: "taquilla",
      guardarropia: "guardarropia",
      vip: "vip",
      pica: "aforo",
    };

    quickAccessButtons.forEach((button) => {
      button.hidden = !isManager;
    });

    bottomNavButtons.forEach((button) => {
      const screen = button.dataset.mphScreen || "";
      const shouldShow = isManager
        ? true
        : normalizedRole === "office"
          ? screen === "finanzas"
          : false;
      button.hidden = !shouldShow;
    });

    if (roleBackBtn) roleBackBtn.hidden = !isManager;
    if (roleAppsButton) roleAppsButton.hidden = !isManager;
    if (closeBtn) closeBtn.hidden = !isManager;

    if (isManager) {
      closePreview();
      switchMphScreen("panel");
      return;
    }

    if (normalizedRole === "office") {
      switchMphScreen("finanzas");
      if (window.innerWidth > 1180) openPreview();
      return;
    }

    const mappedRole = roleScreenMap[normalizedRole];
    if (mappedRole) {
      openRoleView(mappedRole);
      if (window.innerWidth > 1180) openPreview();
      return;
    }

    closePreview();
    switchMphScreen("panel");
  }

  window.mphApplyAuthView = applyAuthenticatedMobileView;

  function applyVenuePeriod(periodKey, announce = false) {
    activeVenuePeriod = periodKey || "today";
    venueTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.mphPeriod === activeVenuePeriod));
    renderMphVenueRows(activeVenuePeriod);
    if (announce) showToast(`Periodo ${venueTabs.find((tab) => tab.dataset.mphPeriod === activeVenuePeriod)?.textContent?.trim() || "Hoy"} aplicado.`);
  }

  async function hydrateSupabaseVenue() {
    const api = window.mphSupabase;
    if (!api) return;

    const venue = await api.loadVenue();
    if (!venue) return;

    const targetVenueId = api.config.appVenueId || "kapital-madrid";
    const venueProfile = mphVenueProfiles.find((profile) => profile.id === targetVenueId);
    const opsProfile = mphVenueOperations[targetVenueId];

    if (venueProfile) {
      venueProfile.name = venue.name || venueProfile.name;
      venueProfile.baseOccupancy = venueProfile.baseOccupancy || 78;
    }

    if (opsProfile) {
      opsProfile.city = venue.city || opsProfile.city;
      opsProfile.legalCapacity = venue.legal_capacity || opsProfile.legalCapacity;
    }

    if (mphLocalDetailState.venueId === targetVenueId) renderMphLocalDetail();
    applyVenuePeriod(activeVenuePeriod, false);
  }

  function mapSupabaseProductToTpvProduct(row) {
    const meta = row.metadata || {};
    return {
      id: row.id,
      name: row.name,
      price: Number(row.price || 0),
      tag: meta.tag || row.category || row.section_key,
      tone: meta.tone || "slate",
      icon: meta.icon || "point_of_sale",
      category: row.category || row.section_key,
      cost: Number(row.cost || 0),
      sku: row.sku,
    };
  }

  async function hydrateSupabaseOperationalData(selectedDate = mphLocalDetailState.selectedDate) {
    const api = window.mphSupabase;
    if (!api?.isConfigured?.()) return;
    const reservationDate = formatMphInputDate(selectedDate);

    const [barra, taquilla, guardarropia, vipProducts, vipTables, vipReservations, capacityCounters] = await Promise.all([
      api.listProducts("barra"),
      api.listProducts("taquilla"),
      api.listProducts("guardarropia"),
      api.listProducts("vip"),
      api.listVipTables(),
      api.listVipReservations(reservationDate),
      api.listCapacityCounters(),
    ]);

    mphSupabaseRuntime.productsBySection.barra = barra.map(mapSupabaseProductToTpvProduct);
    mphSupabaseRuntime.productsBySection.taquilla = taquilla.map(mapSupabaseProductToTpvProduct);
    mphSupabaseRuntime.productsBySection.guardarropia = guardarropia.map(mapSupabaseProductToTpvProduct);
    mphSupabaseRuntime.productsBySection.vip = vipProducts.map(mapSupabaseProductToTpvProduct);
    mphSupabaseRuntime.vipTables = vipTables;
    mphSupabaseRuntime.vipReservations = vipReservations;
    mphSupabaseRuntime.capacityCounters = capacityCounters;

    renderTPVCatalog();
    renderMphLocalDetail();
  }

  async function persistTpvSale(paymentMethod) {
    if (!tpvState.ticket.length) {
      showToast("Añade productos al ticket.");
      return;
    }

    const api = window.mphSupabase;
    if (!api?.isConfigured?.()) {
      showToast("Supabase no está listo.");
      return;
    }

    const sectionKey = tpvState.catalog === "barra" ? "barra" : tpvState.catalog === "guardarropia" ? "guardarropia" : "taquilla";
    const result = sectionKey === "guardarropia"
      ? await api.createCloakroomTicket({
          paymentMethod,
          ticketItems: tpvState.ticket,
          notes: "Creado desde TPV prototipo",
        })
      : await api.createPosSale({
          sectionKey,
          paymentMethod,
          ticketItems: tpvState.ticket,
        });

    if (result.error) {
      showToast(sectionKey === "guardarropia" ? "No se pudo guardar el ticket." : "No se pudo guardar la venta.");
      return;
    }

    const total = tpvState.ticket.reduce((sum, item) => sum + (item.price * item.qty), 0);
    tpvState.ticket = [];
    renderTPVTicket();
    showToast(sectionKey === "guardarropia" ? `Ticket guardado ${formatMoney(total)}.` : `Venta guardada ${formatMoney(total)}.`);
  }

  async function applyCapacityDelta(counterId, delta) {
    const api = window.mphSupabase;
    if (!api?.isConfigured?.()) {
      showToast("Supabase no está listo.");
      return;
    }

    const counter = mphSupabaseRuntime.capacityCounters.find((item) => item.id === counterId);
    if (!counter) return;
    const nextValue = Math.max(0, Number(counter.counter_value || 0) + delta);
    const result = await api.updateCapacityCounter(counterId, nextValue);
    if (result.error) {
      showToast("No se pudo actualizar el aforo.");
      return;
    }

    counter.counter_value = nextValue;
    renderMphLocalDetail();
    showToast(`Aforo actualizado: ${nextValue}.`);
  }

  async function cycleVipTable(tableId) {
    const api = window.mphSupabase;
    if (!api?.isConfigured?.()) {
      showToast("Supabase no está listo.");
      return;
    }

    const table = mphSupabaseRuntime.vipTables.find((item) => item.id === tableId);
    if (!table) return;
    const activeReservation = getVipActiveReservation(tableId, mphLocalDetailState.selectedDate);
    const nextStatus = table.status === "occupied"
      ? "available"
      : table.status === "reserved"
        ? "occupied"
        : table.status === "blocked"
          ? "available"
          : "reserved";

    const tableResult = await api.updateVipTable(tableId, { status: nextStatus });
    if (tableResult.error) {
      showToast("No se pudo actualizar la mesa VIP.");
      return;
    }

    table.status = nextStatus;
    if (nextStatus === "reserved" && !activeReservation) {
      const createReservationResult = await api.createVipReservation({
        vip_table_id: tableId,
        reservation_date: formatMphInputDate(mphLocalDetailState.selectedDate),
        client_name: `Reserva ${table.code}`,
        guests_count: table.capacity || 4,
        minimum_spend: table.minimum_spend || 0,
        deposit_amount: Number((Number(table.minimum_spend || 0) * 0.35).toFixed(2)),
        status: "confirmed",
        notes: "Creada desde mapa operativo",
      });
      if (!createReservationResult.error && createReservationResult.data) {
        mphSupabaseRuntime.vipReservations = [createReservationResult.data, ...mphSupabaseRuntime.vipReservations];
      }
    }

    if (nextStatus === "occupied" && activeReservation?.id) {
      const seatedResult = await api.updateVipReservation(activeReservation.id, { status: "seated" });
      if (!seatedResult.error && seatedResult.data) {
        mphSupabaseRuntime.vipReservations = mphSupabaseRuntime.vipReservations.map((item) => item.id === seatedResult.data.id ? seatedResult.data : item);
      }
    }

    if (nextStatus === "available" && activeReservation?.id) {
      const completeResult = await api.updateVipReservation(activeReservation.id, { status: "completed" });
      if (!completeResult.error && completeResult.data) {
        mphSupabaseRuntime.vipReservations = mphSupabaseRuntime.vipReservations.map((item) => item.id === completeResult.data.id ? completeResult.data : item);
      }
    }

    renderMphLocalDetail();
    showToast(
      nextStatus === "reserved"
        ? `Mesa ${table.code} reservada.`
        : nextStatus === "occupied"
          ? `Mesa ${table.code} sentada.`
          : `Mesa ${table.code} liberada.`
    );
  }

  async function saveVipReservation(tableId, formData) {
    const api = window.mphSupabase;
    if (!api?.isConfigured?.()) {
      showToast("Supabase no está listo.");
      return;
    }

    const table = mphSupabaseRuntime.vipTables.find((item) => item.id === tableId);
    if (!table) return;
    if (table.status === "blocked") {
      showToast("Desbloquea la mesa antes de guardar la reserva.");
      return;
    }

    const clientName = String(formData.get("client_name") || "").trim();
    if (!clientName) {
      showToast("Añade el nombre del cliente.");
      return;
    }

    const guestsCount = Math.max(1, Math.round(parseMphNumber(formData.get("guests_count"), table.capacity || 4)));
    const minimumSpend = Math.max(0, Number(parseMphNumber(formData.get("minimum_spend"), table.minimum_spend || 0).toFixed(2)));
    const depositAmount = Math.max(0, Number(parseMphNumber(formData.get("deposit_amount"), minimumSpend ? minimumSpend * 0.35 : 0).toFixed(2)));
    const notes = String(formData.get("notes") || "").trim();
    const activeReservation = getVipActiveReservation(tableId, mphLocalDetailState.selectedDate);
    const reservationPayload = {
      vip_table_id: tableId,
      reservation_date: formatMphInputDate(mphLocalDetailState.selectedDate),
      client_name: clientName,
      guests_count: guestsCount,
      minimum_spend: minimumSpend,
      deposit_amount: depositAmount,
      status: table.status === "occupied" ? "seated" : "confirmed",
      notes: notes || null,
    };

    const result = activeReservation?.id
      ? await api.updateVipReservation(activeReservation.id, reservationPayload)
      : await api.createVipReservation(reservationPayload);

    if (result.error || !result.data) {
      showToast("No se pudo guardar la reserva VIP.");
      return;
    }

    mphSupabaseRuntime.vipReservations = activeReservation?.id
      ? mphSupabaseRuntime.vipReservations.map((item) => item.id === result.data.id ? result.data : item)
      : [result.data, ...mphSupabaseRuntime.vipReservations];

    if (table.status === "available") {
      const tableResult = await api.updateVipTable(tableId, { status: "reserved" });
      if (!tableResult.error) table.status = "reserved";
    }

    renderMphLocalDetail();
    showToast(`Reserva guardada para ${clientName}.`);
  }

  async function cancelVipReservation(tableId) {
    const api = window.mphSupabase;
    if (!api?.isConfigured?.()) {
      showToast("Supabase no está listo.");
      return;
    }

    const table = mphSupabaseRuntime.vipTables.find((item) => item.id === tableId);
    const activeReservation = getVipActiveReservation(tableId, mphLocalDetailState.selectedDate);
    if (!table || !activeReservation?.id) return;

    const reservationResult = await api.updateVipReservation(activeReservation.id, { status: "cancelled" });
    if (reservationResult.error || !reservationResult.data) {
      showToast("No se pudo cancelar la reserva.");
      return;
    }

    mphSupabaseRuntime.vipReservations = mphSupabaseRuntime.vipReservations.map((item) =>
      item.id === reservationResult.data.id ? reservationResult.data : item
    );

    if (table.status !== "blocked") {
      const tableResult = await api.updateVipTable(tableId, { status: "available" });
      if (!tableResult.error) table.status = "available";
    }

    renderMphLocalDetail();
    showToast(`Reserva ${table.code} cancelada.`);
  }

  window.addEventListener("mph:supabase-status", (event) => {
    const status = event.detail?.status;
    if (status === "connected") showToast("Supabase conectado.");
    if (status === "error") showToast("Supabase no ha podido conectar. Seguimos en modo demo.");
    syncAuthUi().catch(() => {});
  });

  window.addEventListener("mph:supabase-ready", () => {
    hydrateSupabaseVenue().catch(() => {});
    hydrateFinanceSnapshotFromSupabase().catch(() => {});
    hydrateSupabaseOperationalData().catch(() => {});
    syncAuthUi().catch(() => {});
  });

  window.addEventListener("mph:supabase-auth", async (event) => {
    const authEvent = event.detail?.event;
    await syncAuthUi().catch(() => {});
    if (authEvent === "SIGNED_IN") {
      const roles = mphAuthState.roles.map((role) => getAuthRoleLabel(role.role_key)).join(", ");
      showToast(roles ? `Sesión iniciada. Roles: ${roles}.` : "Sesión iniciada.");
    }
    if (authEvent === "SIGNED_OUT") showToast("Sesión cerrada.");
  });

  authForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const api = window.mphSupabase;
    if (!api?.signInWithPassword) {
      setAuthError("Supabase Auth no está disponible todavía.");
      return;
    }

    mphAuthState.roles = [];
    mphAuthState.userId = null;
    mphAuthState.activeRoleKey = null;
    mphAuthState.appliedSignature = "";
    renderAuthRoles([]);
    setAuthError("");
    if (authStatus) authStatus.textContent = "Verificando credenciales y cargando tu rol...";
    setAuthBusy(true, "Entrando...");

    const result = await api.signInWithPassword({
      email: authEmailInput?.value?.trim() || "",
      password: authPasswordInput?.value || "",
    });

    if (result?.error) {
      setAuthBusy(false, "Entrar");
      setAuthError(result.error.message || "No se pudo iniciar sesión.");
      return;
    }

    await syncAuthUi();
  });

  logoutLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      handleAuthLogout().catch(() => showToast("No se pudo cerrar la sesión."));
    });
  });

  tpvPayCardButton?.addEventListener("click", () => {
    persistTpvSale("card").catch(() => showToast("No se pudo guardar la venta."));
  });

  tpvPayCashButton?.addEventListener("click", () => {
    persistTpvSale("cash").catch(() => showToast("No se pudo guardar la venta."));
  });

  localOpsDetail?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const capacityTrigger = event.target.closest("[data-mph-capacity-delta]");
    if (capacityTrigger) {
      const delta = Number(capacityTrigger.dataset.mphCapacityDelta || 0);
      applyCapacityDelta(mphLocalDetailState.pointId, delta).catch(() => showToast("No se pudo actualizar el aforo."));
      return;
    }

    const vipTrigger = event.target.closest("[data-mph-vip-cycle]");
    if (vipTrigger) {
      cycleVipTable(vipTrigger.dataset.mphVipCycle).catch(() => showToast("No se pudo actualizar la mesa VIP."));
      return;
    }

    const vipCancelTrigger = event.target.closest("[data-mph-vip-cancel]");
    if (vipCancelTrigger) {
      cancelVipReservation(vipCancelTrigger.dataset.mphVipCancel).catch(() => showToast("No se pudo cancelar la reserva."));
    }
  });

  localOpsDetail?.addEventListener("submit", (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.matches("[data-mph-vip-form]")) return;
    event.preventDefault();
    saveVipReservation(form.dataset.mphVipForm, new FormData(form)).catch(() => showToast("No se pudo guardar la reserva VIP."));
  });

  trigger?.addEventListener("click", openPreview);
  closeBtn?.addEventListener("click", closePreview);
  backBtn?.addEventListener("click", () => switchMphScreen("locales"));
  roleBackBtn?.addEventListener("click", () => switchMphScreen("panel"));
  categoryBackBtn?.addEventListener("click", () => switchMphScreen("personal"));
  staffBackBtn?.addEventListener("click", () => switchMphScreen("category-detail"));
  stockDetailBackBtn?.addEventListener("click", () => switchMphScreen("stock"));
  localDateTrigger?.addEventListener("click", () => toggleInlineMenu(localDateMenu, localDateTrigger));
  localDatePickerBtn?.addEventListener("click", openLocalDatePicker);
  financeDateTrigger?.addEventListener("click", openFinanceDatePicker);
  financeDatePickerBtn?.addEventListener("click", openFinanceDatePicker);
  localCapacityInfoBtn?.addEventListener("click", () => {
    mphLocalDetailState.section = "aforo";
    mphLocalDetailState.pointId = getMphLocalSectionItems(mphLocalDetailState.venueId, "aforo")[0]?.id || null;
    renderMphLocalDetail();
  });

  const drawerOverlay = document.getElementById("mphDrawerOverlay");
  const drawer = document.getElementById("mphDrawer");
  function openDrawer()  { if (drawerOverlay) drawerOverlay.hidden = false; }
  function closeDrawer() { if (drawerOverlay) drawerOverlay.hidden = true; }
  window.mphCloseDrawer = closeDrawer;
  document.querySelectorAll(".mph-topbar .mph-icon-btn:first-child").forEach(btn => {
    if (btn.querySelector(".material-symbols-outlined")?.textContent?.trim() === "menu") {
      btn.addEventListener("click", openDrawer);
    }
  });
  drawerOverlay?.addEventListener("click", (e) => { if (!drawer?.contains(e.target)) closeDrawer(); });
  drawer?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const actionRow = event.target.closest("[data-mph-drawer-action]");
    if (!actionRow) return;

    const action = actionRow.dataset.mphDrawerAction || "";
    if (action === "appearance") {
      closeDrawer();
      openSettings();
      return;
    }

    const labels = {
      venue: "Cambio de local: próximamente.",
      language: "Cambio de idioma: próximamente.",
      currency: "Cambio de moneda: próximamente.",
      password: "Cambio de contraseña: próximamente.",
      sessions: "Sesiones activas: próximamente.",
    };

    closeDrawer();
    showToast(labels[action] || "Ajuste disponible próximamente.");
  });

  const notifOverlay = document.getElementById("mphNotifOverlay");
  const notifClose   = document.getElementById("mphNotifClose");
  const notifBell    = document.querySelector(".mph-screen[data-mph-screen='panel'] .mph-topbar .mph-icon-btn:last-child");
  notifBell?.addEventListener("click", () => { if (notifOverlay) notifOverlay.hidden = false; });
  notifClose?.addEventListener("click", () => { if (notifOverlay) notifOverlay.hidden = true; });
  notifOverlay?.addEventListener("click", (e) => { if (e.target === notifOverlay) notifOverlay.hidden = true; });
  scopeTrigger?.addEventListener("click", () => toggleInlineMenu(scopeMenu, scopeTrigger));
  dateTrigger?.addEventListener("click", () => toggleInlineMenu(dateMenu, dateTrigger));

  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closePreview();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && !overlay.hidden) closePreview();
  });

  document.querySelectorAll(".mph-bottom-nav button[data-mph-screen]").forEach((btn) => {
    btn.addEventListener("click", () => switchMphScreen(btn.dataset.mphScreen));
  });

  document.querySelectorAll("[data-mph-panel-access]").forEach((button) => {
    button.addEventListener("click", () => openPanelQuickAccess(button.dataset.mphPanelAccess));
  });

  roleViewContent?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;

    const addTrigger = event.target.closest("[data-mph-role-add]");
    if (addTrigger) {
      addTPVItem(addTrigger.dataset.mphRoleAdd);
      renderRoleView();
      return;
    }

    const removeTrigger = event.target.closest("[data-mph-role-remove]");
    if (removeTrigger) {
      removeTPVItem(removeTrigger.dataset.mphRoleRemove);
      renderRoleView();
      return;
    }

    const deleteTrigger = event.target.closest("[data-mph-role-delete]");
    if (deleteTrigger) {
      tpvState.ticket = tpvState.ticket.filter((item) => item.id !== deleteTrigger.dataset.mphRoleDelete);
      renderTPVTicket();
      renderRoleView();
      return;
    }

    const clearTrigger = event.target.closest("[data-mph-role-clear]");
    if (clearTrigger) {
      tpvState.ticket = [];
      renderTPVTicket();
      renderRoleView();
      showToast("Ticket vaciado.");
      return;
    }

    const payTrigger = event.target.closest("[data-mph-role-pay]");
    if (payTrigger) {
      persistTpvSale(payTrigger.dataset.mphRolePay).then(() => renderRoleView()).catch(() => showToast("No se pudo guardar la venta."));
      return;
    }

    const vipCycleTrigger = event.target.closest("[data-mph-role-vip-cycle]");
    if (vipCycleTrigger) {
      cycleVipTable(vipCycleTrigger.dataset.mphRoleVipCycle).then(() => renderRoleView()).catch(() => showToast("No se pudo actualizar la mesa VIP."));
      return;
    }

    const openVipDetailTrigger = event.target.closest("[data-mph-role-open-vip-detail]");
    if (openVipDetailTrigger) {
      const venueId = mphRoleViewState.venueId || getPanelTargetVenueId();
      openMphLocalDetail(venueId, mphLocalDetailState.selectedDate);
      mphLocalDetailState.section = "vip";
      mphLocalDetailState.pointId = openVipDetailTrigger.dataset.mphRoleOpenVipDetail;
      renderMphLocalDetail();
      switchMphScreen("local-detail");
      return;
    }

    const counterTrigger = event.target.closest("[data-mph-role-counter]");
    if (counterTrigger) {
      mphRoleViewState.focusId = counterTrigger.dataset.mphRoleCounter;
      renderRoleView();
      return;
    }

    const capacityTrigger = event.target.closest("[data-mph-role-capacity]");
    if (capacityTrigger && mphRoleViewState.focusId) {
      const delta = Number(capacityTrigger.dataset.mphRoleCapacity || 0);
      applyCapacityDelta(mphRoleViewState.focusId, delta).then(() => renderRoleView()).catch(() => showToast("No se pudo actualizar el aforo."));
      return;
    }

    const openLocalTrigger = event.target.closest("[data-mph-role-open-local]");
    if (openLocalTrigger) {
      const sectionKey = openLocalTrigger.dataset.mphRoleOpenLocal || "bars";
      const venueId = mphRoleViewState.venueId || getPanelTargetVenueId();
      openMphLocalDetail(venueId, mphLocalDetailState.selectedDate);
      mphLocalDetailState.section = sectionKey;
      mphLocalDetailState.pointId = getMphLocalSectionItems(venueId, sectionKey)[0]?.id || null;
      renderMphLocalDetail();
      switchMphScreen("local-detail");
    }
  });

  document.querySelectorAll("[data-mph-goto]").forEach((el) => {
    el.addEventListener("click", () => switchMphScreen(el.dataset.mphGoto));
  });

  venueList?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest(".mph-venue-row[data-mph-goto]");
    if (!trigger) return;
    openMphLocalDetail(trigger.dataset.mphVenueId || "kapital-madrid");
    switchMphScreen(trigger.dataset.mphGoto);
  });

  venueTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      applyVenuePeriod(tab.dataset.mphPeriod || "today", true);
    });
  });

  categoryTable?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest(".mph-cat-row[data-mph-category]");
    if (!trigger) return;
    openMphCategoryDetail(trigger.dataset.mphCategory, true);
    switchMphScreen("category-detail");
  });

  categoryRoster?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest("[data-mph-staff-id]");
    if (!trigger) return;
    openMphStaffSheet(trigger.dataset.mphStaffId, true);
    switchMphScreen("staff-sheet");
  });

  staffTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchMphStaffTab(tab.dataset.mphStaffTab || "summary", true));
  });

  localSectionTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mphLocalDetailState.section = tab.dataset.mphLocalSection || "bars";
      mphLocalDetailState.pointId = getMphLocalSectionItems(mphLocalDetailState.venueId, mphLocalDetailState.section)[0]?.id || null;
      renderMphLocalDetail();
    });
  });

  localMap?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest("[data-mph-map-point]");
    if (!trigger) return;
    mphLocalDetailState.pointId = trigger.dataset.mphMapPoint;
    renderMphLocalDetail();
  });

  localDateMenu?.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest("[data-mph-local-date]");
    if (!trigger) return;
    mphLocalDetailState.selectedDate = normalizeMphDate(trigger.dataset.mphLocalDate);
    closeInlineMenus();
    renderMphLocalDetail();
    hydrateSupabaseOperationalData(mphLocalDetailState.selectedDate).catch(() => {});
    showToast(`Fecha aplicada: ${formatMphShortDate(mphLocalDetailState.selectedDate)}.`);
  });

  localDateNative?.addEventListener("change", () => {
    if (!(localDateNative instanceof HTMLInputElement) || !localDateNative.value) return;
    mphLocalDetailState.selectedDate = normalizeMphDate(`${localDateNative.value}T12:00:00`);
    renderMphLocalDetail();
    hydrateSupabaseOperationalData(mphLocalDetailState.selectedDate).catch(() => {});
    showToast(`Fecha aplicada: ${formatMphShortDate(mphLocalDetailState.selectedDate)}.`);
  });

  financeDateNative?.addEventListener("change", () => {
    if (!(financeDateNative instanceof HTMLInputElement) || !financeDateNative.value) return;
    mphFinanceState.selectedDate = normalizeMphDate(`${financeDateNative.value}T12:00:00`);
    renderMphFinanceScreen();
    hydrateFinanceSnapshotFromSupabase().catch(() => {});
    showToast(`Finanzas actualizadas a ${formatMphShortDate(mphFinanceState.selectedDate)}.`);
  });

  financePeriodTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mphFinanceState.period = tab.dataset.mphFinancePeriod || "today";
      renderMphFinanceScreen();
      hydrateFinanceSnapshotFromSupabase().catch(() => {});
      showToast(`Periodo ${tab.textContent?.trim() || "Hoy"} aplicado en Finanzas.`);
    });
  });

  stockTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      stockState.activeFilter = tab.dataset.stockFilter || "all";
      refreshStockView();
    });
  });

  const stockVenueTrigger = document.getElementById("mphStockVenueTrigger");
  const stockVenueMenu    = document.getElementById("mphStockVenueMenu");
  const stockVenueLabel   = document.getElementById("mphStockVenueLabel");
  const stockVenueChevron = document.getElementById("mphStockVenueChevron");

  stockVenueTrigger?.addEventListener("click", () => {
    const open = stockVenueMenu.hidden === false;
    stockVenueMenu.hidden = open;
    stockVenueTrigger.setAttribute("aria-expanded", String(!open));
  });

  stockVenueMenu?.querySelectorAll("[data-stock-venue]").forEach(btn => {
    btn.addEventListener("click", () => {
      stockVenueMenu.querySelectorAll("[data-stock-venue]").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (stockVenueLabel) stockVenueLabel.textContent = btn.textContent.trim();
      stockState.activeVenue = btn.dataset.stockVenue || "todos";
      stockVenueMenu.hidden = true;
      stockVenueTrigger?.setAttribute("aria-expanded", "false");
      refreshStockView();
    });
  });

  document.addEventListener("click", (e) => {
    if (stockVenueMenu && !stockVenueMenu.hidden && !stockVenueTrigger?.contains(e.target) && !stockVenueMenu.contains(e.target)) {
      stockVenueMenu.hidden = true;
      stockVenueTrigger?.setAttribute("aria-expanded", "false");
    }
  });

  const stockSearchBtn    = document.getElementById("mphStockSearchBtn");
  const stockSearchbar    = document.getElementById("mphStockSearchbar");
  const stockSearchInput  = document.getElementById("mphStockSearchInput");
  const stockSearchCancel = document.getElementById("mphStockSearchCancel");
  const stockTopbar       = document.getElementById("mphStockTopbar");
  const stockEmpty        = document.getElementById("mphStockEmpty");

  function filterStock(query) {
    stockState.query = query;
    renderStockList();
  }

  stockSearchBtn?.addEventListener("click", () => {
    if (!stockSearchbar) return;
    stockSearchbar.hidden = false;
    stockTopbar && (stockTopbar.hidden = true);
    stockSearchInput?.focus();
  });

  stockSearchCancel?.addEventListener("click", () => {
    stockSearchbar && (stockSearchbar.hidden = true);
    stockTopbar && (stockTopbar.hidden = false);
    if (stockSearchInput) stockSearchInput.value = "";
    filterStock("");
  });

  stockSearchInput?.addEventListener("input", () => filterStock(stockSearchInput.value));

  document.querySelector(".mph-stock-list")?.addEventListener("click", (e) => {
    const item = e.target.closest(".mph-stock-item[data-product-id]");
    if (!item) return;
    openStockDetail(item.dataset.productId);
    switchMphScreen("stock-detail");
  });

  refreshStockView();

  scopeMenu?.querySelectorAll("[data-mph-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      scopeMenu.querySelectorAll("[data-mph-scope]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const venueKey = button.dataset.mphScope || "global";
      if (scopeLabel) scopeLabel.textContent = venueKey === "global" ? "Global" : button.textContent?.trim() || "Global";
      updatePanelData(venueKey, null);
      closeInlineMenus();
      showToast(`Vista ${button.textContent?.trim() || "Global"} aplicada.`);
    });
  });

  dateMenu?.querySelectorAll("[data-mph-date]").forEach((button) => {
    button.addEventListener("click", () => {
      dateMenu.querySelectorAll("[data-mph-date]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      const dateLabel2 = button.dataset.mphDate || button.textContent?.trim() || "Hoy, 24 may";
      if (dateLabel) dateLabel.textContent = dateLabel2;
      const periodKey = periodKeyMap[dateLabel2] || "today";
      updatePanelData(null, periodKey);
      closeInlineMenus();
      showToast(`Periodo ${dateLabel2} aplicado.`);
    });
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;
    if (
      scopeMenu?.contains(event.target) ||
      dateMenu?.contains(event.target) ||
      localDateMenu?.contains(event.target) ||
      scopeTrigger?.contains(event.target) ||
      dateTrigger?.contains(event.target) ||
      localDateTrigger?.contains(event.target)
    ) return;
    closeInlineMenus();
  });

  applyVenuePeriod(activeVenuePeriod, false);
  updatePanelData("global", "today");
  openMphLocalDetail("kapital-madrid");
  renderMphFinanceScreen();
  hydrateFinanceSnapshotFromSupabase().catch(() => {});
  renderMphCategoryTable();
  openMphCategoryDetail("barra", false);
  renderMphStaffSheet("carlos");
  switchMphStaffTab("summary", false);
  hydrateSupabaseVenue().catch(() => {});
  hydrateSupabaseOperationalData().catch(() => {});
  syncAuthUi().catch(() => {});
})();
