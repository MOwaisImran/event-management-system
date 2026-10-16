import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../features/auth/authSlice';
import { showToast } from '../features/ui/uiSlice';
import { validateLogin } from '../utils/validators';

const FIELDS = [
  ['email', 'Email', 'email'],
  ['password', 'Password', 'password'],
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? '/events';
  const authError = useSelector((s) => s.auth.error);
  const currentUser = useSelector((s) => s.auth.currentUser);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => () => dispatch(clearAuthError()), [dispatch]);

  useEffect(() => {
    if (currentUser) {
      dispatch(showToast({ type: 'success', message: `Welcome back, ${currentUser.name}!` }));
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, dispatch, navigate, redirectTo]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length === 0) dispatch(loginUser(form));
  };

  return (
    <div className="card form-card">
      <h1>Log in</h1>
      {location.state?.from && <div className="alert alert-info">Please log in to continue.</div>}
      {authError && <div className="alert alert-error">{authError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        {FIELDS.map(([field, label, type]) => (
          <label key={field} className="field">
            <span>{label}</span>
            <input
              name={field}
              type={type}
              value={form[field]}
              onChange={handleChange}
              className={errors[field] ? 'invalid' : ''}
            />
            {errors[field] && <small className="error-text">{errors[field]}</small>}
          </label>
        ))}
        <button className="btn btn-block" type="submit">Log in</button>
      </form>
      <p className="muted">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}