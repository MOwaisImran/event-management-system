import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';
import { selectMyRegistrations } from '../features/registrations/registrationsSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.currentUser);
  const myCount = useSelector(selectMyRegistrations).length;

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(showToast({ type: 'info', message: 'You have been logged out' }));
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/events" className="brand">EventHub</Link>
      <nav className="nav-links">
        <NavLink to="/events">Events</NavLink>
        {user && <NavLink to="/my-events">My Events ({myCount})</NavLink>}
      </nav>
      <div className="nav-user">
        {user ? (
          <>
            <span className="muted">Hi, {user.name}</span>
            <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="btn btn-outline" to="/login">Login</Link>
            <Link className="btn" to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
}