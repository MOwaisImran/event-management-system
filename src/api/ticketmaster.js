const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TM_API_KEY;

async function request(path, params = {}, signal) {
  if (!API_KEY) {
    throw new Error('Missing API key. Add VITE_TM_API_KEY to your .env file and restart.');
  }
  const qs = new URLSearchParams({ apikey: API_KEY });
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.append(key, value);
  });

  const res = await fetch(`${BASE_URL}${path}?${qs.toString()}`, { signal });

  if (!res.ok) {
    if (res.status === 429) throw new Error('Too many requests. Wait a second and try again.');
    if (res.status === 401) throw new Error('Invalid API key.');
    throw new Error(`Request failed (${res.status})`);
  }
  return res.json();
}

export const getEvents = (params, signal) => request('/events.json', params, signal);
export const getEventById = (id, signal) => request(`/events/${id}.json`, {}, signal);
export const getClassifications = (signal) => request('/classifications.json', { size: 50 }, signal);