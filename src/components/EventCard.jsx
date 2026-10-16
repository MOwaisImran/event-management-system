import { Link } from 'react-router-dom';
import { formatEventDate } from '../utils/eventUtils';

export default function EventCard({ event, children }) {
  return (
    <article className="card event-card">
      <Link to={`/events/${event.id}`}>
        {event.image
          ? <img src={event.image} alt={event.name} loading="lazy" />
          : <div className="img-placeholder">No image</div>}
      </Link>
      <div className="event-card-body">
        {event.segment && <span className="badge">{event.segment}</span>}
        <h3><Link to={`/events/${event.id}`}>{event.name}</Link></h3>
        <p className="muted">{formatEventDate(event)}</p>
        <p className="muted">{[event.venueName, event.city].filter(Boolean).join(', ') || 'Venue TBA'}</p>
        {children}
      </div>
    </article>
  );
}