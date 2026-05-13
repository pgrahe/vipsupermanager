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
    const scannedCount = Math.round(snapshot.realCapacity * point.share);
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
  const opsProfile = mphVenueOperations[venueId] || mphVenueOperations["kapital-madrid"];
  const map = document.getElementById("mphLocalOpsMap");
  const detail = document.getElementById("mphLocalOpsDetail");
  if (!map || !detail) return;
  const sectionKey = mphLocalDetailState.section;
  const items = opsProfile[sectionKey] || [];
  if (!items.length) {
    map.innerHTML = "";
    detail.innerHTML = "";
    return;
  }
  if (!items.some((item) => item.id === mphLocalDetailState.pointId)) {
    mphLocalDetailState.pointId = items[0].id;
  }
  map.innerHTML = `
    <div class="mph-venue-map-shell">
      <div class="mph-venue-map-stage">DJ / cabina</div>
      <div class="mph-venue-map-entry">Entrada principal</div>
      <div class="mph-venue-map-zone">Main room</div>
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
  `;
  const snapshot = computeMphVenueDayMetrics(venueId, mphLocalDetailState.selectedDate);
  const point = items.find((item) => item.id === mphLocalDetailState.pointId) || items[0];
  const categoryTotal = sectionKey === "aforo" ? snapshot.realCapacity : snapshot.sections[sectionKey];
  const detailData = buildMphLocalSectionRows(sectionKey, point, snapshot, categoryTotal);
  detail.innerHTML = `
    <div class="mph-local-spotlight-head">
      <div>
        <strong>${point.name}</strong>
        <span>${point.subtitle}</span>
      </div>
      <span class="mph-local-spotlight-badge">${sectionKey === "aforo" ? "Control" : "Live"}</span>
    </div>
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
  mphLocalDetailState.pointId = (mphVenueOperations[venueId]?.bars || [])[0]?.id || null;
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

  const mphStockProducts = {
    "grey-goose": {
      name: "Grey Goose", category: "Vodka", venue: "Kapital Madrid", status: "critical",
      img: "https://www.pngplay.com/wp-content/uploads/15/Grey-Goose-Vodka-Transparent-Images.png",
      current: "8 botellas", min: "20 botellas", optimal: "36 botellas", avgConsumption: "12 bot/noche",
      supplier: "Bacardi-Martini Spain", lastOrder: "18 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€22.40", pvp: "€14.00/copa", margin: "€9.80/copa", marginPct: "69.8%", revenue7d: "€4,312",
    },
    "moet-chandon": {
      name: "Moët & Chandon", category: "Champagne", venue: "Pacha Ibiza", status: "critical",
      img: "https://www.pngplay.com/wp-content/uploads/15/Moet-Chandon-Brut-Imperial-PNG-Free-File-Download.png",
      current: "6 botellas", min: "15 botellas", optimal: "30 botellas", avgConsumption: "8 bot/noche",
      supplier: "LVMH Moët Hennessy", lastOrder: "15 may 2026", leadTime: "72 h", orderUnit: "Caja 6 uds",
      costPrice: "€36.20", pvp: "€180.00/botella", margin: "€143.80/bot", marginPct: "79.9%", revenue7d: "€6,840",
    },
    "johnnie-walker": {
      name: "Johnnie Walker", category: "Black Label", venue: "Opium Barcelona", status: "critical",
      img: "https://upload.wikimedia.org/wikipedia/commons/2/21/Johnnie_Walker_Black_Label.jpg",
      current: "10 botellas", min: "25 botellas", optimal: "40 botellas", avgConsumption: "9 bot/noche",
      supplier: "Diageo España", lastOrder: "20 may 2026", leadTime: "24 h", orderUnit: "Caja 12 uds",
      costPrice: "€18.60", pvp: "€12.00/copa", margin: "€8.10/copa", marginPct: "67.5%", revenue7d: "€3,960",
    },
    "bombay-sapphire": {
      name: "Bombay Sapphire", category: "Gin", venue: "Kapital Madrid", status: "low",
      img: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Bombay-sapphire.jpg",
      current: "28 botellas", min: "20 botellas", optimal: "45 botellas", avgConsumption: "7 bot/noche",
      supplier: "Bacardi-Martini Spain", lastOrder: "22 may 2026", leadTime: "48 h", orderUnit: "Caja 6 uds",
      costPrice: "€14.80", pvp: "€11.00/copa", margin: "€7.20/copa", marginPct: "65.4%", revenue7d: "€2,750",
    },
  };

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

  function applyVenuePeriod(periodKey, announce = false) {
    activeVenuePeriod = periodKey || "today";
    venueTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.mphPeriod === activeVenuePeriod));
    renderMphVenueRows(activeVenuePeriod);
    if (announce) showToast(`Periodo ${venueTabs.find((tab) => tab.dataset.mphPeriod === activeVenuePeriod)?.textContent?.trim() || "Hoy"} aplicado.`);
  }

  trigger?.addEventListener("click", openPreview);
  closeBtn?.addEventListener("click", closePreview);
  backBtn?.addEventListener("click", () => switchMphScreen("locales"));
  categoryBackBtn?.addEventListener("click", () => switchMphScreen("personal"));
  staffBackBtn?.addEventListener("click", () => switchMphScreen("category-detail"));
  stockDetailBackBtn?.addEventListener("click", () => switchMphScreen("stock"));
  localDateTrigger?.addEventListener("click", () => toggleInlineMenu(localDateMenu, localDateTrigger));
  localDatePickerBtn?.addEventListener("click", openLocalDatePicker);
  localCapacityInfoBtn?.addEventListener("click", () => {
    mphLocalDetailState.section = "aforo";
    mphLocalDetailState.pointId = (mphVenueOperations[mphLocalDetailState.venueId]?.aforo || [])[0]?.id || null;
    renderMphLocalDetail();
  });

  const drawerOverlay = document.getElementById("mphDrawerOverlay");
  const drawer = document.getElementById("mphDrawer");
  function openDrawer()  { if (drawerOverlay) drawerOverlay.hidden = false; }
  function closeDrawer() { if (drawerOverlay) drawerOverlay.hidden = true; }
  document.querySelectorAll(".mph-topbar .mph-icon-btn:first-child").forEach(btn => {
    if (btn.querySelector(".material-symbols-outlined")?.textContent?.trim() === "menu") {
      btn.addEventListener("click", openDrawer);
    }
  });
  drawerOverlay?.addEventListener("click", (e) => { if (!drawer?.contains(e.target)) closeDrawer(); });

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
      mphLocalDetailState.pointId = (mphVenueOperations[mphLocalDetailState.venueId]?.[mphLocalDetailState.section] || [])[0]?.id || null;
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
    showToast(`Fecha aplicada: ${formatMphShortDate(mphLocalDetailState.selectedDate)}.`);
  });

  localDateNative?.addEventListener("change", () => {
    if (!(localDateNative instanceof HTMLInputElement) || !localDateNative.value) return;
    mphLocalDetailState.selectedDate = normalizeMphDate(`${localDateNative.value}T12:00:00`);
    renderMphLocalDetail();
    showToast(`Fecha aplicada: ${formatMphShortDate(mphLocalDetailState.selectedDate)}.`);
  });

  document.querySelectorAll(".mph-stock-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      tab.closest(".mph-stock-tabs")?.querySelectorAll(".mph-stock-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
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
      stockVenueMenu.hidden = true;
      stockVenueTrigger?.setAttribute("aria-expanded", "false");
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
    const q = query.trim().toLowerCase();
    const items = document.querySelectorAll(".mph-stock-list .mph-stock-item");
    let visible = 0;
    items.forEach(item => {
      const name = item.querySelector("strong")?.textContent?.toLowerCase() || "";
      const cat  = item.querySelector("small")?.textContent?.toLowerCase()  || "";
      const match = !q || name.includes(q) || cat.includes(q);
      item.classList.toggle("mph-stock-item--hidden", !match);
      if (match) visible++;
    });
    if (stockEmpty) stockEmpty.classList.toggle("visible", visible === 0 && q.length > 0);
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
  renderMphCategoryTable();
  openMphCategoryDetail("barra", false);
  renderMphStaffSheet("carlos");
  switchMphStaffTab("summary", false);
})();
