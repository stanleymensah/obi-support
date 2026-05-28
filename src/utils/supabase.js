const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function buildUrl(table, { columns = "*", filters = [], order = null } = {}) {
  const url = new URL(`${supabaseUrl}/rest/v1/${table}`);
  url.searchParams.set("select", columns);

  filters.forEach((filter) => {
    if (filter.type === "eq") {
      url.searchParams.set(filter.column, `eq.${filter.value}`);
    }
    if (filter.type === "is") {
      url.searchParams.set(filter.column, `is.${filter.value}`);
    }
  });

  if (order?.column) {
    url.searchParams.set("order", `${order.column}.${order.ascending ? "asc" : "desc"}`);
  }

  return url.toString();
}

async function request({
  method,
  table,
  columns = "*",
  body,
  filters = [],
  order = null,
  returnRepresentation = false,
}) {
  const response = await fetch(buildUrl(table, { columns, filters, order }), {
    method,
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      ...(returnRepresentation ? { Prefer: "return=representation" } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message || data?.error || text || `Request to ${table} failed`;
    return { data: null, error: new Error(message) };
  }

  return { data, error: null };
}

function createQueryBuilder(table) {
  const state = {
    filters: [],
    order: null,
  };

  return {
    eq(column, value) {
      state.filters.push({ type: "eq", column, value });
      return this;
    },
    is(column, value) {
      state.filters.push({ type: "is", column, value });
      return this;
    },
    order(column, options = {}) {
      state.order = { column, ascending: options.ascending !== false };
      return this;
    },
    select(columns = "*") {
      return request({
        method: "GET",
        table,
        columns,
        filters: state.filters,
        order: state.order,
      });
    },
    insert(payload) {
      return request({
        method: "POST",
        table,
        body: Array.isArray(payload) ? payload : [payload],
        returnRepresentation: true,
      });
    },
    update(payload) {
      return request({
        method: "PATCH",
        table,
        body: payload,
        filters: state.filters,
        returnRepresentation: true,
      });
    },
    delete() {
      return request({
        method: "DELETE",
        table,
        filters: state.filters,
        returnRepresentation: true,
      });
    },
  };
}

export const supabase = {
  from(table) {
    return createQueryBuilder(table);
  },
};