export async function safeFetch(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!text) return { ok: false, status: res.status, data: null };
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: false, status: res.status, data: null };
  }
}
