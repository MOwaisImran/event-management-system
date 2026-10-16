const CATEGORIES = [
  { segment: 'Music', genres: ['Rock', 'Pop', 'Hip-Hop/Rap', 'Jazz'] },
  { segment: 'Sports', genres: ['Basketball', 'Football', 'Baseball', 'Hockey'] },
  { segment: 'Arts & Theatre', genres: ['Theatre', 'Comedy', 'Dance'] },
  { segment: 'Film', genres: ['Documentary', 'Drama'] },
  { segment: 'Miscellaneous', genres: ['Family', 'Fairs & Festivals'] },
];

const CITIES = [
  ['New York', 'New York', 'US', 'United States', 'America/New_York'],
  ['Los Angeles', 'California', 'US', 'United States', 'America/Los_Angeles'],
  ['Chicago', 'Illinois', 'US', 'United States', 'America/Chicago'],
  ['Toronto', 'Ontario', 'CA', 'Canada', 'America/Toronto'],
  ['London', 'England', 'GB', 'United Kingdom', 'Europe/London'],
  ['Sydney', 'New South Wales', 'AU', 'Australia', 'Australia/Sydney'],
];

const VENUES = ['Grand Arena', 'City Hall Theatre', 'Riverside Stadium', 'Harbour Pavilion', 'Old Town Club'];
const ADJECTIVES = ['Midnight', 'Electric', 'Golden', 'Summer', 'Neon', 'Velvet'];

function buildEvent(i) {
  const cat = CATEGORIES[i % CATEGORIES.length];
  const genre = cat.genres[i % cat.genres.length];
  const [city, state, countryCode, country, timezone] = CITIES[i % CITIES.length];
  const hour = 18 + (i % 4);

  const day = new Date();
  day.setUTCHours(0, 0, 0, 0);
  day.setUTCDate(day.getUTCDate() + (i * 5 - 40)); // from 40 days ago to ~315 days ahead
  const localDate = day.toISOString().slice(0, 10);
  const dateTime = new Date(day.getTime() + hour * 3600 * 1000).toISOString().replace(/\.\d{3}Z$/, 'Z');
  const min = 25 + (i % 7) * 10;

  return {
    id: `mock-${i}`,
    name: `${ADJECTIVES[i % ADJECTIVES.length]} ${genre} Live`,
    url: 'https://www.ticketmaster.com',
    images: [
      { ratio: '3_2', width: 305, height: 203, url: `https://picsum.photos/seed/ev${i}/305/203` },
      { ratio: '16_9', width: 1024, height: 576, url: `https://picsum.photos/seed/ev${i}/1024/576` },
    ],
    dates: {
      start: { localDate, localTime: `${hour}:00:00`, dateTime },
      timezone,
      status: { code: i % 17 === 0 ? 'cancelled' : 'onsale' },
    },
    classifications: [{ segment: { name: cat.segment }, genre: { name: genre }, subGenre: { name: genre } }],
    priceRanges: i % 5 === 0 ? undefined : [{ type: 'standard', currency: 'USD', min, max: min + 60 }],
    info: i % 3 === 0 ? `An unforgettable ${genre.toLowerCase()} experience. Doors open one hour before the show.` : undefined,
    pleaseNote: i % 4 === 0 ? 'All attendees must carry a valid ID. No re-entry after the event starts.' : undefined,
    seatmap: i % 2 === 0 ? { staticUrl: `https://picsum.photos/seed/seat${i}/600/400` } : undefined,
    _embedded: {
      venues: [{
        name: VENUES[i % VENUES.length],
        address: { line1: `${100 + i} Main Street` },
        city: { name: city },
        state: { name: state },
        country: { name: country, countryCode },
      }],
      attractions: [{ name: `${ADJECTIVES[i % ADJECTIVES.length]} ${genre} Collective` }],
    },
  };
}

export const MOCK_EVENTS = Array.from({ length: 72 }, (_, i) => buildEvent(i));
export const MOCK_CATEGORIES = CATEGORIES.map((c) => c.segment);

export const getEvents = (params = {}, signal) => {
  const page = Number(params.page ?? 0);
  const size = Number(params.size ?? 12);
  const keyword = String(params.keyword ?? '').trim().toLowerCase();
  const city = String(params.city ?? '').trim().toLowerCase();
  const countryCode = String(params.countryCode ?? '').trim().toUpperCase();
  const category = String(params.classificationName ?? '').trim();

  let items = [...MOCK_EVENTS];

  if (keyword) {
    items = items.filter((event) =>
      [event.name, event.venueName, event.city, event.segment, event.genre]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    );
  }

  if (city) {
    items = items.filter((event) => (event.city ?? '').toLowerCase().includes(city));
  }

  if (countryCode) {
    items = items.filter((event) => {
      const venueCountry = event._embedded?.venues?.[0]?.country?.countryCode ?? '';
      const rawCountry = event.country ?? '';
      return (
        venueCountry.toUpperCase() === countryCode ||
        rawCountry.toUpperCase() === countryCode ||
        (typeof rawCountry === 'string' && rawCountry.toUpperCase().includes(countryCode))
      );
    });
  }

  if (category) {
    items = items.filter((event) => (event.segment ?? '').toLowerCase() === category.toLowerCase());
  }

  if (signal?.aborted) {
    return Promise.reject(new DOMException('The operation was aborted.', 'AbortError'));
  }

  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = page * size;
  const paged = items.slice(start, start + size);

  return Promise.resolve({
    _embedded: { events: paged },
    page: { number: page, totalPages, totalElements },
  });
};

export const getEventById = (id, signal) => {
  if (signal?.aborted) {
    return Promise.reject(new DOMException('The operation was aborted.', 'AbortError'));
  }
  const event = MOCK_EVENTS.find((item) => item.id === id);
  if (!event) {
    return Promise.reject(new Error('Event not found'));
  }
  return Promise.resolve(event);
};

export const getClassifications = () => Promise.resolve({
  _embedded: {
    classifications: MOCK_CATEGORIES.map((name) => ({ segment: { name } })),
  },
});