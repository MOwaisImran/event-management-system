import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../features/events/eventsSlice';

export default function CategoryChips() {
  const dispatch = useDispatch();
  const categories = useSelector((s) => s.events.categories);
  const active = useSelector((s) => s.events.filters.category);

  return (
    <div className="chips">
      <button
        className={`chip ${active === '' ? 'active' : ''}`}
        onClick={() => dispatch(setFilters({ category: '' }))}
      >All</button>
      {categories.map((c) => (
        <button
          key={c}
          className={`chip ${active === c ? 'active' : ''}`}
          onClick={() => dispatch(setFilters({ category: c }))}
        >{c}</button>
      ))}
    </div>
  );
}