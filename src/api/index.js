import * as live from './ticketmaster';
import * as mock from './mockdata';

const api = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_TM_API_KEY ? mock : live;

export const getEvents = api.getEvents;
export const getEventById = api.getEventById;
export const getClassifications = api.getClassifications;