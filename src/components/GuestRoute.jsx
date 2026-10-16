import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GuestRoute({ children }) {
  const user = useSelector((s) => s.auth.currentUser);
  return user ? <Navigate to="/events" replace /> : children;
}