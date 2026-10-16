import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { cancelRegistration, selectMyRegistrations } from '../features/registrations/registrationsSlice';
import { showToast } from '../features/ui/uiSlice';
import { isPastEvent, getEventDate } from '../utils/eventUtils';
import EventCard from '../components/EventCard';

export default function MyEventsPage() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.currentUser);
  const registrations = useSelector(selectMyRegistrations);
  const [tab, setTab] = useState('upcoming');

  const byDate = (a, b) => (getEventDate(a) ?? 0) - (getEventDate(b) ?? 0);
  // .filter() returns a new array, so .sort() is safe (Redux state is frozen)
  const upcoming = registrations.filter((e) => !isPastEvent(e)).sort(byDate);
  const completed = registrations.filter(isPastEvent).sort(byDate).reverse();
  const shown = tab === 'upcoming' ? upcoming : completed;

  const handleCancel = (event) => {
    if (!window.confirm(`Cancel registration for “${event.name}”?`)) return;
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }));
    dispatch(showToast({ type: 'info', message: 'Registration cancelled' }));
  };

  return (
    <>
      <h1>My Events</h1>
      <div className="tabs">
        <button className={`chip ${tab === 'upcoming' ? 'active' : ''}`} onClick={() => setTab('upcoming')}>
          Upcoming ({upcoming.length})
        </button>
        <button className={`chip ${tab === 'completed' ? 'active' : ''}`} onClick={() => setTab('completed')}>
          Completed ({completed.length})
        </button>
      </div>

      {shown.length === 0 ? (
        <p className="muted empty">
          {tab === 'upcoming'
            ? <>You have no upcoming events. <Link to="/events">Browse events</Link></>
            : 'No completed events yet.'}
        </p>
      ) : (
        <div className="grid">
          {shown.map((ev) => (
            <EventCard key={ev.id} event={ev}>
              <p className="muted small">Registered {new Date(ev.registeredAt).toLocaleDateString()}</p>
              {tab === 'upcoming'
                ? <button className="btn btn-danger" onClick={() => handleCancel(ev)}>Cancel registration</button>
                : <span className="badge">Completed</span>}
            </EventCard>
          ))}
        </div>
      )}
    </>
  );
}