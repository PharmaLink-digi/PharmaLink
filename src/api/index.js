const API_BASE = import.meta.env.VITE_API_BASE || ''

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || `API request failed with status ${res.status}`)
  }

  return res.json()
}

export async function fetchSales(pharmacyId) {
  return fetchJson(`${API_BASE}/sales?id=${encodeURIComponent(pharmacyId)}`)
}

export async function fetchMedications() {
  return fetchJson(`${API_BASE}/medications`)
}
