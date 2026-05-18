(function initMphSupabase(global) {
  const config = global.MPH_SUPABASE_CONFIG || {};
  const supabaseSdk = global.supabase;
  const state = {
    client: null,
    venue: null,
    connected: false,
    status: "idle",
    error: null,
    session: null,
    user: null,
    bootPromise: null,
    authBound: false,
  };

  function emitStatus(status, extra = {}) {
    state.status = status;
    state.error = extra.error || null;
    const detail = {
      status,
      connected: state.connected,
      venue: state.venue,
      error: state.error,
      user: state.user,
      ...extra,
    };
    global.document?.documentElement?.setAttribute("data-supabase-state", status);
    global.dispatchEvent(new CustomEvent("mph:supabase-status", { detail }));
    if (config.debug) console.info("[MPH Supabase]", detail);
  }

  function syncAuthState(session) {
    state.session = session || null;
    state.user = session?.user || null;
    global.document?.documentElement?.setAttribute("data-auth-state", state.user ? "authenticated" : "anonymous");
  }

  function emitAuth(event, extra = {}) {
    const detail = {
      event,
      session: state.session,
      user: state.user,
      venue: state.venue,
      ...extra,
    };
    global.dispatchEvent(new CustomEvent("mph:supabase-auth", { detail }));
    if (config.debug) console.info("[MPH Auth]", detail);
  }

  async function withTimeout(promise, label, timeoutMs = 8000) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = global.setTimeout(() => reject(new Error(`${label} timeout`)), timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      global.clearTimeout(timeoutId);
    }
  }

  function isConfigured() {
    return Boolean(config.url && config.publishableKey);
  }

  function getClient() {
    if (!state.client && supabaseSdk && isConfigured()) {
      state.client = supabaseSdk.createClient(config.url, config.publishableKey, {
        db: { schema: config.schema || "public" },
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
        global: {
          headers: {
            "x-opsnight-client": "vipsupermanager-static",
          },
        },
      });
    }
    return state.client;
  }

  function ensureClient() {
    return getClient();
  }

  async function safeSingle(builder) {
    try {
      const { data, error } = await builder;
      if (error) throw error;
      return data || null;
    } catch (error) {
      return null;
    }
  }

  async function safeMany(builder) {
    try {
      const { data, error } = await builder;
      if (error) throw error;
      return data || [];
    } catch (error) {
      return [];
    }
  }

  async function loadVenue() {
    const client = getClient();
    if (!client || !config.venueSlug) return null;
    return safeSingle(
      client
        .from("venues")
        .select("id, slug, name, city, legal_capacity, timezone, settings")
        .eq("slug", config.venueSlug)
        .maybeSingle()
    );
  }

  async function boot() {
    if (state.bootPromise) return state.bootPromise;

    state.bootPromise = (async () => {
      if (!supabaseSdk) {
        emitStatus("sdk-missing");
        return null;
      }

      if (!isConfigured()) {
        emitStatus("unconfigured");
        return null;
      }

      try {
        emitStatus("connecting");
        const client = getClient();
        const sessionResult = await withTimeout(client.auth.getSession(), "auth session");
        syncAuthState(sessionResult?.data?.session || null);
        if (!state.authBound) {
          client.auth.onAuthStateChange((event, session) => {
            syncAuthState(session || null);
            emitAuth(event);
          });
          state.authBound = true;
        }
        state.connected = true;
        emitStatus("connected", { venue: state.venue });
        try {
          state.venue = await withTimeout(loadVenue(), "venue bootstrap", 4000);
        } catch (error) {
          state.venue = state.venue || null;
        }
        emitStatus("connected", { venue: state.venue });
        emitAuth("INITIAL_SESSION");
        global.dispatchEvent(new CustomEvent("mph:supabase-ready", { detail: { client, venue: state.venue, config } }));
        return client;
      } catch (error) {
        state.connected = false;
        state.error = error;
        emitStatus("error", { error: error?.message || String(error) });
        state.bootPromise = null;
        return null;
      }
    })();

    return state.bootPromise;
  }

  async function fetchRows(table, options = {}) {
    const client = ensureClient() || await boot();
    if (!client) return [];

    const {
      columns = "*",
      match = {},
      orderBy,
      ascending = true,
      limit,
    } = options;

    let query = client.from(table).select(columns);
    Object.entries(match).forEach(([column, value]) => {
      if (value !== undefined && value !== null && value !== "") query = query.eq(column, value);
    });
    if (orderBy) query = query.order(orderBy, { ascending });
    if (typeof limit === "number") query = query.limit(limit);

    return safeMany(query);
  }

  async function fetchRow(table, options = {}) {
    const rows = await fetchRows(table, { ...options, limit: 1 });
    return rows[0] || null;
  }

  function getSession() {
    return state.session;
  }

  function getCurrentUser() {
    return state.user;
  }

  async function signInWithPassword({ email, password }) {
    const client = ensureClient();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (!error) {
        syncAuthState(data?.session || null);
        state.venue = state.venue || await withTimeout(loadVenue(), "venue login hydrate", 4000).catch(() => null);
        state.connected = true;
        state.bootPromise = Promise.resolve(client);
        emitStatus("connected", { venue: state.venue });
      }
      return { data: data || null, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function signOut() {
    const client = ensureClient();
    if (!client) return { error: new Error("Supabase not ready") };

    try {
      const { error } = await client.auth.signOut();
      if (!error) syncAuthState(null);
      return { error: error || null };
    } catch (error) {
      return { error };
    }
  }

  async function listUserVenueRoles() {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id || !state.user?.id) return [];

    const client = ensureClient();
    if (!client) return [];

    const readRoles = () => safeMany(
      client
        .from("venue_user_roles")
        .select("id, venue_id, user_id, role_key, is_active, created_at")
        .eq("venue_id", venue.id)
        .eq("user_id", state.user.id)
        .eq("is_active", true)
        .order("role_key", { ascending: true })
    );

    const roles = await readRoles();
    if (roles.length || !state.user?.id) return roles;

    await new Promise((resolve) => global.setTimeout(resolve, 250));
    return readRoles();
  }

  async function upsertRow(table, payload, onConflict) {
    const client = ensureClient() || await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      let query = client.from(table).upsert(payload);
      if (onConflict) query = query.select().single().throwOnError();
      const { data, error } = await query;
      return { data: data || null, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function insertRows(table, payload) {
    const client = ensureClient() || await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const { data, error } = await client.from(table).insert(payload).select();
      return { data: data || null, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function getFinanceSnapshot(snapshotDate, period) {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return null;
    return fetchRow("finance_daily_snapshots", {
      columns: "*",
      match: {
        venue_id: venue.id,
        snapshot_date: snapshotDate,
        period_key: period || "today",
      },
    });
  }

  async function listVipTables() {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return [];
    return fetchRows("vip_tables", {
      columns: "*",
      match: { venue_id: venue.id },
      orderBy: "sort_order",
      ascending: true,
    });
  }

  async function listVipReservations(reservationDate) {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return [];
    return fetchRows("vip_reservations", {
      columns: "*",
      match: {
        venue_id: venue.id,
        reservation_date: reservationDate || undefined,
      },
      orderBy: "created_at",
      ascending: false,
    });
  }

  async function listCapacityCounters() {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return [];
    return fetchRows("capacity_counters", {
      columns: "*",
      match: { venue_id: venue.id },
      orderBy: "sort_order",
      ascending: true,
    });
  }

  async function listProducts(section) {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return [];
    return fetchRows("products", {
      columns: "*",
      match: {
        venue_id: venue.id,
        section_key: section || undefined,
        is_active: true,
      },
      orderBy: "sort_order",
      ascending: true,
    });
  }

  async function createPosSale({ sectionKey, paymentMethod, ticketItems, customerName }) {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return { data: null, error: new Error("Venue not ready") };
    const items = Array.isArray(ticketItems) ? ticketItems.filter(Boolean) : [];
    if (!items.length) return { data: null, error: new Error("Ticket is empty") };

    const totalAmount = items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 0)), 0);
    const saleId = global.crypto?.randomUUID?.() || `sale-${Date.now()}`;
    const salePayload = {
      id: saleId,
      venue_id: venue.id,
      section_key: sectionKey,
      sale_number: `${sectionKey}-${Date.now()}`,
      sale_status: "paid",
      payment_status: "paid",
      total_amount: Number(totalAmount.toFixed(2)),
      tax_amount: 0,
      customer_name: customerName || null,
      metadata: {
        payment_method: paymentMethod,
        source: "prototype-ui",
      },
    };
    const client = await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const { error: saleError } = await client.from("pos_sales").insert(salePayload);
      if (saleError) return { data: null, error: saleError };

      const itemRows = items.map((item) => ({
        sale_id: saleId,
        product_id: item.id || null,
        product_name: item.name,
        quantity: Number(item.qty || 0),
        unit_price: Number(item.price || 0),
        line_total: Number((Number(item.price || 0) * Number(item.qty || 0)).toFixed(2)),
        metadata: {
          category: item.category || null,
          tag: item.tag || null,
          sku: item.sku || null,
        },
      }));

      const { error: itemsError } = await client.from("pos_sale_items").insert(itemRows);
      if (itemsError) return { data: { sale: salePayload, items: itemRows }, error: itemsError };

      return { data: { sale: salePayload, items: itemRows }, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function updateCapacityCounter(counterId, counterValue) {
    const client = await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const { data, error } = await client
        .from("capacity_counters")
        .update({ counter_value: counterValue })
        .eq("id", counterId)
        .select()
        .single();
      return { data: data || null, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function updateVipTable(tableId, payload) {
    const client = await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const { data, error } = await client
        .from("vip_tables")
        .update(payload)
        .eq("id", tableId)
        .select()
        .single();
      return { data: data || null, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function createVipReservation(payload) {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return { data: null, error: new Error("Venue not ready") };
    const client = await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const row = {
        venue_id: venue.id,
        ...payload,
      };
      const { data, error } = await client.from("vip_reservations").insert(row).select().single();
      return { data: data || null, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function updateVipReservation(reservationId, payload) {
    const client = await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const { data, error } = await client
        .from("vip_reservations")
        .update(payload)
        .eq("id", reservationId)
        .select()
        .single();
      return { data: data || null, error: error || null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async function createCloakroomTicket({ ticketItems, paymentMethod, notes }) {
    const venue = state.venue || (await loadVenue());
    if (!venue?.id) return { data: null, error: new Error("Venue not ready") };
    const items = Array.isArray(ticketItems) ? ticketItems.filter(Boolean) : [];
    if (!items.length) return { data: null, error: new Error("Ticket is empty") };

    const itemCount = items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const amount = items.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.qty || 0)), 0);
    const payload = {
      venue_id: venue.id,
      ticket_code: `GR-${Date.now()}`,
      status: "open",
      item_count: itemCount,
      amount: Number(amount.toFixed(2)),
      notes: notes || null,
    };

    const client = await boot();
    if (!client) return { data: null, error: new Error("Supabase not ready") };

    try {
      const { error } = await client.from("cloakroom_tickets").insert(payload);
      if (error) return { data: null, error };
      return { data: payload, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  function subscribeToChannel(topic, handlers = {}) {
    const client = getClient();
    if (!client || !config.realtime) return null;
    const channel = client.channel(topic);
    if (handlers.broadcast) channel.on("broadcast", { event: "*" }, handlers.broadcast);
    if (handlers.presenceSync) channel.on("presence", { event: "sync" }, handlers.presenceSync);
    if (handlers.presenceJoin) channel.on("presence", { event: "join" }, handlers.presenceJoin);
    if (handlers.presenceLeave) channel.on("presence", { event: "leave" }, handlers.presenceLeave);
    channel.subscribe();
    return channel;
  }

  global.mphSupabase = {
    boot,
    getClient,
    get config() {
      return config;
    },
    get state() {
      return {
        status: state.status,
        connected: state.connected,
        venue: state.venue,
        error: state.error,
        user: state.user,
        session: state.session,
      };
    },
    isConfigured,
    getSession,
    getCurrentUser,
    signInWithPassword,
    signOut,
    loadVenue,
    listUserVenueRoles,
    fetchRows,
    fetchRow,
    upsertRow,
    insertRows,
    getFinanceSnapshot,
    listVipTables,
    listVipReservations,
    listCapacityCounters,
    listProducts,
    createPosSale,
    createCloakroomTicket,
    updateCapacityCounter,
    updateVipTable,
    createVipReservation,
    updateVipReservation,
    subscribeToChannel,
  };

  boot();
})(window);
