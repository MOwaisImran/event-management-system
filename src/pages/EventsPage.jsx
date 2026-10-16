import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, fetchCategories, setPage } from '../features/events/eventsSlice';
import { buildEventParams } from '../utils/eventUtils';
import FilterBar from '../components/FilterBar';
import CategoryChips from '../components/CategoryChips';
import EventCard from '../components/EventCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import ErrorMessage from '../components/ErrorMessage';

export default function EventsPage() {
  const dispatch = useDispatch();
  const { list, status, error, filters, page, pageInfo, categories } = useSelector((s) => s.events);

  // Categories: fetch once
  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
  }, [dispatch, categories.length]);

  // Events: refetch when filters or page change. Abort the stale request on change.
  useEffect(() => {
    const request = dispatch(fetchEvents(buildEventParams(filters, page)));
    return () => request.abort();
  }, [dispatch, filters, page]);

  const retry = () => dispatch(fetchEvents(buildEventParams(filters, page)));

  return (
    <>
      <h1>Discover events</h1>
      <FilterBar />
      <CategoryChips />

      {status === 'loading' && <Spinner label="Fetching events…" />}
      {status === 'failed' && <ErrorMessage message={error} onRetry={retry} />}
      {status === 'succeeded' && list.length === 0 && (
        <p className="muted empty">No events match your search. Try another keyword, city or country.</p>
      )}

      {status !== 'failed' && list.length > 0 && (
        <>
          <p className="muted">{pageInfo.totalElements?.toLocaleString()} events found</p>
          <div className="grid">
            {list.map((ev, i) => <EventCard key={`${ev.id}-${i}`} event={ev} />)}
          </div>
          <Pagination
            page={page}
            totalPages={pageInfo.totalPages}
            onChange={(p) => {
              dispatch(setPage(p));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      )}
    </>
  );
}