import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters, defaultFilters } from '../features/events/eventsSlice';

const COUNTRIES = [
  ['US', 'United States'], ['CA', 'Canada'], ['GB', 'United Kingdom'],
  ['AU', 'Australia'], ['DE', 'Germany'], ['ES', 'Spain'], ['IE', 'Ireland'],
];

const isoDate = (d) => d.toISOString().slice(0, 10);
const pick = (f) => ({
  keyword: f.keyword, city: f.city, countryCode: f.countryCode,
  startDate: f.startDate, endDate: f.endDate, sort: f.sort,
});

export default function FilterBar() {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.events.filters);
  const [draft, setDraft] = useState(pick(filters));

  const update = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const apply = (e) => {
    e.preventDefault();
    dispatch(setFilters(draft));
  };

  const reset = () => {
    dispatch(resetFilters());
    setDraft(pick(defaultFilters));
  };

  // Quick "upcoming" ranges
  const quickRange = (days) => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + days);
    const next = { ...draft, startDate: isoDate(start), endDate: isoDate(end) };
    setDraft(next);
    dispatch(setFilters(next));
  };

  return (
    <form className="card filter-bar" onSubmit={apply}>
      <input name="keyword" placeholder="Search events, artists, teams…" value={draft.keyword} onChange={update} />
      <input name="city" placeholder="City (e.g. New York)" value={draft.city} onChange={update} />
      <select name="countryCode" value={draft.countryCode} onChange={update}>
        <option value="">Any country</option>
        {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
      </select>
      <label className="inline-field">From <input type="date" name="startDate" value={draft.startDate} onChange={update} /></label>
      <label className="inline-field">To <input type="date" name="endDate" value={draft.endDate} onChange={update} /></label>
      <select name="sort" value={draft.sort} onChange={update}>
        <option value="date,asc">Soonest first</option>
        <option value="date,desc">Latest first</option>
        <option value="name,asc">Name A–Z</option>
      </select>
      <div className="filter-actions">
        <button className="btn" type="submit">Search</button>
        <button className="btn btn-outline" type="button" onClick={() => quickRange(7)}>Next 7 days</button>
        <button className="btn btn-outline" type="button" onClick={() => quickRange(30)}>Next 30 days</button>
        <button className="btn btn-outline" type="button" onClick={reset}>Reset</button>
      </div>
    </form>
  );
}