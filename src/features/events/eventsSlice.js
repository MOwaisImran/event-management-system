import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getEvents, getEventById, getClassifications } from '../../api';
import { normalizeEvent } from '../../utils/eventUtils';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (params, { rejectWithValue, signal }) => {
    try {
      const data = await getEvents(params, signal);
      return {
        events: (data._embedded?.events ?? []).map(normalizeEvent),
        page: data.page,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue, signal }) => {
    try {
      return normalizeEvent(await getEventById(id, signal));
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'events/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getClassifications();
      const names = (data._embedded?.classifications ?? [])
        .map((c) => c.segment?.name)
        .filter(Boolean);
      return [...new Set(names)].filter((n) => n !== 'Undefined').sort();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const defaultFilters = {
  keyword: '',
  category: '',
  city: '',
  countryCode: 'US',
  startDate: '',
  endDate: '',
  sort: 'date,asc',
};

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    list: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
    pageInfo: { number: 0, totalPages: 0, totalElements: 0 },
    page: 0,
    filters: defaultFilters,
    current: null,
    detailStatus: 'idle',
    detailError: null,
    categories: [],
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 0; // new filters -> back to first page
    },
    resetFilters(state) {
      state.filters = defaultFilters;
      state.page = 0;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.events;
        state.pageInfo = action.payload.page;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        if (action.meta.aborted) return; // a newer request replaced this one
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.detailStatus = 'loading';
        state.detailError = null;
        state.current = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.detailStatus = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        if (action.meta.aborted) return;
        state.detailStatus = 'failed';
        state.detailError = action.payload ?? action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setFilters, resetFilters, setPage } = eventsSlice.actions;
export default eventsSlice.reducer;